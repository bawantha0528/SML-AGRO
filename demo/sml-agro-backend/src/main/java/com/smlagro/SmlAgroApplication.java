package com.smlagro;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class SmlAgroApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmlAgroApplication.class, args);
    }

}
