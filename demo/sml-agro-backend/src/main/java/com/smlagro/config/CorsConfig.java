package com.smlagro.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

/**
 * CORS (Cross-Origin Resource Sharing) Configuration for Railway Deployment
 * 
 * This configuration allows the frontend to communicate with the backend
 * from different origins, essential for cloud-based deployments where
 * frontend and backend are on different URLs.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Read allowed origins from environment variable or use defaults
        String frontendUrl = System.getenv("FRONTEND_URL");
        if (frontendUrl != null && !frontendUrl.isEmpty()) {
            // Use specific frontend URL from environment
            configuration.setAllowedOrigins(Arrays.asList(
                frontendUrl,
                "http://localhost:5173",           // Local fallback
                "http://localhost:3000"            // Alternative local dev port
            ));
        } else {
            // Default allowed origins (for local development and Railway)
            configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",           // Local Vite dev server
                "http://localhost:3000",           // Alternative local dev port
                "http://127.0.0.1:5173",           // Local 127.0.0.1
                "https://sml-agro-frontend-production.up.railway.app"  // Railway frontend
            ));
        }
        
        // Allow common HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        
        // Allow common request headers
        configuration.setAllowedHeaders(Arrays.asList(
            "Content-Type",
            "Authorization",
            "Accept",
            "Origin",
            "X-Requested-With",
            "X-CSRF-Token"
        ));
        
        // Allow credentials (cookies, authorization headers)
        configuration.setAllowCredentials(true);
        
        // Cache preflight responses for 1 hour
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
