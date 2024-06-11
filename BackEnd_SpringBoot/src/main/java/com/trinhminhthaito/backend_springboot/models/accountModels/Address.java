package com.trinhminhthaito.backend_springboot.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "deliveryAddress")
public class Address {
	private String id;
	private String idUser;
	private String name;
	private String phone;
	private String province;
	private String district;
	private String wards;
	private String street;
	private String details;
}
