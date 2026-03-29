package com.smlagro.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "customization_options")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomizationOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "option_name", nullable = false, length = 100)
    private String optionName;

    @Enumerated(EnumType.STRING)
    @Column(name = "option_type", nullable = false, length = 20)
    private OptionType optionType = OptionType.SELECT;

    @Column(name = "choices_json", columnDefinition = "TEXT")
    private String choicesJson; // JSON array with price impacts

    @Column(name = "default_value", length = 100)
    private String defaultValue;

    @Column(name = "price_impact")
    private Double priceImpact = 0.0;

    @Column(name = "is_required")
    private Boolean isRequired = false;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    @PrePersist
    protected void onCreate() {
        if (this.optionType == null)
            this.optionType = OptionType.SELECT;
        if (this.priceImpact == null)
            this.priceImpact = 0.0;
        if (this.isRequired == null)
            this.isRequired = false;
        if (this.displayOrder == null)
            this.displayOrder = 0;
    }
}
