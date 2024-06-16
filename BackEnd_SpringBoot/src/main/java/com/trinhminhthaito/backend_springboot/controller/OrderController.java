package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;
import com.trinhminhthaito.backend_springboot.services.OrderServices;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/order")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

	private final OrderServices orderServices;
	public OrderController(OrderServices orderServices) {
		this.orderServices = orderServices;
	}

	// api: create new order
	@PostMapping
	public ResponseEntity<?> createOrder(@RequestBody Order order) {
		MessageResponse messageResponse =  orderServices.createOrder(order);
		return ResponseEntity.ok(order);
	}
}
