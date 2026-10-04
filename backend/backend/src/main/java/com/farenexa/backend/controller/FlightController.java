package com.farenexa.backend.controller;

import com.farenexa.backend.dto.DateMatrixItem;
import com.farenexa.backend.service.DuffelService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Locale;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class FlightController {

    private final DuffelService duffelService;
    private final ExecutorService matrixExecutor = Executors.newFixedThreadPool(7);
    private final Map<String, CachedMatrixResult> matrixCache = new ConcurrentHashMap<>();

    private static class CachedMatrixResult {
        private final List<DateMatrixItem> items;
        private final long timestamp;

        CachedMatrixResult(List<DateMatrixItem> items) {
            this.items = items;
            this.timestamp = System.currentTimeMillis();
        }
    }

    public FlightController(DuffelService duffelService) {
        this.duffelService = duffelService;
    }

    /**
     * Live low-fare date matrix. Every price comes from Duffel.
     * No database or generated/demo fare is used.
     */
    @GetMapping("/date-matrix")
    public ResponseEntity<List<DateMatrixItem>> getDateMatrix(
            @RequestParam(required = false) String from,
            @RequestParam(required = false) String to,
            @RequestParam String departureDate,
            @RequestParam(required = false) String returnDate,
            @RequestParam(required = false, defaultValue = "0") double basePrice,
            @RequestParam(required = false, defaultValue = "economy") String cabinClass
    ) {
        String cacheKey = (from == null ? "" : from.toUpperCase()) + ":" +
                (to == null ? "" : to.toUpperCase()) + ":" +
                departureDate + ":" +
                (returnDate == null || returnDate.isBlank() ? "oneway" : returnDate) + ":" +
                cabinClass.toLowerCase(Locale.ROOT);

        CachedMatrixResult cached = matrixCache.get(cacheKey);
        if (cached != null && System.currentTimeMillis() - cached.timestamp < 15 * 60 * 1000L) {
            return ResponseEntity.ok(cached.items);
        }

        LocalDate targetDate;
        try {
            targetDate = LocalDate.parse(departureDate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }

        LocalDate today = LocalDate.now();
        LocalDate startDate = targetDate.minusDays(3);
        if (startDate.isBefore(today)) {
            startDate = today;
        }

        DateTimeFormatter dayFormatter = DateTimeFormatter.ofPattern("EEE", Locale.ENGLISH);
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("d MMM", Locale.ENGLISH);

        List<DateMatrixItem> items = new ArrayList<>();
        Map<String, CompletableFuture<Double>> futureMap = new LinkedHashMap<>();

        LocalDate targetReturnDate = null;
        long tripDurationDays = 0;

        if (returnDate != null && !returnDate.isBlank()) {
            try {
                targetReturnDate = LocalDate.parse(returnDate);
                tripDurationDays = java.time.temporal.ChronoUnit.DAYS.between(targetDate, targetReturnDate);
                if (tripDurationDays < 1) tripDurationDays = 3;
            } catch (Exception ignored) {
            }
        }

        for (int i = 0; i < 7; i++) {
            LocalDate currentDate = startDate.plusDays(i);
            String dateStr = currentDate.toString();
            boolean selected = dateStr.equals(departureDate);

            double initialPrice = selected && basePrice > 0 ? basePrice : 0.0;
            items.add(new DateMatrixItem(
                    dateStr,
                    currentDate.format(dayFormatter),
                    currentDate.format(dateFormatter),
                    initialPrice,
                    false,
                    selected
            ));

            if (from != null && to != null && !from.isBlank() && !to.isBlank() && initialPrice == 0.0) {
                String matrixReturnDate = targetReturnDate == null
                        ? null
                        : currentDate.plusDays(tripDurationDays).toString();

                final String dateForSearch = dateStr;
                final String returnForSearch = matrixReturnDate;

                futureMap.put(dateStr, CompletableFuture.supplyAsync(
                        () -> duffelService.getLowestFareForDate(
                                from, to, dateForSearch, returnForSearch, cabinClass
                        ),
                        matrixExecutor
                ));
            }
        }

        if (!futureMap.isEmpty()) {
            try {
                CompletableFuture.allOf(futureMap.values().toArray(new CompletableFuture[0]))
                        .get(8, TimeUnit.SECONDS);
            } catch (Exception ignored) {
                // Individual results below are allowed to remain unavailable.
            }
        }

        double minPrice = Double.MAX_VALUE;

        for (DateMatrixItem item : items) {
            if (item.getPrice() <= 0) {
                CompletableFuture<Double> future = futureMap.get(item.getDate());
                if (future != null && future.isDone()) {
                    try {
                        Double livePrice = future.getNow(null);
                        if (livePrice != null && livePrice > 0) {
                            item.setPrice(livePrice);
                        }
                    } catch (Exception ignored) {
                    }
                }
            }

            if (item.getPrice() > 0 && item.getPrice() < minPrice) {
                minPrice = item.getPrice();
            }
        }

        if (minPrice < Double.MAX_VALUE) {
            for (DateMatrixItem item : items) {
                if (Math.abs(item.getPrice() - minPrice) < 0.01) {
                    item.setCheapest(true);
                    break;
                }
            }
        }

        matrixCache.put(cacheKey, new CachedMatrixResult(items));
        return ResponseEntity.ok(items);
    }
}
