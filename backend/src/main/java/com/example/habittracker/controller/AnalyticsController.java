package com.example.habittracker.controller;

import com.example.habittracker.dto.AnalyticsResponse;
import com.example.habittracker.exception.BadRequestException;
import com.example.habittracker.service.AnalyticsService;
import com.example.habittracker.util.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<AnalyticsResponse>> getAnalytics(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {
        if (month != null && (month < 1 || month > 12)) {
            throw new BadRequestException("Month must be between 1 and 12");
        }
        if (year != null && (year < 2000 || year > 2100)) {
            throw new BadRequestException("Year must be between 2000 and 2100");
        }
        AnalyticsResponse analyticsData = analyticsService.getAnalyticsData(year, month);
        ApiResponse<AnalyticsResponse> response = new ApiResponse<>(true, "Analytics data retrieved successfully", analyticsData);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
