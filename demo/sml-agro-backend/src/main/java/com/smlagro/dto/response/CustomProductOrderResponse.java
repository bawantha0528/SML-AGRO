package com.smlagro.dto.response;

import java.time.LocalDateTime;

import com.smlagro.model.CustomOrderStatus;
import com.smlagro.model.CustomProductOrder;

public class CustomProductOrderResponse {

    private Long id;
    private String orderNumber;
    private String customerName;
    private String email;
    private String phone;
    private String country;
    private String productType;
    private String color;
    private String size;
    private String designName;
    private Integer quantity;
    private String specialNotes;
    private String budgetRange;
    private String targetDeliveryDate;
    private String referenceImages;
    private CustomOrderStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static CustomProductOrderResponse fromEntity(CustomProductOrder order) {
        CustomProductOrderResponse response = new CustomProductOrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setCustomerName(order.getCustomerName());
        response.setEmail(order.getEmail());
        response.setPhone(order.getPhone());
        response.setCountry(order.getCountry());
        response.setProductType(order.getProductType());
        response.setColor(order.getColor());
        response.setSize(order.getSize());
        response.setDesignName(order.getDesignName());
        response.setQuantity(order.getQuantity());
        response.setSpecialNotes(order.getSpecialNotes());
        response.setBudgetRange(order.getBudgetRange());
        response.setTargetDeliveryDate(order.getTargetDeliveryDate());
        response.setReferenceImages(order.getReferenceImages());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());
        return response;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
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

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getProductType() {
        return productType;
    }

    public void setProductType(String productType) {
        this.productType = productType;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getDesignName() {
        return designName;
    }

    public void setDesignName(String designName) {
        this.designName = designName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getSpecialNotes() {
        return specialNotes;
    }

    public void setSpecialNotes(String specialNotes) {
        this.specialNotes = specialNotes;
    }

    public String getBudgetRange() {
        return budgetRange;
    }

    public void setBudgetRange(String budgetRange) {
        this.budgetRange = budgetRange;
    }

    public String getTargetDeliveryDate() {
        return targetDeliveryDate;
    }

    public void setTargetDeliveryDate(String targetDeliveryDate) {
        this.targetDeliveryDate = targetDeliveryDate;
    }

    public String getReferenceImages() {
        return referenceImages;
    }

    public void setReferenceImages(String referenceImages) {
        this.referenceImages = referenceImages;
    }

    public CustomOrderStatus getStatus() {
        return status;
    }

    public void setStatus(CustomOrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
