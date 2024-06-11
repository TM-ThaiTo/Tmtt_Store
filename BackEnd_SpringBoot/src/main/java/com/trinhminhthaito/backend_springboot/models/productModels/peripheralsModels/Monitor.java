package com.trinhminhthaito.backend_springboot.models.productModels.peripheralsModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Monitor {
	private Number warranty;
	private List<String> catalogs;

	private String bgPlate;
	private String resolution;
	private String displaySize;
	private Number frequency = 60;
	private String port;
}
