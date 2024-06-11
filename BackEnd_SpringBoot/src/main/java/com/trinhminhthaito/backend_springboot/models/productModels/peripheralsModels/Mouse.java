package com.trinhminhthaito.backend_springboot.models.productModels.peripheralsModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Mouse {

	private Number warranty;
	private List<String> catalogs;

	private String type;
	private String isLed;
}
