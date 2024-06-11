package com.trinhminhthaito.backend_springboot.dtos.request.productRequest;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DescProductRequest.DescRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddProductRequest {
	private ProductRequest product;
	private ProductDetailRequest details;
	private DescRequest desc;
}