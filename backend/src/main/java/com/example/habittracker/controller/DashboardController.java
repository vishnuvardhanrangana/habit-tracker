package com.example.habittracker.controller;

import com.example.habittracker.dto.DashboardResponse;
import com.example.habittracker.service.DashboardService;
import com.example.habittracker.util.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<DashboardResponse>> getDashboard() {
        DashboardResponse dashboardData = dashboardService.getDashboardData();
        ApiResponse<DashboardResponse> response = new ApiResponse<>(true, "Dashboard data retrieved successfully", dashboardData);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
