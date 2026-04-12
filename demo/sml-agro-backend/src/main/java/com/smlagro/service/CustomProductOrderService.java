package com.smlagro.service;

import java.util.List;

import com.smlagro.dto.request.CustomProductOrderRequest;
import com.smlagro.dto.response.CustomProductOrderResponse;
import com.smlagro.model.CustomOrderStatus;

public interface CustomProductOrderService {

    CustomProductOrderResponse submit(CustomProductOrderRequest request);

    List<CustomProductOrderResponse> getAll(String status, String search);

    CustomProductOrderResponse getById(Long id);

    CustomProductOrderResponse updateStatus(Long id, CustomOrderStatus status);
}
