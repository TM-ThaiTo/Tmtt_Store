package com.trinhminhthaito.backend_springboot.models.accountModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Address {
	private int id;
	private String name;
	private String phone;
	private String province;
	private String district;
	private String wards;
	private String street;
	private String details;
	private String note;
}
