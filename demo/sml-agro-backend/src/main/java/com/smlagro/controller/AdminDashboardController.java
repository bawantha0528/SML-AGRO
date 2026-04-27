package com.smlagro.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smlagro.dto.response.ApiResponse;
import com.smlagro.dto.response.DashboardStatsResponse;
import com.smlagro.dto.response.InquiryResponse;
import com.smlagro.service.InquiryService;

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

    /**
     * GET /api/admin/dashboard/trend?granularity=daily|weekly|monthly&days=30
     * Returns inquiry trend points for the chart.
     */
    @GetMapping("/trend")
    public ResponseEntity<ApiResponse<List<java.util.Map<String, Object>>>> getInquiryTrend(
            @RequestParam(defaultValue = "daily") String granularity,
            @RequestParam(defaultValue = "30") int days) {
        try {
            List<java.util.Map<String, Object>> trend = inquiryService.getInquiryTrend(granularity, days);
            return ResponseEntity.ok(ApiResponse.ok(trend));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to load trend data"));
        }
    }

    /**
     * GET /api/admin/dashboard/country-breakdown?fromDate=2026-04-01&toDate=2026-04-18
     * Returns top 5 countries with percentage and an "Other" category.
     */
    @GetMapping("/country-breakdown")
    public ResponseEntity<ApiResponse<List<java.util.Map<String, Object>>>> getCountryBreakdown(
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        try {
            LocalDate from = parseDateOrDefault(fromDate, LocalDate.now().minusDays(29));
            LocalDate to = parseDateOrDefault(toDate, LocalDate.now());
            List<java.util.Map<String, Object>> data = inquiryService.getCountryBreakdown(from, to);
            return ResponseEntity.ok(ApiResponse.ok(data));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to load country breakdown"));
        }
    }

    /**
     * GET /api/admin/dashboard/country-details?country=USA&fromDate=2026-04-01&toDate=2026-04-18
     * Returns inquiries for one selected country segment.
     */
    @GetMapping("/country-details")
    public ResponseEntity<ApiResponse<List<InquiryResponse>>> getCountryDetails(
            @RequestParam String country,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        try {
            LocalDate from = parseDateOrDefault(fromDate, LocalDate.now().minusDays(29));
            LocalDate to = parseDateOrDefault(toDate, LocalDate.now());
            List<InquiryResponse> rows = inquiryService.getCountryInquiryDetails(country, from, to);
            return ResponseEntity.ok(ApiResponse.ok(rows));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(ApiResponse.error("Failed to load country details"));
        }
    }

    private LocalDate parseDateOrDefault(String value, LocalDate fallback) {
        if (value == null || value.isBlank()) {
            return fallback;
        }
        try {
            return LocalDate.parse(value);
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid date format. Use yyyy-MM-dd");
        }
    }
}
