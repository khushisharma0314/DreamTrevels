package com.farenexa.backend.controller;

import com.farenexa.backend.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/booking-requests")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class BookingRequestController {

    private final EmailService emailService;

    public BookingRequestController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<?> submitBookingRequest(@RequestBody Map<String, Object> payload) {
        try {
            boolean sent = emailService.sendBookingRequestToCompany(payload);
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "emailSent", sent,
                    "message", "Booking request received and processed"
            ));
        } catch (Exception e) {
            System.err.println("Error processing direct booking request: " + e.getMessage());
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "emailSent", false,
                    "message", "Booking request accepted"
            ));
        }
    }
}
