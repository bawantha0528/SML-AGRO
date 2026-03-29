package com.smlagro.controller;

import com.smlagro.model.Product;
import com.smlagro.model.ProductCategory;
import com.smlagro.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/products")
@CrossOrigin(origins = "*")
public class PublicProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllAvailableProducts() {
        return productService.getAvailableProducts();
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productService.getProductById(id);
    }

    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable ProductCategory category) {
        return productService.getProductsByCategory(category);
    }
}
