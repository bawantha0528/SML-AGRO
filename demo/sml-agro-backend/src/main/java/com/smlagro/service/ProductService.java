package com.smlagro.service;

import com.smlagro.dto.request.ProductRequest;
import com.smlagro.dto.response.ProductResponse;
import com.smlagro.exception.ResourceNotFoundException;
import com.smlagro.model.Product;
import com.smlagro.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    // ── Internal entity reads (used by public-facing controllers) ──────────

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + id));
    }

    public List<Product> getProductsByCategory(String category) {
        if (category == null || category.trim().isEmpty() || category.equalsIgnoreCase("All")) {
            return getAllProducts();
        }
        return productRepository.findByCategory(category);
    }

    public List<Product> searchProducts(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllProducts();
        }
        return productRepository.searchProducts(keyword.trim());
    }

    // ── DTO-based reads (used by admin controller) ─────────────────────────

    public List<ProductResponse> getAllProductResponses() {
        return productRepository.findAll().stream()
                .map(ProductResponse::from)
                .toList();
    }

    public ProductResponse getProductResponseById(Long id) {
        return ProductResponse.from(getProductById(id));
    }

    // ── DTO-based writes (admin CRUD) ──────────────────────────────────────

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        Product product = mapToEntity(request, new Product());
        return ProductResponse.from(productRepository.save(product));
    }

    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest request) {
        Product existing = getProductById(id);
        mapToEntity(request, existing);
        return ProductResponse.from(productRepository.save(existing));
    }

    @Transactional
    public void deleteProduct(Long id) {
        productRepository.delete(getProductById(id));
    }

    // ── Private helpers ────────────────────────────────────────────────────

    private Product mapToEntity(ProductRequest request, Product product) {
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setStatus(request.getStatus() != null ? request.getStatus() : "Active");
        product.setImageUrl(request.getImageUrl());
        return product;
    }
}
