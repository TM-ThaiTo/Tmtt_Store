package com.trinhminhthaito.backend_springboot.models.productModels.mobileModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BackupCharger {
	private Number warranty;
	private List<String> catalogs;

	private Number capacity;
	private Number weight;
	private Number numberOfPort;
	private String color;
	private String voltage;
}
