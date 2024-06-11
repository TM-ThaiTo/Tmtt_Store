package com.trinhminhthaito.backend_springboot.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductResponse {
	private Object product;
	private Object desc;
	private Object detail;
}
