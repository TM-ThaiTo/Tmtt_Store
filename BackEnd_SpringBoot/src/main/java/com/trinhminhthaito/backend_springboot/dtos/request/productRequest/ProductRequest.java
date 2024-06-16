package com.trinhminhthaito.backend_springboot.dtos.request.productRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ProductRequest {
	private String id;
	private String name;
	private String code;
	private int type;
	private Number price;
	private String brand;
	private int stock;
	private int sold;
	private Number discount;
	private String avt;
	private Number rates;
}
