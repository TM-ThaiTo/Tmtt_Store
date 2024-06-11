package com.trinhminhthaito.backend_springboot.models.productModels.cameraModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class Camera {
	private Number warranty;
	private List<String> catalogs;

	private String aperture;
	private String focalLength;
	private String sensor;
	private String numberOfPixel;
	private String resolution;
}
