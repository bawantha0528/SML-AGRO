package com.smlagro.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.smlagro.dto.request.CustomProductOrderRequest;
import com.smlagro.dto.response.CustomProductOrderResponse;
import com.smlagro.model.CustomOrderStatus;
import com.smlagro.model.CustomProductOrder;
import com.smlagro.repository.CustomProductOrderRepository;
import com.smlagro.service.CustomProductOrderService;

@Service
@Transactional
public class CustomProductOrderServiceImpl implements CustomProductOrderService {

    private final CustomProductOrderRepository customProductOrderRepository;

    @Autowired
    public CustomProductOrderServiceImpl(CustomProductOrderRepository customProductOrderRepository) {
        this.customProductOrderRepository = customProductOrderRepository;
    }

    @Override
    public CustomProductOrderResponse submit(CustomProductOrderRequest request) {
        CustomProductOrder order = new CustomProductOrder();
        order.setCustomerName(request.getCustomerName());
        order.setEmail(request.getEmail());
        order.setPhone(request.getPhone());
        order.setCountry(request.getCountry());
        order.setProductType(request.getProductType());
        order.setColor(request.getColor());
        order.setSize(request.getSize());
        order.setDesignName(request.getDesignName());
        order.setQuantity(request.getQuantity() == null || request.getQuantity() < 1 ? 1 : request.getQuantity());
        order.setSpecialNotes(request.getSpecialNotes());
        order.setBudgetRange(request.getBudgetRange());
        order.setTargetDeliveryDate(request.getTargetDeliveryDate());
        order.setReferenceImages(request.getReferenceImages());
        order.setStatus(CustomOrderStatus.NEW);

        CustomProductOrder saved = customProductOrderRepository.save(order);
        return CustomProductOrderResponse.fromEntity(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CustomProductOrderResponse> getAll(String status, String search) {
        List<CustomProductOrder> orders;

        if (search != null && !search.isBlank()) {
            if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
                try {
                    CustomOrderStatus s = CustomOrderStatus.valueOf(status.toUpperCase());
                    orders = customProductOrderRepository.searchByStatus(s, search);
                } catch (IllegalArgumentException e) {
                    orders = customProductOrderRepository.search(search);
                }
            } else {
                orders = customProductOrderRepository.search(search);
            }
        } else if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            try {
                CustomOrderStatus s = CustomOrderStatus.valueOf(status.toUpperCase());
                orders = customProductOrderRepository.findByStatusOrderByCreatedAtDesc(s);
            } catch (IllegalArgumentException e) {
                orders = customProductOrderRepository.findAllByOrderByCreatedAtDesc();
            }
        } else {
            orders = customProductOrderRepository.findAllByOrderByCreatedAtDesc();
        }

        return orders.stream()
                .map(CustomProductOrderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CustomProductOrderResponse getById(Long id) {
        return CustomProductOrderResponse.fromEntity(findOrThrow(id));
    }

    @Override
    public CustomProductOrderResponse updateStatus(Long id, CustomOrderStatus status) {
        CustomProductOrder order = findOrThrow(id);
        order.setStatus(status);
        return CustomProductOrderResponse.fromEntity(customProductOrderRepository.save(order));
    }

    private CustomProductOrder findOrThrow(Long id) {
        return customProductOrderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Custom order not found: " + id));
    }
}
