package com.trinhminhthaito.backend_springboot.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DeliveryAddressRequest {
	private String accountId;
	private String name;
	private String phone;
	private String province;
	private String district;
	private String wards;
	private String street;
	private String details;
	private String note;
}
