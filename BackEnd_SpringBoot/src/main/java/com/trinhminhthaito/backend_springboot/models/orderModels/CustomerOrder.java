package com.trinhminhthaito.backend_springboot.models.orderModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerOrder {
	private String customerId;
	private String customerName;
	private String customerEmail;
	private String customerPhone;
	private String customerAddress;
}