package com.yourpakage;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                // Allow CORS for all endpoints and from all origins (for testing)
                registry.addMapping("/**")  // Apply to all backend API endpoints
                        .allowedOrigins("*")    // Allow requests from any origin (you can restrict to your frontend URL)
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS");  // Allowed HTTP methods
            }
        };
    }
}
