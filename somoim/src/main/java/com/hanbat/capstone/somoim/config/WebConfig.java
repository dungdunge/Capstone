package com.hanbat.capstone.somoim.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {


    @Override
    public void addCorsMappings(CorsRegistry registry) {

        registry.addMapping("/**")
                .allowedOrigins(
                        "https://equal-duck-suitable.ngrok-free.app",
                        "ws://equal-duck-suitable.ngrok-free.app",
                        "wss://equal-duck-suitable.ngrok-free.app",
                        "http://172.25.1.218:3000", "http://localhost:3000","https://smalltalk.pages.dev/")
                .allowedMethods("GET", "POST", "PUT", "DELETE")
                .exposedHeaders("location")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}