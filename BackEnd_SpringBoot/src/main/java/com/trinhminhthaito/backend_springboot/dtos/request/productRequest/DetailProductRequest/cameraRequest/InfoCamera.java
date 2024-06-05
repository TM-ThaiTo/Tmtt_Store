package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest;

import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoCamera extends ProductDetailRequest {
	private String aperture;
	private String focalLength;
	private String sensor;
	private String numberOfPixel;
	private String resolution;
}
