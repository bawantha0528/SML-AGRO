package com.smlagro.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smlagro.model.CustomCatalogProduct;
import com.smlagro.repository.CustomCatalogProductRepository;
import com.smlagro.service.CustomCatalogProductService;

@Service
public class CustomCatalogProductServiceImpl implements CustomCatalogProductService {

    private final CustomCatalogProductRepository customCatalogProductRepository;

    @Autowired
    public CustomCatalogProductServiceImpl(CustomCatalogProductRepository customCatalogProductRepository) {
        this.customCatalogProductRepository = customCatalogProductRepository;
    }

    @Override
    public List<CustomCatalogProduct> getAllForAdmin() {
        return customCatalogProductRepository.findAllByOrderByDisplayOrderAscCreatedAtDesc();
    }

    @Override
    public List<CustomCatalogProduct> getAllActiveForPublic() {
        return customCatalogProductRepository.findByIsActiveTrueOrderByDisplayOrderAscCreatedAtDesc();
    }

    @Override
    public CustomCatalogProduct create(CustomCatalogProduct customCatalogProduct) {
        return customCatalogProductRepository.save(customCatalogProduct);
    }

    @Override
    public CustomCatalogProduct update(Long id, CustomCatalogProduct customCatalogProduct) {
        CustomCatalogProduct existing = customCatalogProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custom catalog product not found: " + id));

        existing.setName(customCatalogProduct.getName());
        existing.setShortDescription(customCatalogProduct.getShortDescription());
        existing.setImageUrl(customCatalogProduct.getImageUrl());
        existing.setIsActive(customCatalogProduct.getIsActive());
        existing.setDisplayOrder(customCatalogProduct.getDisplayOrder());

        return customCatalogProductRepository.save(existing);
    }

    @Override
    public void delete(Long id) {
        CustomCatalogProduct existing = customCatalogProductRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custom catalog product not found: " + id));
        customCatalogProductRepository.delete(existing);
    }
}
