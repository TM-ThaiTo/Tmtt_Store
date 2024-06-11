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
public class InfoMonitor extends ProductDetailRequest {
	private String bgPlate;
	private String resolution;
	private String displaySize;
	private Number frequency;
	private String port;
}
