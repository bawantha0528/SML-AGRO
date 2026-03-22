package com.smlagro.controller;

import com.smlagro.dto.request.InquiryRequest;
import com.smlagro.dto.response.ApiResponse;
import com.smlagro.dto.response.InquiryResponse;
import com.smlagro.service.InquiryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inquiries")
public class PublicInquiryController {

    private final InquiryService inquiryService;

    @Autowired
    public PublicInquiryController(InquiryService inquiryService) {
        this.inquiryService = inquiryService;
    }

    /**
     * Public endpoint — any website visitor can submit an inquiry.
     * Saves to DB and returns the generated inquiry number.
     */
    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<InquiryResponse>> submitInquiry(
            @Valid @RequestBody InquiryRequest request) {
        try {
            InquiryResponse response = inquiryService.submitInquiry(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.ok(
                            "Inquiry submitted successfully. Your inquiry number is: " + response.getInquiryNumber(),
                            response));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to submit inquiry: " + e.getMessage()));
        }
    }
}
