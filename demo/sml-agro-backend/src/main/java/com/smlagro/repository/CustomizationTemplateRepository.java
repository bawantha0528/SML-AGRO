package com.smlagro.repository;

import com.smlagro.model.CustomizationTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CustomizationTemplateRepository extends JpaRepository<CustomizationTemplate, Long> {
    List<CustomizationTemplate> findByUserEmail(String userEmail);

    List<CustomizationTemplate> findByProductId(Long productId);
}
