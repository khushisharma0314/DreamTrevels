package com.farenexa.backend.controller;

import com.farenexa.backend.dto.ContactRequest;
import com.farenexa.backend.service.EmailService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class ContactController {

    private final EmailService emailService;

    public ContactController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping
    public ResponseEntity<?> checkApi() {
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Contact API is working"
        ));
    }

    @PostMapping
    public ResponseEntity<?> submitContactForm(@Valid @RequestBody ContactRequest request) {
        emailService.sendCompanyNotification(request);
        emailService.sendUserConfirmation(request);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Your message has been received and emailed to our team."
        ));
    }
}
