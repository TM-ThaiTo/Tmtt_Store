package com.trinhminhthaito.backend_springboot.models.orderModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class ItemsOrder {
	private String productId; // id
	private String name; // tên sản phẩm
	private Number stock; // số lượng
	private Number discount; // giảm giá lúc mua
	private Number price; // giá gốc
}
