package com.smlagro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_number", columnList = "order_number"),
        @Index(name = "idx_order_status", columnList = "status")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false, length = 20)
    private String orderNumber;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "inquiry_id", nullable = false)
    private Inquiry inquiry;

    @Column(name = "total_amount", nullable = false)
    private Double totalAmount;

    @Column(length = 3)
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(name = "shipping_address", columnDefinition = "TEXT")
    private String shippingAddress;

    @Column(name = "shipping_method", length = 50)
    private String shippingMethod;

    @Column(name = "estimated_delivery")
    private LocalDate estimatedDelivery;

    @Column(name = "payment_terms", columnDefinition = "TEXT")
    private String paymentTerms;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.orderNumber == null) {
            this.orderNumber = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        if (this.currency == null)
            this.currency = "USD";
        if (this.status == null)
            this.status = OrderStatus.PENDING;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
