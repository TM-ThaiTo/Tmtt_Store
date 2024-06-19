package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.OrderListUserRepository;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;
import com.trinhminhthaito.backend_springboot.models.orderModels.PaymentDetail;
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

	// fn: get danh sách đơn hàng theo id người dùng
	@Override
	public MessageDataResponse getOrderById(String customerId) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			List<Order> listOrder = orderRepository.findByCustomerOrderCustomerId(customerId);
			List<OrderListUserRepository> orderList = new ArrayList<>();
			if (listOrder.isEmpty()) {
				messageDataResponse.setCode(1); // Custom code for no data found
				messageDataResponse.setMessage("No orders found for customerId: " + customerId);
			} else {
				for (Order item : listOrder) {
					OrderListUserRepository o = new OrderListUserRepository();
					PaymentDetail pd = item.getPaymentDetail();
					o.setOrderCode(item.getOrderCode());
					o.setOrderDate(item.getOrderDate());
					o.setStatus(item.getStatus());
					o.setPaidAmount(pd.getPaidAmount());
					orderList.add(o);
				}
				messageDataResponse.setCode(0); // Custom code for success
				messageDataResponse.setMessage("Success");
				messageDataResponse.setData(orderList); // Set the list of orders as data
			}
		} catch (Exception ex) {
			messageDataResponse.setCode(-1); // Custom code for error
			messageDataResponse.setMessage("Server error: " + ex.getMessage());
		}
		return messageDataResponse;
	}

	// fn: update payment status
	@Override
	public MessageResponse updatePaymentStatusVnpay(String id) {
		MessageResponse messageResponse = new MessageResponse();
		try {
			Order order = orderRepository.findByPaymentDetailCodeMethod(id);
			if (order == null) {
				messageResponse.setCode(1);
				messageResponse.setMessage("Đơn hàng không tồn tại");
			} else {
				PaymentDetail detail = order.getPaymentDetail();
				if (detail != null) {
					detail.setPaymentStatus("Đã thanh toán");
					order.setPaymentDetail(detail);
					orderRepository.save(order); // Use save method to update the existing order
					messageResponse.setCode(0);
					messageResponse.setMessage("Cập nhật trạng thái thanh toán thành công");
				} else {
					messageResponse.setCode(2);
					messageResponse.setMessage("Chi tiết thanh toán không tồn tại");
				}
			}
		} catch (Exception ex) {
			messageResponse.setCode(-1);
			messageResponse.setMessage("Lỗi server: " + ex.getMessage());
		}
		return messageResponse;
	}

	// fn: delete order
	@Override
	public MessageResponse deleteOrderVnpay(String id) {
		MessageResponse messageResponse = new MessageResponse();
		try {
			Order order = orderRepository.findByPaymentDetailCodeMethod(id);
			if (order == null) {
				messageResponse.setCode(0);
				messageResponse.setMessage("Suscess");
			} else {
				orderRepository.delete(order);
				messageResponse.setCode(0);
				messageResponse.setMessage("Suscess");
			}
		} catch (Exception ex) {
			messageResponse.setCode(-1);
			messageResponse.setMessage("Lỗi server: " + ex.getMessage());
		}
		return messageResponse;
	}

	// fn: get detail order
	@Override
	public MessageDataResponse getOrderDetail(String id) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			Order order = orderRepository.findByOrderCode(id);

			if (order == null) {
				messageDataResponse.setCode(-1);
				messageDataResponse.setMessage("Order not found");
			} else {
				messageDataResponse.setCode(0);
				messageDataResponse.setMessage("suscces");
				messageDataResponse.setData(order);
				messageDataResponse.setCount(1);
			}
		} catch (Exception ex) {
			messageDataResponse.setCode(-1);
			messageDataResponse.setMessage("Lỗi server: " + ex.getMessage());
		}
		return messageDataResponse;
	}
}
