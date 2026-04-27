package com.smlagro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.smlagro.model.CustomCatalogProduct;
import com.smlagro.service.CustomCatalogProductService;

@RestController
@RequestMapping("/api/public/custom-products")
public class PublicCustomCatalogProductController {

    private final CustomCatalogProductService customCatalogProductService;

    @Autowired
    public PublicCustomCatalogProductController(CustomCatalogProductService customCatalogProductService) {
        this.customCatalogProductService = customCatalogProductService;
    }

    @GetMapping
    public List<CustomCatalogProduct> getAllActive() {
        return customCatalogProductService.getAllActiveForPublic();
    }
}
