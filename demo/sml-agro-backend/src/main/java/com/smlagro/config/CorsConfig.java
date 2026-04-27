package com.smlagro.config;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * CORS (Cross-Origin Resource Sharing) Configuration for Vercel & Railway
 * 
 * This configuration allows the frontend to communicate with the backend
 * from different origins. Supports:
 * - Vercel deployment (*.vercel.app)
 * - Railway deployment (*.railway.app)
 * - Local development (localhost)
 * - Custom domains via ALLOWED_ORIGINS env variable
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Build allowed origins list
        List<String> allowedOrigins = buildAllowedOrigins();
        configuration.setAllowedOrigins(allowedOrigins);
        
        // Allow common HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"));
        
        // Allow common request headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "X-Requested-With",
            "X-CSRF-Token",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Expose response headers to client
        configuration.setExposedHeaders(Arrays.asList(
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Cache preflight responses for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    /**
     * Build list of allowed origins from environment and defaults
     * 
     * Priority:
     * 1. ALLOWED_ORIGINS env variable (comma-separated)
     * 2. Default origins (local dev + Vercel + Railway)
     */
    private List<String> buildAllowedOrigins() {
        List<String> origins = new ArrayList<>();
        
        // Check for custom allowed origins from environment
        String allowedOriginsEnv = System.getenv("ALLOWED_ORIGINS");
        if (allowedOriginsEnv != null && !allowedOriginsEnv.isEmpty()) {
            // Parse comma-separated origins
            String[] customOrigins = allowedOriginsEnv.split(",");
            for (String origin : customOrigins) {
                String trimmed = origin.trim();
                if (!trimmed.isEmpty()) {
                    origins.add(trimmed);
                }
            }
            return origins;
        }
        
        // Default origins (local development)
        origins.addAll(Arrays.asList(
            "http://localhost:3000",              // Local dev server alternative port
            "http://localhost:5173",              // Vite default dev server
            "http://127.0.0.1:5173",              // Local 127.0.0.1
            "http://127.0.0.1:3000"               // Local 127.0.0.1 alternative
        ));
        
        // Vercel deployment domains
        origins.addAll(Arrays.asList(
            "https://sml-agro-production.vercel.app",     // Production Vercel domain
            "https://sml-agro.vercel.app",                // Standard Vercel domain
            "https://sml-agro-staging.vercel.app"         // Staging Vercel domain
        ));
        
        // Railway deployment domains
        origins.addAll(Arrays.asList(
            "https://sml-agro-frontend-production.up.railway.app",  // Production Railway
            "https://sml-agro-frontend.up.railway.app"             // Railway frontend
        ));
        
        return origins;
    }
}
