package com.trinhminhthaito.backend_springboot.models.productModels.peripheralsModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Router {
	private Number warranty;
	private List<String> catalogs;

	private Number bandwidth;
	private Number strong;
	private String numberOfPort;
}
