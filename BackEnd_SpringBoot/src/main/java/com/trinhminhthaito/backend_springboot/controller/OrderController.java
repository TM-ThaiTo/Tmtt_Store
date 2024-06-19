package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;
import com.trinhminhthaito.backend_springboot.services.OrderServices;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> createOrder(@RequestBody Order order) {
		MessageResponse messageResponse = orderServices.createOrder(order);
		return ResponseEntity.ok(messageResponse);
	}

	// api: get danh sách order theo user
	@GetMapping
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> getOrderById(@RequestParam String id) {
		MessageDataResponse message = orderServices.getOrderById(id);
		return ResponseEntity.ok(message);
	}

	// api: update đơn hàng thành công VNPay
	@GetMapping("/updateVnpay")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> updatePaymentStatus(@RequestParam String id) {
		MessageResponse messageResponse = orderServices.updatePaymentStatusVnpay(id);
		return ResponseEntity.ok(messageResponse);
	}

	// api: delete đơn hàng không thành công VNPay
	@GetMapping("/deleteVnpay")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> deleteOrderVNPay(@RequestParam String id) {
		MessageResponse messageResponse = orderServices.deleteOrderVnpay(id);
		return ResponseEntity.ok(messageResponse);
	}

	// api: get chi tiết đơn hàng
	@GetMapping("/ordercode")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> getDetailOrder(@RequestParam String id) {
		MessageDataResponse messageResponse = orderServices.getOrderDetail(id);
		return ResponseEntity.ok(messageResponse);
	}
}
