package com.smlagro.dto.response;

import com.smlagro.model.Inquiry;
import com.smlagro.model.InquiryStatus;
import com.smlagro.model.Priority;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class InquiryResponse {

    private Long id;
    private String inquiryNumber;
    private String customerName;
    private String email;
    private String phone;
    private String company;
    private String country;
    private String productsRequested;
    private String estimatedQuantity;
    private String specialRequirements;
    private InquiryStatus status;
    private Priority priority;
    private String assignedToUsername;
    private LocalDate followupDate;
    private String notes;
    private LocalDateTime createdAt;
    private LocalDateTime respondedAt;
    private LocalDateTime closedAt;

    public InquiryResponse() {
    }

    // Static factory method (SRP - mapping responsibility separate from domain)
    public static InquiryResponse fromEntity(Inquiry inquiry) {
        InquiryResponse r = new InquiryResponse();
        r.setId(inquiry.getId());
        r.setInquiryNumber(inquiry.getInquiryNumber());
        r.setCustomerName(inquiry.getCustomerName());
        r.setEmail(inquiry.getEmail());
        r.setPhone(inquiry.getPhone());
        r.setCompany(inquiry.getCompany());
        r.setCountry(inquiry.getCountry());
        r.setProductsRequested(inquiry.getProductsRequested());
        r.setEstimatedQuantity(inquiry.getEstimatedQuantity());
        r.setSpecialRequirements(inquiry.getSpecialRequirements());
        r.setStatus(inquiry.getStatus());
        r.setPriority(inquiry.getPriority());
        r.setAssignedToUsername(inquiry.getAssignedTo() != null ? inquiry.getAssignedTo().getUsername() : null);
        r.setFollowupDate(inquiry.getFollowupDate());
        r.setNotes(inquiry.getNotes());
        r.setCreatedAt(inquiry.getCreatedAt());
        r.setRespondedAt(inquiry.getRespondedAt());
        r.setClosedAt(inquiry.getClosedAt());
        return r;
    }

    // Getters and Setters
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

    public String getAssignedToUsername() {
        return assignedToUsername;
    }

    public void setAssignedToUsername(String assignedToUsername) {
        this.assignedToUsername = assignedToUsername;
    }

    public LocalDate getFollowupDate() {
        return followupDate;
    }

    public void setFollowupDate(LocalDate followupDate) {
        this.followupDate = followupDate;
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
