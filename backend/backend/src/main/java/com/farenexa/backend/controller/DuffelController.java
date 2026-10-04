package com.farenexa.backend.controller;

import com.farenexa.backend.dto.DuffelSearchRequest;
import com.farenexa.backend.service.DuffelService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/duffel")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class DuffelController {

    private final DuffelService duffelService;

    public DuffelController(
            DuffelService duffelService
    ) {
        this.duffelService = duffelService;
    }

    // =========================================================
    // FLIGHT SEARCH
    // =========================================================

    @PostMapping("/search")
    public com.farenexa.backend.entity.FlightSearchResponse searchFlights(
            @RequestBody DuffelSearchRequest request
    ) {

        return duffelService.searchFlightsAndMap(
                request
        );
    }

    // =========================================================
    // GET SINGLE OFFER + AVAILABLE SERVICES
    // =========================================================

    @GetMapping("/offer/{offerId}")
    public String getOffer(
            @PathVariable String offerId
    ) {

        return duffelService.getOffer(
                offerId
        );
    }

    // =========================================================
    // GET SEAT MAP
    // =========================================================

    @GetMapping("/seat-map/{offerId}")
    public String getSeatMap(
            @PathVariable String offerId
    ) {

        return duffelService.getSeatMap(
                offerId
        );
    }

    // =========================================================
    // TEST DUFFEL CONNECTION
    // =========================================================

    @GetMapping("/test")
    public String testDuffel() {

        return duffelService.testDuffelConnection();
    }
}