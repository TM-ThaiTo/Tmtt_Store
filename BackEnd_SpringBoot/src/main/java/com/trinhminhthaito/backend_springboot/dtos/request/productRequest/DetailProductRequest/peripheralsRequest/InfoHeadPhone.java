package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.peripheralsRequest;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class InfoHeadPhone extends ProductDetailRequest {
	private String type;
	private String connectionStd;
}
