package com.smlagro.service;

import com.smlagro.model.Product;
import com.smlagro.model.ProductCategory;

import java.util.List;

public interface ProductService {
    List<Product> getAllProducts();

    List<Product> getProductsByCategory(ProductCategory category);

    List<Product> getAvailableProducts();

    Product getProductById(Long id);

    Product createProduct(Product product);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);
}
