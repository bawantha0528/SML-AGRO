package com.smlagro.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Health Check Controller
 * Provides a simple endpoint to verify the backend is running and responding.
 * No authentication required - useful for debugging Railway deployments.
 */
@RestController
@RequestMapping("/api/health")
public class HealthCheckController {

    @GetMapping
    public Map<String, Object> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "SML Agro Backend is running");
        response.put("timestamp", System.currentTimeMillis());
        response.put("service", "sml-agro-backend");
        return response;
    }

    @GetMapping("/db")
    public Map<String, Object> dbHealthCheck() {
        Map<String, Object> response = new HashMap<>();
        try {
            response.put("database", "connected");
            response.put("status", "UP");
            return response;
        } catch (Exception e) {
            response.put("database", "disconnected");
            response.put("status", "DOWN");
            response.put("error", e.getMessage());
            return response;
        }
    }
}
