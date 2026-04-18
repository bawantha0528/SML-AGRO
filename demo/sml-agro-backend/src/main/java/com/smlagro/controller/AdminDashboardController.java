package com.smlagro.controller;

import com.smlagro.dto.response.ApiResponse;
import com.smlagro.dto.response.DashboardStatsResponse;
import com.smlagro.dto.response.InquiryResponse;
import com.smlagro.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    /**
     * GET /api/admin/dashboard/details?metric=TOTAL_INQUIRIES|NEW_TODAY|CONVERSION_RATE|AVG_RESPONSE_TIME
     * Returns inquiry list behind the selected dashboard metric card.
     */
    @GetMapping("/details")
    public ResponseEntity<ApiResponse<List<InquiryResponse>>> getDashboardDetails(
            @RequestParam String metric) {
        try {
            List<InquiryResponse> details = inquiryService.getDashboardMetricDetails(metric);
            return ResponseEntity.ok(ApiResponse.ok(details));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to load dashboard details"));
        }
    }
}
