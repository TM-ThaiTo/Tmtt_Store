package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.computerRequest;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoLaptop extends ProductDetailRequest {
	private String chipBrand;
	private Number processorCount;
	private String series;
	private String detail;
	private String displaySize;
	private String display;
	private String operating;
	private String disk;
	private String ram;
	private String pin;
	private String weight;
}