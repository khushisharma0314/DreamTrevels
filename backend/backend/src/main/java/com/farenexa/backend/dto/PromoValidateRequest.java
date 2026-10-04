package com.farenexa.backend.dto;

public class PromoValidateRequest {

    private String code;
    private double bookingAmount;

    public PromoValidateRequest() {
    }

    public PromoValidateRequest(String code, double bookingAmount) {
        this.code = code;
        this.bookingAmount = bookingAmount;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public double getBookingAmount() {
        return bookingAmount;
    }

    public void setBookingAmount(double bookingAmount) {
        this.bookingAmount = bookingAmount;
    }
}
