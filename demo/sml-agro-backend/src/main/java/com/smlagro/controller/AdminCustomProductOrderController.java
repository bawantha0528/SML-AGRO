package com.smlagro.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smlagro.dto.response.ApiResponse;
import com.smlagro.dto.response.CustomProductOrderResponse;
import com.smlagro.model.CustomOrderStatus;
import com.smlagro.service.CustomProductOrderService;

@RestController
@RequestMapping("/api/admin/custom-orders")
public class AdminCustomProductOrderController {

    private final CustomProductOrderService customProductOrderService;

    @Autowired
    public AdminCustomProductOrderController(CustomProductOrderService customProductOrderService) {
        this.customProductOrderService = customProductOrderService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomProductOrderResponse>>> getOrders(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {

        List<CustomProductOrderResponse> orders = customProductOrderService.getAll(status, search);
        return ResponseEntity.ok(ApiResponse.ok(orders));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomProductOrderResponse>> getOrder(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok(customProductOrderService.getById(id)));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<CustomProductOrderResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            CustomOrderStatus status = CustomOrderStatus.valueOf(body.get("status").toUpperCase());
            CustomProductOrderResponse updated = customProductOrderService.updateStatus(id, status);
            return ResponseEntity.ok(ApiResponse.ok("Status updated to " + status, updated));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid status value"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(ApiResponse.error(e.getMessage()));
        }
    }
}
