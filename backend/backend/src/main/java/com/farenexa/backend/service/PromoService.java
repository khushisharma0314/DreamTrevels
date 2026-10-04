package com.farenexa.backend.service;

import com.farenexa.backend.dto.PromoResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PromoService {

    public static class PromoDefinition {
        private String code;
        private String title;
        private String description;
        private String discountType; // "FLAT" or "PERCENTAGE"
        private double discountValue;
        private double maxDiscount;
        private double minBookingAmount;

        public PromoDefinition(
                String code,
                String title,
                String description,
                String discountType,
                double discountValue,
                double maxDiscount,
                double minBookingAmount
        ) {
            this.code = code;
            this.title = title;
            this.description = description;
            this.discountType = discountType;
            this.discountValue = discountValue;
            this.maxDiscount = maxDiscount;
            this.minBookingAmount = minBookingAmount;
        }

        public String getCode() {
            return code;
        }

        public String getTitle() {
            return title;
        }

        public String getDescription() {
            return description;
        }

        public String getDiscountType() {
            return discountType;
        }

        public double getDiscountValue() {
            return discountValue;
        }

        public double getMaxDiscount() {
            return maxDiscount;
        }

        public double getMinBookingAmount() {
            return minBookingAmount;
        }
    }

    private final Map<String, PromoDefinition> promoCatalog = new HashMap<>();

    public PromoService() {
        // Initialize default promotional offers
        addPromo(new PromoDefinition(
                "FLYFIRST",
                "New User Special",
                "Flat ₹500 instant discount on bookings above ₹3,000",
                "FLAT",
                500,
                500,
                3000
        ));

        addPromo(new PromoDefinition(
                "FARE10",
                "10% Super Saver",
                "10% discount up to ₹1,500 on bookings above ₹2,500",
                "PERCENTAGE",
                10,
                1500,
                2500
        ));

        addPromo(new PromoDefinition(
                "SUPERFLY",
                "Mega Holiday Discount",
                "15% discount up to ₹2,000 on bookings above ₹4,000",
                "PERCENTAGE",
                15,
                2000,
                4000
        ));

        addPromo(new PromoDefinition(
                "FESTIVE750",
                "Festive Delight",
                "Flat ₹750 instant discount on bookings above ₹4,000",
                "FLAT",
                750,
                750,
                4000
        ));

        addPromo(new PromoDefinition(
                "DREAM500",
                "Dream Travel Member Special",
                "Flat ₹500 instant discount on bookings above ₹2,000",
                "FLAT",
                500,
                500,
                2000
        ));
    }

    private void addPromo(PromoDefinition promo) {
        promoCatalog.put(promo.getCode().toUpperCase(), promo);
    }

    public List<PromoResponse> getAvailablePromos() {
        List<PromoResponse> list = new ArrayList<>();
        for (PromoDefinition def : promoCatalog.values()) {
            PromoResponse res = new PromoResponse();
            res.setValid(true);
            res.setCode(def.getCode());
            res.setTitle(def.getTitle());
            res.setDescription(def.getDescription());
            res.setDiscountType(def.getDiscountType());
            res.setDiscountValue(def.getDiscountValue());
            res.setMaxDiscount(def.getMaxDiscount());
            res.setMinBookingAmount(def.getMinBookingAmount());
            res.setMessage("Apply code " + def.getCode() + " at checkout");
            list.add(res);
        }
        return list;
    }

    public PromoResponse validatePromo(String code, double bookingAmount) {
        if (code == null || code.trim().isEmpty()) {
            return new PromoResponse(false, "Please enter a valid promo code.");
        }

        String normalizedCode = code.trim().toUpperCase();
        PromoDefinition def = promoCatalog.get(normalizedCode);

        if (def == null) {
            return new PromoResponse(false, "Invalid promo code '" + code + "'. Please check the spelling.");
        }

        if (bookingAmount <= 0) {
            return new PromoResponse(false, "Booking amount must be greater than zero.");
        }

        if (bookingAmount < def.getMinBookingAmount()) {
            return new PromoResponse(
                    false,
                    "Code " + def.getCode() + " requires a minimum booking amount of ₹"
                            + String.format("%,.0f", def.getMinBookingAmount()) + "."
            );
        }

        double calculatedDiscount = 0;
        if ("FLAT".equalsIgnoreCase(def.getDiscountType())) {
            calculatedDiscount = def.getDiscountValue();
        } else if ("PERCENTAGE".equalsIgnoreCase(def.getDiscountType())) {
            calculatedDiscount = (bookingAmount * def.getDiscountValue()) / 100.0;
            if (def.getMaxDiscount() > 0 && calculatedDiscount > def.getMaxDiscount()) {
                calculatedDiscount = def.getMaxDiscount();
            }
        }

        // Discount cannot exceed total booking amount
        if (calculatedDiscount > bookingAmount) {
            calculatedDiscount = bookingAmount;
        }

        calculatedDiscount = Math.round(calculatedDiscount);
        double finalAmount = Math.max(0, bookingAmount - calculatedDiscount);

        PromoResponse response = new PromoResponse();
        response.setValid(true);
        response.setCode(def.getCode());
        response.setTitle(def.getTitle());
        response.setDescription(def.getDescription());
        response.setDiscountType(def.getDiscountType());
        response.setDiscountValue(def.getDiscountValue());
        response.setMaxDiscount(def.getMaxDiscount());
        response.setMinBookingAmount(def.getMinBookingAmount());
        response.setDiscountAmount(calculatedDiscount);
        response.setFinalAmount(finalAmount);
        response.setMessage("Coupon " + def.getCode() + " applied successfully! You saved ₹"
                + String.format("%,.0f", calculatedDiscount) + ".");

        return response;
    }
}
