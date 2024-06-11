package com.trinhminhthaito.backend_springboot.models.productModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DescProduct {
	private String title;
	private List<DescItem> descItems;
}


