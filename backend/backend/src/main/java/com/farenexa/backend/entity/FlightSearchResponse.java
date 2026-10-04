package com.farenexa.backend.entity;

import java.util.List;

public class FlightSearchResponse {

    private List<Flight> departureFlights;
    private List<Flight> returnFlights;

    public FlightSearchResponse() {
    }

    public FlightSearchResponse(
            List<Flight> departureFlights,
            List<Flight> returnFlights
    ) {
        this.departureFlights = departureFlights;
        this.returnFlights = returnFlights;
    }

    public List<Flight> getDepartureFlights() {
        return departureFlights;
    }

    public void setDepartureFlights(List<Flight> departureFlights) {
        this.departureFlights = departureFlights;
    }

    public List<Flight> getReturnFlights() {
        return returnFlights;
    }

    public void setReturnFlights(List<Flight> returnFlights) {
        this.returnFlights = returnFlights;
    }
}