package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoWebcam extends ProductDetailRequest{
	private String connectionStd;
	private String frameSpeed;
	private String resolution;
}
