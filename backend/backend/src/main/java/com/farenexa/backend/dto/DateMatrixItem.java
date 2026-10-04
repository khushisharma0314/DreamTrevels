package com.farenexa.backend.dto;

import java.time.LocalDate;

public class DateMatrixItem {

    private String date;             // "2026-09-12"
    private String dayOfWeek;        // "Sat"
    private String formattedDate;    // "12 Sep"
    private double price;            // 4800.0
    private boolean isCheapest;
    private boolean isSelected;

    public DateMatrixItem() {
    }

    public DateMatrixItem(
            String date,
            String dayOfWeek,
            String formattedDate,
            double price,
            boolean isCheapest,
            boolean isSelected
    ) {
        this.date = date;
        this.dayOfWeek = dayOfWeek;
        this.formattedDate = formattedDate;
        this.price = price;
        this.isCheapest = isCheapest;
        this.isSelected = isSelected;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getFormattedDate() {
        return formattedDate;
    }

    public void setFormattedDate(String formattedDate) {
        this.formattedDate = formattedDate;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public boolean isCheapest() {
        return isCheapest;
    }

    public void setCheapest(boolean cheapest) {
        isCheapest = cheapest;
    }

    public boolean isSelected() {
        return isSelected;
    }

    public void setSelected(boolean selected) {
        isSelected = selected;
    }
}
