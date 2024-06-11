package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.mobileRequest;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoBackupCharger extends ProductDetailRequest {
	private Number capacity;
	private Number weight;
	private Number numberOfPort;
	private String color;
	private String voltage;
}
