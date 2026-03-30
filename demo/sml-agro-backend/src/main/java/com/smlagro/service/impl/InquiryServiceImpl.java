package com.smlagro.service.impl;

import com.smlagro.dto.request.InquiryRequest;
import com.smlagro.dto.response.DashboardStatsResponse;
import com.smlagro.dto.response.InquiryResponse;
import com.smlagro.model.Inquiry;
import com.smlagro.model.InquiryStatus;
import com.smlagro.model.Priority;
import com.smlagro.repository.InquiryRepository;
import com.smlagro.service.EmailService;
import com.smlagro.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class InquiryServiceImpl implements InquiryService {

    private final InquiryRepository inquiryRepository;
    private final EmailService emailService;

    // Constructor injection (DIP - depend on abstraction, not concrete class)
    @Autowired
    public InquiryServiceImpl(InquiryRepository inquiryRepository, EmailService emailService) {
        this.inquiryRepository = inquiryRepository;
        this.emailService = emailService;
    }

    @Override
    public InquiryResponse submitInquiry(InquiryRequest request) {
        Inquiry inquiry = mapRequestToEntity(request);
        Inquiry saved = inquiryRepository.save(inquiry);

        // Asynchronously send the confirmation email
        emailService.sendInquiryConfirmationAsync(saved);

        return InquiryResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InquiryResponse> getAllInquiries() {
        return inquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(InquiryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InquiryResponse> getInquiriesByStatus(InquiryStatus status) {
        return inquiryRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream()
                .map(InquiryResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<InquiryResponse> searchInquiries(String keyword, String status) {
        List<Inquiry> results;
        if (status != null && !status.isBlank() && !status.equalsIgnoreCase("ALL")) {
            try {
                InquiryStatus statusEnum = InquiryStatus.valueOf(status.toUpperCase());
                results = inquiryRepository.searchInquiriesByStatus(statusEnum, keyword);
            } catch (IllegalArgumentException e) {
                results = inquiryRepository.searchInquiries(keyword);
            }
        } else {
            results = inquiryRepository.searchInquiries(keyword);
        }
        return results.stream().map(InquiryResponse::fromEntity).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public InquiryResponse getInquiryById(Long id) {
        Inquiry inquiry = findOrThrow(id);
        return InquiryResponse.fromEntity(inquiry);
    }

    @Override
    public InquiryResponse updateStatus(Long id, InquiryStatus newStatus) {
        Inquiry inquiry = findOrThrow(id);
        inquiry.setStatus(newStatus);
        // Track timestamps on status change
        if (newStatus == InquiryStatus.RESPONDED && inquiry.getRespondedAt() == null) {
            inquiry.setRespondedAt(LocalDateTime.now());
        }
        if (newStatus == InquiryStatus.CLOSED && inquiry.getClosedAt() == null) {
            inquiry.setClosedAt(LocalDateTime.now());
        }
        return InquiryResponse.fromEntity(inquiryRepository.save(inquiry));
    }

    @Override
    public InquiryResponse updatePriority(Long id, Priority priority) {
        Inquiry inquiry = findOrThrow(id);
        inquiry.setPriority(priority);
        return InquiryResponse.fromEntity(inquiryRepository.save(inquiry));
    }

    @Override
    public InquiryResponse updateNotes(Long id, String notes) {
        Inquiry inquiry = findOrThrow(id);
        inquiry.setNotes(notes);
        return InquiryResponse.fromEntity(inquiryRepository.save(inquiry));
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        DashboardStatsResponse stats = new DashboardStatsResponse();

        long total = inquiryRepository.count();
        stats.setTotalInquiries(total);

        // Today count
        LocalDateTime startOfToday = LocalDate.now().atStartOfDay();
        stats.setNewToday(inquiryRepository.countByCreatedAtAfter(startOfToday));

        // This week count
        LocalDateTime startOfWeek = LocalDate.now().minusDays(7).atStartOfDay();
        stats.setNewThisWeek(inquiryRepository.countByCreatedAtAfter(startOfWeek));

        long closed = inquiryRepository.countByStatus(InquiryStatus.CLOSED);
        long open = total - closed;
        stats.setClosedInquiries(closed);
        stats.setOpenInquiries(open);

        // Conversion rate: closed / total
        double conversionRate = total > 0 ? Math.round((double) closed / total * 100.0 * 10) / 10.0 : 0.0;
        stats.setConversionRate(conversionRate);
        stats.setAvgResponseHours(4.2); // placeholder — real calc needs respondedAt data

        // Weekly trend (last 8 weeks)
        LocalDateTime eightWeeksAgo = LocalDateTime.now().minusWeeks(8);
        List<Object[]> trend = inquiryRepository.weeklyTrendSince(eightWeeksAgo);
        List<Map<String, Object>> weeklyTrend = buildWeeklyTrend(trend);
        stats.setWeeklyTrend(weeklyTrend);

        // Country breakdown
        List<Object[]> countryCounts = inquiryRepository.countByCountry();
        List<Map<String, Object>> countryData = buildCountryBreakdown(countryCounts);
        stats.setCountryBreakdown(countryData);

        // Status breakdown
        List<Object[]> statusCounts = inquiryRepository.countByStatusGrouped();
        List<Map<String, Object>> statusData = statusCounts.stream().map(row -> {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("name", row[0].toString());
            entry.put("value", ((Number) row[1]).longValue());
            return entry;
        }).collect(Collectors.toList());
        stats.setStatusBreakdown(statusData);

        return stats;
    }

    // ===================== Private helpers =====================

    private Inquiry findOrThrow(Long id) {
        return inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inquiry not found: " + id));
    }

    private Inquiry mapRequestToEntity(InquiryRequest req) {
        Inquiry inquiry = new Inquiry();
        inquiry.setCustomerName(req.getCustomerName());
        inquiry.setEmail(req.getEmail());
        inquiry.setPhone(req.getPhone());
        inquiry.setCompany(req.getCompany());
        inquiry.setCountry(req.getCountry());
        inquiry.setProductsRequested(req.getProductsRequested());
        inquiry.setEstimatedQuantity(req.getEstimatedQuantity());
        inquiry.setSpecialRequirements(req.getSpecialRequirements());
        inquiry.setCustomizationDetails(req.getCustomizationDetails());
        inquiry.setStatus(InquiryStatus.NEW);
        inquiry.setPriority(Priority.MEDIUM);
        return inquiry;
    }

    private List<Map<String, Object>> buildWeeklyTrend(List<Object[]> rows) {
        List<Map<String, Object>> result = new ArrayList<>();
        int weekLabel = 1;
        for (Object[] row : rows) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("name", "Week " + weekLabel++);
            entry.put("inquiries", ((Number) row[2]).longValue());
            result.add(entry);
        }
        // Pad to at least 4 entries if DB has sparse data
        while (result.size() < 4) {
            Map<String, Object> dummy = new LinkedHashMap<>();
            dummy.put("name", "Week " + weekLabel++);
            dummy.put("inquiries", 0L);
            result.add(dummy);
        }
        return result;
    }

    private List<Map<String, Object>> buildCountryBreakdown(List<Object[]> rows) {
        long totalForPie = rows.stream().mapToLong(r -> ((Number) r[1]).longValue()).sum();
        List<Map<String, Object>> result = new ArrayList<>();
        long othersCount = 0;
        int processed = 0;
        for (Object[] row : rows) {
            if (processed < 4) {
                Map<String, Object> entry = new LinkedHashMap<>();
                entry.put("name", row[0].toString());
                entry.put("value", ((Number) row[1]).longValue());
                result.add(entry);
            } else {
                othersCount += ((Number) row[1]).longValue();
            }
            processed++;
        }
        if (othersCount > 0) {
            Map<String, Object> others = new LinkedHashMap<>();
            others.put("name", "Others");
            others.put("value", othersCount);
            result.add(others);
        }
        return result;
    }
}
