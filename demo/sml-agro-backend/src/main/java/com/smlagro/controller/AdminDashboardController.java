package com.smlagro.controller;

import com.smlagro.dto.response.ApiResponse;
import com.smlagro.dto.response.DashboardStatsResponse;
import com.smlagro.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final InquiryService inquiryService;

    @Autowired
    public AdminDashboardController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    /**
     * GET /api/admin/dashboard/stats
     * Returns all metrics: counts, conversion rate, chart data
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardStats() {
        try {
            DashboardStatsResponse stats = inquiryService.getDashboardStats();
            return ResponseEntity.ok(ApiResponse.ok(stats));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to load dashboard: " + e.getMessage()));
        }
    }
}
