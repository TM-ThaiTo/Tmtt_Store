package com.trinhminhthaito.backend_springboot.models.orderModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "orders")
public class Order {
	@Id
	private String id;
	private String orderCode;
	private CustomerOrder customerOrder;
	private DeliveryAddressesOrder deliveryAddressesOrder;
	private List<ItemsOrder> itemsOrders = new ArrayList<>();
	private PaymentDetail paymentDetail;
	private Number numOfProd;
	private String note; // ghi chú
	private Date orderDate; // ngày đặt
	private Number status; // trạng thái đơn hàng
	private LocalDate dateOfPayment; // ngày thanh toán
}