package com.smlagro.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class InquiryRequest {

    @NotBlank
    @Size(max = 100)
    private String customerName;

    @NotBlank
    @Email
    @Size(max = 100)
    private String email;

    @Size(max = 20)
    private String phone;

    @Size(max = 100)
    private String company;

    @Size(max = 50)
    private String country;

    private String productsRequested;

    @Size(max = 100)
    private String estimatedQuantity;

    private String specialRequirements;

    private String customizationDetails;

    public InquiryRequest() {
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

    public void setSpecialRequirements(String specialRequirements) {
        this.specialRequirements = specialRequirements;
    }

    public String getCustomizationDetails() {
        return customizationDetails;
    }

    public void setCustomizationDetails(String customizationDetails) {
        this.customizationDetails = customizationDetails;
    }
}
