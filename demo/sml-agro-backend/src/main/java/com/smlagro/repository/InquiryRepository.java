package com.smlagro.repository;

import com.smlagro.model.Inquiry;
import com.smlagro.model.InquiryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface InquiryRepository extends JpaRepository<Inquiry, Long> {

    Optional<Inquiry> findByInquiryNumber(String inquiryNumber);

    List<Inquiry> findByStatusOrderByCreatedAtDesc(InquiryStatus status);

    List<Inquiry> findAllByOrderByCreatedAtDesc();

    long countByStatus(InquiryStatus status);

    long countByCreatedAtAfter(LocalDateTime dateTime);

    // Full-text search across customer name, email, company, country
    @Query("SELECT i FROM Inquiry i WHERE " +
            "LOWER(i.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.country) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.inquiryNumber) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
            "ORDER BY i.createdAt DESC")
    List<Inquiry> searchInquiries(@Param("keyword") String keyword);

    // Search with status filter
    @Query("SELECT i FROM Inquiry i WHERE i.status = :status AND (" +
            "LOWER(i.customerName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.company) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.country) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(i.inquiryNumber) LIKE LOWER(CONCAT('%', :keyword, '%')))" +
            "ORDER BY i.createdAt DESC")
    List<Inquiry> searchInquiriesByStatus(@Param("status") InquiryStatus status, @Param("keyword") String keyword);

    // Country distribution for pie chart
    @Query("SELECT i.country, COUNT(i) FROM Inquiry i WHERE i.country IS NOT NULL GROUP BY i.country ORDER BY COUNT(i) DESC")
    List<Object[]> countByCountry();

    // Weekly trend for last 8 weeks
    @Query(value = "SELECT YEAR(created_at) as yr, WEEK(created_at) as wk, COUNT(*) as cnt " +
            "FROM inquiries WHERE created_at >= :since " +
            "GROUP BY YEAR(created_at), WEEK(created_at) ORDER BY yr, wk", nativeQuery = true)
    List<Object[]> weeklyTrendSince(@Param("since") LocalDateTime since);

    // Status breakdown
    @Query("SELECT i.status, COUNT(i) FROM Inquiry i GROUP BY i.status")
    List<Object[]> countByStatusGrouped();
}
