package com.smlagro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "custom_inquiries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomInquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inquiry_id", nullable = false)
    private Inquiry inquiry;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "customization_json", columnDefinition = "TEXT", nullable = false)
    private String customizationJson; // Selected options as JSON

    @Column(name = "calculated_price", nullable = false)
    private Double calculatedPrice;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(name = "total_price", nullable = false)
    private Double totalPrice;

    @Column(columnDefinition = "TEXT")
    private String specifications;

    @Column(name = "reference_images", columnDefinition = "TEXT")
    private String referenceImages; // JSON array of image URLs

    @PrePersist
    protected void onCreate() {
        if (this.quantity == null)
            this.quantity = 1;
        if (this.totalPrice == null && this.calculatedPrice != null) {
            this.totalPrice = this.calculatedPrice * this.quantity;
        }
    }
}
