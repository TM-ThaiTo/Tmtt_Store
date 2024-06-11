package com.trinhminhthaito.backend_springboot.models.productModels.computerModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Laptop {

	private Number warranty;
	private List<String> catalogs;

	private String chipBrand;
	private Number processorCount;
	private String series;
	private String detail;
	private String displaySize;
	private String display;
	private String operating;
	private String disk;
	private String ram;
	private String pin;
	private String weight;
}