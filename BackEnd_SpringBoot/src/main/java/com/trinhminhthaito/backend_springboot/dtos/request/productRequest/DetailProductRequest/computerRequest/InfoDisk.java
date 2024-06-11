package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.computerRequest;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class InfoDisk extends ProductDetailRequest {
	private String capacity;
	private String size;
	private String type;
	private String connectionStd;
	private Number readSpeed;
	private Number writeSpeed;
	private Number rpm;
}