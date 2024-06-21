package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;

public interface OrderServices {
	MessageResponse createOrder(Order order);

	MessageDataResponse getOrderById(String id);

	MessageResponse updatePaymentStatusVnpay(String id);

	MessageResponse deleteOrderVnpay(String id);

	MessageDataResponse getOrderDetail(String id);

	MessageDataResponse getAllOrder();

	MessageDataResponse getSearchOrder(String codeOrder, String paymentOrder, Number statusOrder);

	MessageResponse putUpdateStatus(String idOrder, Number status);

	MessageResponse deleteOrder(String id);
}
