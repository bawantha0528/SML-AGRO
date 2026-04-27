package com.smlagro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.smlagro.model.CustomCatalogProduct;

@Repository
public interface CustomCatalogProductRepository extends JpaRepository<CustomCatalogProduct, Long> {

    List<CustomCatalogProduct> findAllByOrderByDisplayOrderAscCreatedAtDesc();

    List<CustomCatalogProduct> findByIsActiveTrueOrderByDisplayOrderAscCreatedAtDesc();
}
