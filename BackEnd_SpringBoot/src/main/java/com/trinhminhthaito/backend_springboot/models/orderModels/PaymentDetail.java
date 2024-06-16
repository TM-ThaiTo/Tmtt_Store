package com.trinhminhthaito.backend_springboot.models.orderModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class PaymentDetail {
	private String paymentMethod; // phương thức thanh toán (tiền mặt, VNPay, ...)
	private String codeMethod; // đối với thanh toán trực tuyến
	private String paymentStatus; // status thanh toán
	private Number totalAmount; // tổng số tiền thanh toán
	private Number paidAmount; // số tiền cần thanh toán
}
