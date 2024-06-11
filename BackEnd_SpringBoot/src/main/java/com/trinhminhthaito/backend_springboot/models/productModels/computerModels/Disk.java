package com.trinhminhthaito.backend_springboot.models.productModels.computerModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Disk {
	private Number warranty;
	private List<String> catalogs;

	private String capacity;
	private String size;
	private String type;
	private String connectionStd;
	private Number readSpeed;
	private Number writeSpeed;
	private Number rpm;
}