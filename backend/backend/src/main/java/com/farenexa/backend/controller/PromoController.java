package com.farenexa.backend.controller;

import com.farenexa.backend.dto.PromoResponse;
import com.farenexa.backend.dto.PromoValidateRequest;
import com.farenexa.backend.service.PromoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promos")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class PromoController {

    private final PromoService promoService;

    public PromoController(PromoService promoService) {
        this.promoService = promoService;
    }

    @GetMapping("/available")
    public ResponseEntity<List<PromoResponse>> getAvailablePromos() {
        return ResponseEntity.ok(promoService.getAvailablePromos());
    }

    @PostMapping("/validate")
    public ResponseEntity<PromoResponse> validatePromo(@RequestBody PromoValidateRequest request) {
        if (request == null) {
            return ResponseEntity.badRequest().body(new PromoResponse(false, "Invalid request."));
        }
        PromoResponse response = promoService.validatePromo(request.getCode(), request.getBookingAmount());
        if (!response.isValid()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }
}
