package com.trinhminhthaito.backend_springboot.models.productModels.mobileModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Mobile {

	private List<String> catalogs;
	private Number warranty;

	private String cpu;
	private String before;
	private String after;
	private String color;
	private String displaySize;
	private int operating;
	private int rom;
	private int ram;
	private String pin;
}