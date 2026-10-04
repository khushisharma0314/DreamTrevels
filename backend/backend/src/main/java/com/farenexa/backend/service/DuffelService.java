package com.farenexa.backend.service;

import com.farenexa.backend.dto.DuffelSearchRequest;
import com.farenexa.backend.entity.City;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.farenexa.backend.entity.Flight;
import com.farenexa.backend.entity.FlightSearchResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class DuffelService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public DuffelService(@Value("${duffel.api.token:}") String duffelToken) {

        this.restClient = RestClient.builder()
                .baseUrl("https://api.duffel.com")
                .defaultHeader(
                        HttpHeaders.AUTHORIZATION,
                        "Bearer " + duffelToken
                )
                .defaultHeader(
                        HttpHeaders.ACCEPT,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .defaultHeader(
                        HttpHeaders.CONTENT_TYPE,
                        MediaType.APPLICATION_JSON_VALUE
                )
                .defaultHeader(
                        "Duffel-Version",
                        "v2"
                )
                .build();
    }

    // =========================================================
    // FLIGHT SEARCH
    // =========================================================

    public String searchFlights(DuffelSearchRequest request) {

        try {

            Map<String, Object> data = new HashMap<>();

            // =================================================
            // SLICES
            // =================================================

            List<Map<String, Object>> slices = new ArrayList<>();

            Map<String, Object> outbound = new HashMap<>();

            outbound.put(
                    "origin",
                    request.getFrom()
            );

            outbound.put(
                    "destination",
                    request.getTo()
            );

            outbound.put(
                    "departure_date",
                    request.getDepartureDate()
            );

            slices.add(outbound);

            // =================================================
            // RETURN SLICE
            // =================================================

            if (request.getReturnDate() != null
                    && !request.getReturnDate().isBlank()) {

                Map<String, Object> inbound = new HashMap<>();

                inbound.put(
                        "origin",
                        request.getTo()
                );

                inbound.put(
                        "destination",
                        request.getFrom()
                );

                inbound.put(
                        "departure_date",
                        request.getReturnDate()
                );

                slices.add(inbound);
            }

            data.put(
                    "slices",
                    slices
            );

            // =================================================
            // PASSENGERS
            // =================================================

            List<Map<String, Object>> passengers =
                    new ArrayList<>();

            // =================================================
            // ADULTS
            // =================================================

            int adultsCount = Math.max(1, request.getAdults());

            for (int i = 0; i < adultsCount; i++) {
                Map<String, Object> passenger = new HashMap<>();
                passenger.put("type", "adult");
                passengers.add(passenger);
            }

            // =================================================
            // CHILDREN
            // =================================================

            for (int i = 0; i < request.getChildren(); i++) {
                Map<String, Object> passenger = new HashMap<>();
                passenger.put("type", "child");
                passengers.add(passenger);
            }

            // =================================================
            // INFANTS (Duffel uses infant_without_seat)
            // =================================================

            for (int i = 0; i < request.getInfants(); i++) {
                Map<String, Object> passenger = new HashMap<>();
                passenger.put("type", "infant_without_seat");
                passengers.add(passenger);
            }

            data.put(
                    "passengers",
                    passengers
            );

            // =================================================
            // CABIN CLASS (economy, premium_economy, business, first)
            // =================================================

            String rawCabin = request.getCabinClass();
            String cabinClass = "economy";

            if (rawCabin != null && !rawCabin.isBlank()) {
                String c = rawCabin.trim().toLowerCase().replace("-", "_").replace(" ", "_");
                if (c.contains("prem")) {
                    cabinClass = "premium_economy";
                } else if (c.contains("bus")) {
                    cabinClass = "business";
                } else if (c.contains("first")) {
                    cabinClass = "first";
                } else {
                    cabinClass = "economy";
                }
            }

            data.put(
                    "cabin_class",
                    cabinClass
            );

            // =================================================
            // FINAL BODY
            // =================================================

            Map<String, Object> body =
                    new HashMap<>();

            body.put(
                    "data",
                    data
            );

            // =================================================
            // DUFFEL API CALL
            // =================================================

            return restClient.post()
                    .uri(
                            "/air/offer_requests?return_offers=true"
                    )
                    .body(body)
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            e.printStackTrace();

            return "Duffel Error: " + e.getMessage();
        }
    }

    // =========================================================
    // GET SINGLE OFFER + AVAILABLE SERVICES
    // =========================================================

    public String getOffer(String offerId) {

        try {

            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/air/offers/{id}")
                            .queryParam(
                                    "return_available_services",
                                    true
                            )
                            .build(offerId))
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            e.printStackTrace();

            return "Duffel Error: " + e.getMessage();
        }
    }

    // =========================================================
    // GET SEAT MAP
    // =========================================================

    public String getSeatMap(String offerId) {

        try {

            return restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/air/seat_maps")
                            .queryParam(
                                    "offer_id",
                                    offerId
                            )
                            .build())
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            e.printStackTrace();

            return "Duffel Error: " + e.getMessage();
        }
    }

    // =========================================================
    // GET LOWEST FARE FOR SPECIFIC DATE (REAL-TIME DUFFEL CALL)
    // =========================================================
    public Double getLowestFareForDate(
            String from,
            String to,
            String departureDate,
            String returnDate,
            String cabinClass
    ) {
        if (from == null || to == null || departureDate == null || from.isBlank() || to.isBlank() || departureDate.isBlank()) {
            return null;
        }

        try {
            DuffelSearchRequest searchReq = new DuffelSearchRequest();
            searchReq.setFrom(from.trim().toUpperCase());
            searchReq.setTo(to.trim().toUpperCase());
            searchReq.setDepartureDate(departureDate.trim());
            if (returnDate != null && !returnDate.isBlank()) {
                searchReq.setReturnDate(returnDate.trim());
            }
            searchReq.setAdults(1);
            searchReq.setChildren(0);
            searchReq.setInfants(0);
            searchReq.setCabinClass(cabinClass != null && !cabinClass.isBlank() ? cabinClass : "economy");

            String rawJson = searchFlights(searchReq);
            if (rawJson == null || rawJson.startsWith("Duffel Error:")) {
                return null;
            }

            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode offersNode = root.path("data").path("offers");

            if (!offersNode.isArray() || offersNode.isEmpty()) {
                return null;
            }

            double minFare = Double.MAX_VALUE;
            for (JsonNode offerNode : offersNode) {
                double price = offerNode.path("total_amount").asDouble(0.0);
                if (price > 0 && price < minFare) {
                    minFare = price;
                }
            }

            return minFare == Double.MAX_VALUE ? null : minFare;
        } catch (Exception e) {
            System.err.println("Error fetching live fare for " + departureDate + ": " + e.getMessage());
            return null;
        }
    }

    // =========================================================
    // TEST DUFFEL CONNECTION
    // =========================================================

    public String testDuffelConnection() {

        try {

            return restClient.get()
                    .uri("/air/airports")
                    .retrieve()
                    .body(String.class);

        } catch (Exception e) {

            e.printStackTrace();

            return "Duffel Error: " + e.getMessage();
        }
    }

    // =========================================================
    // DUFFEL PLACES / AIRPORTS AUTOCOMPLETE
    // GET /places/suggestions?query={query}
    // =========================================================

    public List<City> searchPlaces(String query) {

        List<City> places = new ArrayList<>();

        if (query == null || query.trim().isEmpty()) {
            return places;
        }

        try {

            String rawJson = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/places/suggestions")
                            .queryParam("query", query.trim())
                            .build())
                    .retrieve()
                    .body(String.class);

            if (rawJson == null || rawJson.isBlank()) {
                return places;
            }

            JsonNode root = objectMapper.readTree(rawJson);
            JsonNode dataNode = root.path("data");

            if (dataNode.isArray()) {

                Map<String, City> uniquePlaces = new LinkedHashMap<>();

                for (JsonNode node : dataNode) {

                    String iataCode = node.path("iata_code").asText("").trim();
                    if (iataCode.isEmpty()) {
                        iataCode = node.path("iata_city_code").asText("").trim();
                    }

                    if (iataCode.isEmpty()) {
                        continue;
                    }

                    String cityName = node.path("city_name").asText("").trim();
                    if (cityName.isEmpty() && node.has("city")) {
                        cityName = node.path("city").path("name").asText("").trim();
                    }

                    String airportName = node.path("name").asText("").trim();

                    if (cityName.isEmpty()) {
                        cityName = airportName.isEmpty() ? iataCode : airportName;
                    }

                    if (airportName.isEmpty()) {
                        airportName = cityName;
                    }

                    String countryName = node.path("country_name").asText("").trim();
                    if (countryName.isEmpty() && node.has("country")) {
                        countryName = node.path("country").path("name").asText("").trim();
                    }

                    String countryCode = node.path("iata_country_code").asText("").trim();
                    if (countryCode.isEmpty() && node.has("country")) {
                        countryCode = node.path("country").path("iso_country_code").asText("").trim();
                    }

                    String codeUpper = iataCode.toUpperCase();

                    if (!uniquePlaces.containsKey(codeUpper)) {
                        City city = new City(cityName, airportName, codeUpper, countryName, countryCode);
                        uniquePlaces.put(codeUpper, city);
                    }
                }

                places.addAll(uniquePlaces.values());
            }

        } catch (Exception e) {
            System.err.println("Duffel searchPlaces error: " + e.getMessage());
        }

        return places;
    }

    // =========================================================
    // SEARCH + MAP DUFFEL RESPONSE
    // =========================================================
    //
    public FlightSearchResponse searchFlightsAndMap(
            DuffelSearchRequest request
    ) {

        // =========================================================
        // THIS PRINT HAPPENS ONLY ON CACHE MISS
        // =========================================================

        System.out.println(
                "========== DUFFEL API / CACHE MISS =========="
        );

        // =========================================================
        // CALL DUFFEL API
        // =========================================================

        String rawDuffelJson =
                searchFlights(request);

        List<Flight> departureFlights =
                new ArrayList<>();

        List<Flight> returnFlights =
                new ArrayList<>();

        // =========================================================
        // DUFFEL ERROR
        // =========================================================

        if (rawDuffelJson == null
                || rawDuffelJson.startsWith(
                "Duffel Error:"
        )) {

            return new FlightSearchResponse(
                    departureFlights,
                    returnFlights
            );
        }

        try {

            // =====================================================
            // PARSE DUFFEL JSON
            // =====================================================

            JsonNode root =
                    objectMapper.readTree(
                            rawDuffelJson
                    );

            JsonNode dataNode =
                    root.path("data");

            JsonNode offersNode =
                    dataNode.path("offers");

            // =====================================================
            // FALLBACK TO AVAILABLE CABINS IF SPECIFIC CABIN HAS 0 OFFERS
            // (e.g. Domestic routes with only all-economy aircraft)
            // =====================================================
            if ((!offersNode.isArray() || offersNode.isEmpty())
                    && request.getCabinClass() != null
                    && !request.getCabinClass().trim().equalsIgnoreCase("economy")) {

                DuffelSearchRequest fallbackReq = new DuffelSearchRequest();
                fallbackReq.setFrom(request.getFrom());
                fallbackReq.setTo(request.getTo());
                fallbackReq.setDepartureDate(request.getDepartureDate());
                fallbackReq.setReturnDate(request.getReturnDate());
                fallbackReq.setAdults(request.getAdults());
                fallbackReq.setChildren(request.getChildren());
                fallbackReq.setInfants(request.getInfants());
                fallbackReq.setCabinClass("economy");

                String fallbackJson = searchFlights(fallbackReq);
                if (fallbackJson != null && !fallbackJson.startsWith("Duffel Error:")) {
                    try {
                        JsonNode fallbackRoot = objectMapper.readTree(fallbackJson);
                        JsonNode fallbackData = fallbackRoot.path("data");
                        JsonNode fallbackOffers = fallbackData.path("offers");
                        if (fallbackOffers.isArray() && !fallbackOffers.isEmpty()) {
                            root = fallbackRoot;
                            dataNode = fallbackData;
                            offersNode = fallbackOffers;
                        }
                    } catch (Exception ignored) {
                    }
                }
            }

            // =====================================================
            // OFFERS
            // =====================================================

            if (offersNode.isArray()) {

                LocalDate depDate =
                        LocalDate.parse(
                                request.getDepartureDate()
                        );

                LocalDate retDate =
                        (
                                request.getReturnDate() != null
                                        && !request.getReturnDate().isBlank()
                        )
                                ? LocalDate.parse(
                                request.getReturnDate()
                        )
                                : null;

                // =================================================
                // LOOP OFFERS
                // =================================================

                for (JsonNode offerNode :
                        offersNode) {

                    // =============================================
                    // DUFFEL OFFER ID
                    // =============================================

                    String offerId =
                            offerNode
                                    .path("id")
                                    .asText("");

                    // =============================================
                    // TOTAL PRICE
                    // =============================================

                    double totalPrice =
                            offerNode
                                    .path("total_amount")
                                    .asDouble(0.0);

                    // =============================================
                    // SLICES
                    // =============================================

                    JsonNode slicesNode =
                            offerNode.path("slices");

                    if (slicesNode.isArray()
                            && !slicesNode.isEmpty()) {

                        JsonNode depSlice =
                                slicesNode.get(0);

                        // =========================================
                        // PRICE
                        // =========================================

                        double depPrice =
                                totalPrice;

                        double retPrice =
                                0.0;

                        boolean isRoundTrip =
                                slicesNode.size() > 1
                                        && retDate != null;

                        // =========================================
                        // ROUND TRIP PRICE
                        // =========================================

                        if (isRoundTrip) {

                            depPrice =
                                    Math.round(
                                            (totalPrice / 2.0)
                                                    * 100.0
                                    ) / 100.0;

                            retPrice =
                                    totalPrice - depPrice;
                        }

                        // =========================================
                        // DEPARTURE FLIGHT
                        // =========================================

                        Flight depFlight =
                                mapSliceToFlight(
                                        depSlice,
                                        depPrice,
                                        request.getCabinClass(),
                                        depDate,
                                        offerId,
                                        request.getFrom(),
                                        request.getTo(),
                                        offerNode
                                );

                        if (depFlight != null) {

                            departureFlights.add(
                                    depFlight
                            );
                        }

                        // =========================================
                        // RETURN FLIGHT
                        // =========================================

                        if (isRoundTrip) {

                            JsonNode retSlice =
                                    slicesNode.get(1);

                            Flight retFlight =
                                    mapSliceToFlight(
                                            retSlice,
                                            retPrice,
                                            request.getCabinClass(),
                                            retDate,
                                            offerId,
                                            request.getTo(),
                                            request.getFrom(),
                                            offerNode
                                    );

                            if (retFlight != null) {

                                returnFlights.add(
                                        retFlight
                                );
                            }
                        }
                    }
                }
            }

        } catch (Exception e) {

            e.printStackTrace();
        }

        // =========================================================
        // DEDUPLICATE DEPARTURE FLIGHTS
        // =========================================================

        Map<String, Flight> uniqueDepMap =
                new LinkedHashMap<>();

        for (Flight f : departureFlights) {

            String key =
                    f.getAirline()
                            + "|" +
                            f.getFlightNumber()
                            + "|" +
                            f.getFrom()
                            + "|" +
                            f.getTo()
                            + "|" +
                            f.getDepartureDate()
                            + "|" +
                            f.getDepartureTime();

            if (!uniqueDepMap.containsKey(key)
                    || f.getPrice()
                    < uniqueDepMap
                    .get(key)
                    .getPrice()) {

                uniqueDepMap.put(
                        key,
                        f
                );
            }
        }

        // =========================================================
        // DEDUPLICATE RETURN FLIGHTS
        // =========================================================

        Map<String, Flight> uniqueRetMap =
                new LinkedHashMap<>();

        for (Flight f : returnFlights) {

            String key =
                    f.getAirline()
                            + "|" +
                            f.getFlightNumber()
                            + "|" +
                            f.getFrom()
                            + "|" +
                            f.getTo()
                            + "|" +
                            f.getDepartureDate()
                            + "|" +
                            f.getDepartureTime();

            if (!uniqueRetMap.containsKey(key)
                    || f.getPrice()
                    < uniqueRetMap
                    .get(key)
                    .getPrice()) {

                uniqueRetMap.put(
                        key,
                        f
                );
            }
        }

        // =========================================================
        // Live Duffel results are returned directly; nothing is persisted.
        List<Flight> uniqueDepartureFlights = new ArrayList<>(uniqueDepMap.values());
        List<Flight> uniqueReturnFlights = new ArrayList<>(uniqueRetMap.values());

        return new FlightSearchResponse(
                uniqueDepartureFlights,
                uniqueReturnFlights
        );
    }

    // =========================================================
    // MAP SLICE TO FLIGHT
    // =========================================================
    // =========================================================

    private Flight mapSliceToFlight(
            JsonNode sliceNode,
            double price,
            String cabinClass,
            LocalDate requestedDate,
            String offerId,
            String defaultFrom,
            String defaultTo,
            JsonNode offerNode
    ) {

        JsonNode segmentsNode =
                sliceNode.path("segments");

        // =========================================================
        // NO SEGMENTS
        // =========================================================

        if (segmentsNode.isMissingNode()
                || !segmentsNode.isArray()
                || segmentsNode.isEmpty()) {

            return null;
        }

        JsonNode firstSegment =
                segmentsNode.get(0);

        JsonNode lastSegment =
                segmentsNode.get(
                        segmentsNode.size() - 1
                );

        // =========================================================
        // AIRLINE
        // =========================================================

        String airline =
                "Unknown Airline";

        JsonNode carrierNode =
                firstSegment.path(
                        "operating_carrier"
                );

        if (!carrierNode.isMissingNode()
                && !carrierNode.isNull()) {

            airline =
                    carrierNode
                            .path("name")
                            .asText(
                                    "Unknown Airline"
                            );

        } else {

            JsonNode marketingCarrier =
                    firstSegment.path(
                            "marketing_carrier"
                    );

            if (!marketingCarrier.isMissingNode()
                    && !marketingCarrier.isNull()) {

                airline =
                        marketingCarrier
                                .path("name")
                                .asText(
                                        "Unknown Airline"
                                );
            }
        }

        // =========================================================
        // FLIGHT NUMBER
        // =========================================================

        String flightNumber =
                firstSegment
                        .path(
                                "operating_carrier_flight_number"
                        )
                        .asText("N/A");

        if ("N/A".equals(flightNumber)
                || flightNumber.isBlank()) {

            flightNumber =
                    firstSegment
                            .path(
                                    "marketing_carrier_flight_number"
                            )
                            .asText("N/A");
        }

        // =========================================================
        // ROUTE - FROM
        // =========================================================

        String from =
                firstSegment
                        .path("origin")
                        .path("iata_code")
                        .asText("");

        if (from.isBlank()) {

            from =
                    sliceNode
                            .path("origin")
                            .path("iata_code")
                            .asText("");
        }

        if (from.isBlank()
                && defaultFrom != null) {

            from = defaultFrom;
        }

        // =========================================================
        // ROUTE - TO
        // =========================================================

        String to =
                lastSegment
                        .path("destination")
                        .path("iata_code")
                        .asText("");

        if (to.isBlank()) {

            to =
                    sliceNode
                            .path("destination")
                            .path("iata_code")
                            .asText("");
        }

        if (to.isBlank()
                && defaultTo != null) {

            to = defaultTo;
        }

        // =========================================================
        // TIME
        // =========================================================

        String departingAtStr =
                firstSegment
                        .path("departing_at")
                        .asText("");

        String arrivingAtStr =
                lastSegment
                        .path("arriving_at")
                        .asText("");

        String departureTime =
                "12:00";

        if (departingAtStr != null
                && departingAtStr.contains("T")) {

            departureTime =
                    departingAtStr.substring(
                            departingAtStr.indexOf("T") + 1,
                            departingAtStr.indexOf("T") + 6
                    );
        }

        String arrivalTime =
                "14:00";

        if (arrivingAtStr != null
                && arrivingAtStr.contains("T")) {

            arrivalTime =
                    arrivingAtStr.substring(
                            arrivingAtStr.indexOf("T") + 1,
                            arrivingAtStr.indexOf("T") + 6
                    );
        }

        // =========================================================
        // DURATION
        // =========================================================

        String duration =
                sliceNode
                        .path("duration")
                        .asText("N/A");

        if (duration != null && duration.startsWith("P")) {
            String temp = duration.toUpperCase();
            java.util.regex.Matcher dMatcher = java.util.regex.Pattern.compile("(\\d+)D").matcher(temp);
            java.util.regex.Matcher hMatcher = java.util.regex.Pattern.compile("(\\d+)H").matcher(temp);
            java.util.regex.Matcher mMatcher = java.util.regex.Pattern.compile("(\\d+)M").matcher(temp);

            int d = dMatcher.find() ? Integer.parseInt(dMatcher.group(1)) : 0;
            int h = hMatcher.find() ? Integer.parseInt(hMatcher.group(1)) : 0;
            int m = mMatcher.find() ? Integer.parseInt(mMatcher.group(1)) : 0;

            StringBuilder sb = new StringBuilder();
            if (d > 0) sb.append(d).append("d ");
            if (h > 0 || d > 0) sb.append(h).append("h ");
            if (m > 0 || (d == 0 && h == 0)) sb.append(m).append("m");
            duration = sb.toString().trim();
        }

        // =========================================================
        // STOPS
        // =========================================================

        int stops =
                segmentsNode.size() - 1;

        // =========================================================
        // CABIN CLASS
        // =========================================================

        String fClass =
                cabinClass != null
                        && !cabinClass.isBlank()
                        ? cabinClass
                        : "Economy";

        // =========================================================
        // CREATE FLIGHT
        // =========================================================

        Flight flight =
                new Flight(
                        airline,
                        flightNumber,
                        from.toUpperCase(),
                        to.toUpperCase(),
                        requestedDate,
                        departureTime,
                        arrivalTime,
                        duration,
                        fClass,
                        price,
                        20
                );

        flight.setStops(
                stops
        );

        flight.setDuffelOfferId(
                offerId
        );

        // =========================================================
        // FARE BRAND & CONDITIONS
        // =========================================================
        String fareBrandName = sliceNode.path("fare_brand_name").asText("");
        if (fareBrandName.isBlank() && offerNode != null) {
            fareBrandName = offerNode.path("fare_brand_name").asText("");
        }
        if (fareBrandName.isBlank()) {
            fareBrandName = fClass + " Basic";
        }
        flight.setFareBrandName(fareBrandName);

        if (offerNode != null) {
            JsonNode conditionsNode = offerNode.path("conditions");
            if (!conditionsNode.isMissingNode() && !conditionsNode.isNull()) {
                JsonNode refundNode = conditionsNode.path("refund_before_departure");
                if (!refundNode.isMissingNode() && !refundNode.isNull()) {
                    boolean isRefundAllowed = refundNode.path("allowed").asBoolean(false);
                    flight.setRefundable(isRefundAllowed);
                    String penalty = refundNode.path("penalty_amount").asText("");
                    if (!penalty.isBlank()) {
                        flight.setRefundPenalty(penalty + " " + refundNode.path("penalty_currency").asText(""));
                    }
                }

                JsonNode changeNode = conditionsNode.path("change_before_departure");
                if (!changeNode.isMissingNode() && !changeNode.isNull()) {
                    boolean isChangeAllowed = changeNode.path("allowed").asBoolean(true);
                    flight.setChangeable(isChangeAllowed);
                    String penalty = changeNode.path("penalty_amount").asText("");
                    if (!penalty.isBlank()) {
                        flight.setChangePenalty(penalty + " " + changeNode.path("penalty_currency").asText(""));
                    }
                }
            }

            // Baggage inclusions
            try {
                JsonNode passengersNode = offerNode.path("passengers");
                if (passengersNode.isArray() && !passengersNode.isEmpty()) {
                    JsonNode p0 = passengersNode.get(0);
                    JsonNode baggagesNode = p0.path("baggages");
                    if (baggagesNode.isArray()) {
                        int checkedCount = 0;
                        int carryOnCount = 0;
                        for (JsonNode bag : baggagesNode) {
                            String type = bag.path("type").asText("");
                            int qty = bag.path("quantity").asInt(1);
                            if ("checked".equalsIgnoreCase(type)) {
                                checkedCount += qty;
                            } else if ("carry_on".equalsIgnoreCase(type)) {
                                carryOnCount += qty;
                            }
                        }
                        flight.setCarryOnIncluded(Math.max(1, carryOnCount));
                        flight.setCheckedBagsIncluded(checkedCount);
                    }
                }
            } catch (Exception ignored) {
            }
        }

        return flight;
    }
}
