package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.peripheralsRequest;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoMouse extends ProductDetailRequest {
	private String type;
	private String isLed;
}
