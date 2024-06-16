package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;
import com.trinhminhthaito.backend_springboot.repository.OrderRepository;
import com.trinhminhthaito.backend_springboot.services.OrderServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServicesImp implements OrderServices {

	private final OrderRepository orderRepository;

	@Autowired
	public OrderServicesImp(OrderRepository orderRepository) {
		this.orderRepository = orderRepository;
	}

	@Override
	public MessageResponse createOrder(Order order) {
		MessageResponse messageResponse = new MessageResponse();

		return messageResponse;
	}
}
