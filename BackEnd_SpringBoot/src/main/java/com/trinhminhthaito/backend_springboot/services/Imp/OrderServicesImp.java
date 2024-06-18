package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;
import com.trinhminhthaito.backend_springboot.repository.OrderRepository;
import com.trinhminhthaito.backend_springboot.services.OrderServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
public class OrderServicesImp implements OrderServices {

	private final OrderRepository orderRepository;

	@Autowired
	public OrderServicesImp(OrderRepository orderRepository) {
		this.orderRepository = orderRepository;
	}

	// fn: hàm tạo mã đơn hàng
	private String createOrderId() {
		Random random = new Random();
		String orderId;
		boolean exists;
		do {
			int randomNumber = 10000 + random.nextInt(90000);
			orderId = "HD-" + randomNumber;
			exists = orderRepository.existsByOrderCode(orderId);
		} while (exists);
		return orderId;
	}

	// fn: tạo đơn hàng
	@Override
	public MessageResponse createOrder(Order order) {
		MessageResponse messageResponse = new MessageResponse();
		try {
			String orderId = createOrderId();
			order.setOrderCode(orderId);
			orderRepository.save(order);
			messageResponse.setCode(0);
			messageResponse.setMessage("suscces");
		} catch (Exception ex) {
			messageResponse.setCode(-1);
			messageResponse.setMessage("Lỗi server: " + ex.getMessage());
		}
		return messageResponse;
	}

	// fn: get danh sách
	@Override
	public MessageDataResponse getOrderById(String customerId) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			List<Order> listOrder = orderRepository.findByCustomerOrderCustomerId(customerId);
			if (listOrder.isEmpty()) {
				messageDataResponse.setCode(1); // Custom code for no data found
				messageDataResponse.setMessage("No orders found for customerId: " + customerId);
			} else {
				messageDataResponse.setCode(0); // Custom code for success
				messageDataResponse.setMessage("Success");
				messageDataResponse.setData(listOrder); // Set the list of orders as data
			}
		} catch (Exception ex) {
			messageDataResponse.setCode(-1); // Custom code for error
			messageDataResponse.setMessage("Server error: " + ex.getMessage());
		}
		return messageDataResponse;
	}
}
