package com.smlagro.service;

import java.util.List;

import com.smlagro.model.CustomCatalogProduct;

public interface CustomCatalogProductService {

    List<CustomCatalogProduct> getAllForAdmin();

    List<CustomCatalogProduct> getAllActiveForPublic();

    CustomCatalogProduct create(CustomCatalogProduct customCatalogProduct);

    CustomCatalogProduct update(Long id, CustomCatalogProduct customCatalogProduct);

    void delete(Long id);
}
