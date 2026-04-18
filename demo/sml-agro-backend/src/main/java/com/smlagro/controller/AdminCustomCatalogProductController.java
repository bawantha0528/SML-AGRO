package com.smlagro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smlagro.model.CustomCatalogProduct;
import com.smlagro.service.CustomCatalogProductService;

@RestController
@RequestMapping("/api/admin/custom-products")
@CrossOrigin(origins = "*")
public class AdminCustomCatalogProductController {

    private final CustomCatalogProductService customCatalogProductService;

    @Autowired
    public AdminCustomCatalogProductController(CustomCatalogProductService customCatalogProductService) {
        this.customCatalogProductService = customCatalogProductService;
    }

    @GetMapping
    public List<CustomCatalogProduct> getAll() {
        return customCatalogProductService.getAllForAdmin();
    }

    @PostMapping
    public CustomCatalogProduct create(@RequestBody CustomCatalogProduct customCatalogProduct) {
        return customCatalogProductService.create(customCatalogProduct);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomCatalogProduct> update(
            @PathVariable Long id,
            @RequestBody CustomCatalogProduct customCatalogProduct) {
        return ResponseEntity.ok(customCatalogProductService.update(id, customCatalogProduct));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        customCatalogProductService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
