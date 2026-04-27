package com.smlagro.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

/**
 * Spring Security Configuration with CORS for Railway Deployment
 * 
 * Configures security policies and ensures CORS is applied to all endpoints
 */
@Configuration
@EnableWebSecurity
public class WebConfig {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // Enable CORS
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            
            // Disable CSRF for API endpoints (common for REST APIs)
            .csrf(csrf -> csrf.disable())
            
            // Session management
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Authorization rules
            .authorizeHttpRequests(authz -> authz
                // Health check endpoints (no auth required)
                .requestMatchers("/api/health", "/api/health/db").permitAll()
                // Public endpoints
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/inquiries/submit").permitAll()
                .requestMatchers("/api/custom-orders/submit").permitAll()
                .requestMatchers("/api/customization").permitAll()
                // Admin endpoints require authentication
                .requestMatchers("/api/admin/**").authenticated()
                // All other requests
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
