package com.trinhminhthaito.backend_springboot.models.orderModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DeliveryAddressesOrder {
	private String nameReceiver;
	private String phoneReceiver;
	// private String email;
	private String shippingAddress;
	private String note;
	private String shippingMethod;
	private String transportFee;
}
