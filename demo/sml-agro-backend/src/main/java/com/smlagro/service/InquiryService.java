package com.smlagro.service;

import java.time.LocalDate;
import java.util.List;

import com.smlagro.dto.request.InquiryRequest;
import com.smlagro.dto.response.DashboardStatsResponse;
import com.smlagro.dto.response.InquiryPrivateNoteResponse;
import com.smlagro.dto.response.InquiryResponse;
import com.smlagro.model.InquiryStatus;
import com.smlagro.model.Priority;

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

    List<InquiryPrivateNoteResponse> getPrivateNotes(Long inquiryId, String actorUsername);

    InquiryPrivateNoteResponse addPrivateNote(Long inquiryId, String actorUsername, String content);

    InquiryPrivateNoteResponse updatePrivateNote(Long inquiryId, Long noteId, String actorUsername, String content);

    void deletePrivateNote(Long inquiryId, Long noteId, String actorUsername);

    InquiryResponse scheduleFollowup(Long id, LocalDate followupDate);

    InquiryResponse markFollowupCompleted(Long id);

    DashboardStatsResponse getDashboardStats();

    List<InquiryResponse> getDashboardMetricDetails(String metric);

    List<java.util.Map<String, Object>> getInquiryTrend(String granularity, int days);

    List<java.util.Map<String, Object>> getCountryBreakdown(LocalDate fromDate, LocalDate toDate);

    List<InquiryResponse> getCountryInquiryDetails(String country, LocalDate fromDate, LocalDate toDate);
}
