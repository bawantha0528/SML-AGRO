package com.smlagro.service;

import java.util.List;

import com.smlagro.dto.response.ProductInquirySummaryResponse;
import com.smlagro.model.Product;
import com.smlagro.model.ProductCategory;

public interface ProductService {
    List<Product> getAllProducts();

    List<Product> getProductsByCategory(ProductCategory category);

    List<Product> getAvailableProducts();

    Product getProductById(Long id);

    Product createProduct(Product product);

    Product updateProduct(Long id, Product product);

    List<ProductInquirySummaryResponse> getProductInquirySummary();

    void deleteProduct(Long id);
}
