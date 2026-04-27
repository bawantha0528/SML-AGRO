package com.smlagro.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CustomProductOrderRequest {

    @NotBlank
    @Size(max = 100)
    private String customerName;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String phone;

    @NotBlank
    @Size(max = 60)
    private String country;

    @NotBlank
    @Size(max = 80)
    private String productType;

    @NotBlank
    @Size(max = 40)
    private String color;

    @NotBlank
    @Size(max = 40)
    private String size;

    @NotBlank
    @Size(max = 120)
    private String designName;

    @Min(1)
    private Integer quantity;

    private String specialNotes;

    @Size(max = 60)
    private String budgetRange;

    @Size(max = 30)
    private String targetDeliveryDate;

    private String referenceImages;

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
}
