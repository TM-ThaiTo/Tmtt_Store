package com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DescProductRequest;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class DescRequest {
	private String title;
	private List<DetailDescList> detailDesList;
}

