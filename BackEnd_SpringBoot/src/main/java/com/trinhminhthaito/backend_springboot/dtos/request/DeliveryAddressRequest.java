package com.trinhminhthaito.backend_springboot.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DeliveryAddressRequest {
	private int id;
	private String userId;
	private String name;
	private String phone;
	private String province;
	private String district;
	private String wards;
	private String street;
	private String details;
	private String note;
	private String address;
}
