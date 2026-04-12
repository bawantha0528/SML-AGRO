package com.smlagro.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smlagro.dto.response.ProductInquirySummaryResponse;
import com.smlagro.model.Product;
import com.smlagro.model.ProductCategory;
import com.smlagro.repository.InquiryRepository;
import com.smlagro.repository.ProductRepository;
import com.smlagro.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private InquiryRepository inquiryRepository;

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsByCategory(ProductCategory category) {
        return productRepository.findByCategory(category);
    }

    @Override
    public List<Product> getAvailableProducts() {
        return productRepository.findByIsAvailableTrue();
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Override
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setUnit(productDetails.getUnit());
        product.setIsAvailable(productDetails.getIsAvailable());
        product.setSpecifications(productDetails.getSpecifications());

        return productRepository.save(product);
    }

    @Override
    public List<ProductInquirySummaryResponse> getProductInquirySummary() {
        return productRepository.findAll().stream()
                .map(product -> new ProductInquirySummaryResponse(
                        product.getId(),
                        product.getName(),
                        inquiryRepository.countByProductsRequestedIgnoreCase(product.getName())))
                .collect(Collectors.toList());
    }

    @Override
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
