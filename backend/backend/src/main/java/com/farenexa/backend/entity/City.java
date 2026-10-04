package com.farenexa.backend.entity;

public class City {
private Long id;
private String cityName;
private String airportName;
private String airportCode;
private String countryName;
private String countryCode;

    public City() {
    }

    public City(String cityName, String airportName, String airportCode) {
        this.cityName = cityName;
        this.airportName = airportName;
        this.airportCode = airportCode;
    }

    public City(String cityName, String airportName, String airportCode, String countryName, String countryCode) {
        this.cityName = cityName;
        this.airportName = airportName;
        this.airportCode = airportCode;
        this.countryName = countryName;
        this.countryCode = countryCode;
    }

    public Long getId() {
        return id;
    }

    public String getCityName() {
        return cityName;
    }

    public void setCityName(String cityName) {
        this.cityName = cityName;
    }

    public String getAirportName() {
        return airportName;
    }

    public void setAirportName(String airportName) {
        this.airportName = airportName;
    }

    public String getAirportCode() {
        return airportCode;
    }

    public void setAirportCode(String airportCode) {
        this.airportCode = airportCode;
    }

    public String getCountryName() {
        return countryName;
    }

    public void setCountryName(String countryName) {
        this.countryName = countryName;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public void setCountryCode(String countryCode) {
        this.countryCode = countryCode;
    }
}