package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoLaptop extends ProductDetailRequest{
	private Cpu cpu;
	private String displaySize;
	private String display;
	private String operating;
	private String disk;
	private String ram;
	private String pin;
	private String weight;
}

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
class Cpu {
	private String chipBrand;
	private Number processorCount;
	private String series;
	private String detail;
}
