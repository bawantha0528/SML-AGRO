package com.smlagro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// Exclude SecurityAutoConfiguration for now so we don't need a login
// to access the Public endpoints during testing.
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class SmlAgroApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmlAgroApplication.class, args);
    }

}
