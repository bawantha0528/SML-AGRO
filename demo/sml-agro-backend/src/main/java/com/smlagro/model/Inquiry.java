package com.smlagro.model;
// create inquiry //
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "inquiries", indexes = {
        @Index(name = "idx_inquiry_number", columnList = "inquiry_number"),
        @Index(name = "idx_inquiry_email", columnList = "email"),
        @Index(name = "idx_inquiry_status", columnList = "status")
})
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
    private String productsRequested;

    @Column(name = "estimated_quantity", length = 100)
    private String estimatedQuantity;

    @Column(name = "special_requirements", columnDefinition = "TEXT")
    private String specialRequirements;

    @Column(name = "customization_details", columnDefinition = "TEXT")
    private String customizationDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InquiryStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Priority priority;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to_id")
    private User assignedTo;

    @Column(name = "followup_date")
    private LocalDate followupDate;

    @Column(name = "followup_completed_at")
    private LocalDateTime followupCompletedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    public Inquiry() {
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.inquiryNumber == null) {
            this.inquiryNumber = "INQ-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (this.status == null)
            this.status = InquiryStatus.NEW;
        if (this.priority == null)
            this.priority = Priority.MEDIUM;
    }

    // ── Getters & Setters ──

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInquiryNumber() {
        return inquiryNumber;
    }

    public void setInquiryNumber(String inquiryNumber) {
        this.inquiryNumber = inquiryNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCompany() {
        return company;
    }

    public void setCompany(String company) {
        this.company = company;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProductsRequested() {
        return productsRequested;
    }

    public void setProductsRequested(String productsRequested) {
        this.productsRequested = productsRequested;
    }

    public String getEstimatedQuantity() {
        return estimatedQuantity;
    }

    public void setEstimatedQuantity(String estimatedQuantity) {
        this.estimatedQuantity = estimatedQuantity;
    }

    public String getSpecialRequirements() {
        return specialRequirements;
    }

    public void setSpecialRequirements(String specialRequirements) {
        this.specialRequirements = specialRequirements;
    }

    public String getCustomizationDetails() {
        return customizationDetails;
    }

    public void setCustomizationDetails(String customizationDetails) {
        this.customizationDetails = customizationDetails;
    }

    public InquiryStatus getStatus() {
        return status;
    }

    public void setStatus(InquiryStatus status) {
        this.status = status;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public LocalDate getFollowupDate() {
        return followupDate;
    }

    public void setFollowupDate(LocalDate followupDate) {
        this.followupDate = followupDate;
    }

    public LocalDateTime getFollowupCompletedAt() {
        return followupCompletedAt;
    }

    public void setFollowupCompletedAt(LocalDateTime followupCompletedAt) {
        this.followupCompletedAt = followupCompletedAt;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }

    public LocalDateTime getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(LocalDateTime closedAt) {
        this.closedAt = closedAt;
    }
}
