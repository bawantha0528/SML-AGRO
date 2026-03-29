package com.smlagro.service;

import com.smlagro.dto.request.InquiryRequest;
import com.smlagro.dto.response.DashboardStatsResponse;
import com.smlagro.dto.response.InquiryResponse;
import com.smlagro.model.InquiryStatus;
import com.smlagro.model.Priority;

import java.util.List;

// Interface segregation: only inquiry-related operations here (ISP)
public interface InquiryService {

    InquiryResponse submitInquiry(InquiryRequest request);

    List<InquiryResponse> getAllInquiries();

    List<InquiryResponse> getInquiriesByStatus(InquiryStatus status);

    List<InquiryResponse> searchInquiries(String keyword, String status);

    InquiryResponse getInquiryById(Long id);

    InquiryResponse updateStatus(Long id, InquiryStatus newStatus);

    InquiryResponse updatePriority(Long id, Priority priority);

    InquiryResponse updateNotes(Long id, String notes);

    DashboardStatsResponse getDashboardStats();
}
