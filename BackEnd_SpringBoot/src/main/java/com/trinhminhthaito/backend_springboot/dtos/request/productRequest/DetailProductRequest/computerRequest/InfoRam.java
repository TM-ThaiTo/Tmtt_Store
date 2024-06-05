package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoRam extends ProductDetailRequest{
	private String capacity;
	private String bus;
	private String type;
}
