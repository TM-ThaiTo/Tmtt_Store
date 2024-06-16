package com.trinhminhthaito.backend_springboot.models.orderModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ItemsOrder {
	private String idProduct; // id
	private String name; // tên sản phẩm
	private String stock; // số lượng
	private String discount; // giảm giá lúc mua
	private String price; // giá gốc
}
