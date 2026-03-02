package com.smlagro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "inquiries", indexes = {
        @Index(name = "idx_inquiry_number", columnList = "inquiry_number"),
        @Index(name = "idx_inquiry_email", columnList = "email"),
        @Index(name = "idx_inquiry_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "inquiry_number", unique = true, nullable = false, length = 20)
    private String inquiryNumber;

    @Column(name = "customer_name", nullable = false, length = 100)
    private String customerName;

    @Column(nullable = false, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 100)
    private String company;

    @Column(length = 50)
    private String country;

    @Column(name = "products_requested", columnDefinition = "TEXT")
    private String productsRequested; // Store as JSON array

    @Column(name = "estimated_quantity", length = 100)
    private String estimatedQuantity;

    @Column(name = "special_requirements", columnDefinition = "TEXT")
    private String specialRequirements;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InquiryStatus status = InquiryStatus.NEW;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority = Priority.MEDIUM;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @Column(name = "followup_date")
    private LocalDate followupDate;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.inquiryNumber == null) {
            this.inquiryNumber = "INQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (this.status == null)
            this.status = InquiryStatus.NEW;
        if (this.priority == null)
            this.priority = Priority.MEDIUM;
    }
}
