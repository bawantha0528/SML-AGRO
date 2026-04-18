package com.smlagro.dto.response;

public class ProductInquirySummaryResponse {

    private Long productId;
    private String productName;
    private long inquiryCount;

    public ProductInquirySummaryResponse() {
    }

    public ProductInquirySummaryResponse(Long productId, String productName, long inquiryCount) {
        this.productId = productId;
        this.productName = productName;
        this.inquiryCount = inquiryCount;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public long getInquiryCount() {
        return inquiryCount;
    }

    public void setInquiryCount(long inquiryCount) {
        this.inquiryCount = inquiryCount;
    }
}