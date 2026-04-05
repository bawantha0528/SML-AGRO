package com.smlagro.controller;

import com.smlagro.model.CustomizationTemplate;
import com.smlagro.model.Product;
import com.smlagro.repository.CustomizationTemplateRepository;
import com.smlagro.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customization")
@CrossOrigin(origins = "*")
public class PublicCustomizationController {

    @Autowired
    private CustomizationTemplateRepository templateRepository;

    @Autowired
    private ProductRepository productRepository;

    // Save a customization template
    @PostMapping("/templates")
    public ResponseEntity<?> saveTemplate(@RequestBody Map<String, Object> body) {
        try {
            String templateName = (String) body.get("templateName");
            String userEmail = (String) body.get("userEmail");
            Long productId = Long.valueOf(body.get("productId").toString());
            String configurationData = (String) body.get("configurationData");

            Product product = productRepository.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            CustomizationTemplate template = new CustomizationTemplate();
            template.setTemplateName(templateName);
            template.setUserEmail(userEmail);
            template.setProduct(product);
            template.setConfigurationData(configurationData);

            return ResponseEntity.ok(templateRepository.save(template));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Get templates by user email
    @GetMapping("/templates")
    public ResponseEntity<List<CustomizationTemplate>> getTemplatesByEmail(@RequestParam String email) {
        return ResponseEntity.ok(templateRepository.findByUserEmail(email));
    }

    // Delete a template
    @DeleteMapping("/templates/{id}")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        templateRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
