package com.farenexa.backend.controller;

import com.farenexa.backend.entity.City;
import com.farenexa.backend.service.DuffelService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cities")
@CrossOrigin(originPatterns = "*", allowCredentials = "true")
public class CityController {

    private final DuffelService duffelService;

    public CityController(DuffelService duffelService) {
        this.duffelService = duffelService;
    }

    /**
     * Airport/city autocomplete is also powered directly by Duffel.
     */
    @GetMapping("/search")
    public List<City> searchCities(
            @RequestParam(required = false, defaultValue = "") String keyword
    ) {
        return duffelService.searchPlaces(keyword);
    }
}
