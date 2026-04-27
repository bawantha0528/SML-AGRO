package com.smlagro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smlagro.dto.request.CustomProductOrderRequest;
import com.smlagro.dto.response.ApiResponse;
import com.smlagro.dto.response.CustomProductOrderResponse;
import com.smlagro.service.CustomProductOrderService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/custom-orders")
public class PublicCustomProductOrderController {

    private final CustomProductOrderService customProductOrderService;

    @Autowired
    public PublicCustomProductOrderController(CustomProductOrderService customProductOrderService) {
        this.customProductOrderService = customProductOrderService;
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<CustomProductOrderResponse>> submit(
            @Valid @RequestBody CustomProductOrderRequest request) {
        try {
            CustomProductOrderResponse response = customProductOrderService.submit(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(
                        "Custom inquiry submitted successfully. Your reference number is: " + response.getOrderNumber(),
                            response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to submit custom order: " + e.getMessage()));
        }
    }
}
