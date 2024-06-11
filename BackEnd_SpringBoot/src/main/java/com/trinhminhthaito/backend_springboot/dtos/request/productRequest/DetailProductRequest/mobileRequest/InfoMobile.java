package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.mobileRequest;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoMobile extends ProductDetailRequest {
	private String cpu;
	private String color;
	private String displaySize;
	private int operating;
	private int rom;
	private int ram;
	private String pin;
	private String before;
	private String after;
}