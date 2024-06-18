package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;

public interface OrderServices {
	MessageResponse createOrder(Order order);

	MessageDataResponse getOrderById(String id);
}
