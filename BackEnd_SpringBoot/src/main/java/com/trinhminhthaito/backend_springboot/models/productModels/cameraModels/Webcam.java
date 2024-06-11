package com.trinhminhthaito.backend_springboot.models.productModels.cameraModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Webcam {
	private Number warranty;
	private List<String> catalogs;

	private String connectionStd;
	private String frameSpeed;
	private String resolution;
}
