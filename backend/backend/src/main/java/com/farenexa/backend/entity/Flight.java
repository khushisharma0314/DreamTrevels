package com.farenexa.backend.entity;

import java.time.LocalDate;

public class Flight {
private Long id;

    private String airline;

    private String flightNumber;

    // Airport codes: DEL, BOM, BLR, HYD etc.
private String from;
private String to;
private LocalDate departureDate;

    private String departureTime;

    private String arrivalTime;

    private String duration;
private String flightClass;

    private double price;

    private int availableSeats;

    private int stops;

    // Duffel Offer ID
private String duffelOfferId;

    // Baggage & Policy Inclusions
    private int carryOnIncluded = 1;
    private int checkedBagsIncluded = 0;
    private String carryOnWeightKg = "7 kg";
    private String checkedBagWeightKg = "23 kg";
    private boolean isRefundable = false;
    private boolean isChangeable = true;
    private String fareBrandName = "Economy Basic";
    private String refundPenalty;
    private String changePenalty;

    public Flight() {
    }

    public Flight(
            String airline,
            String flightNumber,
            String from,
            String to,
            LocalDate departureDate,
            String departureTime,
            String arrivalTime,
            String duration,
            String flightClass,
            double price,
            int availableSeats
    ) {
        this.airline = airline;
        this.flightNumber = flightNumber;
        this.from = from;
        this.to = to;
        this.departureDate = departureDate;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.duration = duration;
        this.flightClass = flightClass;
        this.price = price;
        this.availableSeats = availableSeats;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAirline() {
        return airline;
    }

    public void setAirline(String airline) {
        this.airline = airline;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getFrom() {
        return from;
    }

    public void setFrom(String from) {
        this.from = from;
    }

    public String getTo() {
        return to;
    }

    public void setTo(String to) {
        this.to = to;
    }

    public LocalDate getDepartureDate() {
        return departureDate;
    }

    public void setDepartureDate(LocalDate departureDate) {
        this.departureDate = departureDate;
    }

    public String getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(String departureTime) {
        this.departureTime = departureTime;
    }

    public String getArrivalTime() {
        return arrivalTime;
    }

    public void setArrivalTime(String arrivalTime) {
        this.arrivalTime = arrivalTime;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getFlightClass() {
        return flightClass;
    }

    public void setFlightClass(String flightClass) {
        this.flightClass = flightClass;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public int getStops() {
        return stops;
    }

    public void setStops(int stops) {
        this.stops = stops;
    }

    public String getDuffelOfferId() {
        return duffelOfferId;
    }

    public void setDuffelOfferId(String duffelOfferId) {
        this.duffelOfferId = duffelOfferId;
    }

    public int getCarryOnIncluded() {
        return carryOnIncluded;
    }

    public void setCarryOnIncluded(int carryOnIncluded) {
        this.carryOnIncluded = carryOnIncluded;
    }

    public int getCheckedBagsIncluded() {
        return checkedBagsIncluded;
    }

    public void setCheckedBagsIncluded(int checkedBagsIncluded) {
        this.checkedBagsIncluded = checkedBagsIncluded;
    }

    public String getCarryOnWeightKg() {
        return carryOnWeightKg;
    }

    public void setCarryOnWeightKg(String carryOnWeightKg) {
        this.carryOnWeightKg = carryOnWeightKg;
    }

    public String getCheckedBagWeightKg() {
        return checkedBagWeightKg;
    }

    public void setCheckedBagWeightKg(String checkedBagWeightKg) {
        this.checkedBagWeightKg = checkedBagWeightKg;
    }

    public boolean isRefundable() {
        return isRefundable;
    }

    public void setRefundable(boolean refundable) {
        isRefundable = refundable;
    }

    public boolean isChangeable() {
        return isChangeable;
    }

    public void setChangeable(boolean changeable) {
        isChangeable = changeable;
    }

    public String getFareBrandName() {
        return fareBrandName;
    }

    public void setFareBrandName(String fareBrandName) {
        this.fareBrandName = fareBrandName;
    }

    public String getRefundPenalty() {
        return refundPenalty;
    }

    public void setRefundPenalty(String refundPenalty) {
        this.refundPenalty = refundPenalty;
    }

    public String getChangePenalty() {
        return changePenalty;
    }

    public void setChangePenalty(String changePenalty) {
        this.changePenalty = changePenalty;
    }
}