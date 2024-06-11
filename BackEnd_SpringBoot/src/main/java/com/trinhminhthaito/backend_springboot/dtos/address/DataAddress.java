package com.trinhminhthaito.backend_springboot.dtos.address;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DataAddress {
	private List<Province> province;
	private List<District> district;
	private List<Commune> commune;

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Province {
		private String idProvince;
		private String name;
	}

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	public static class District {
		private String idProvince;
		private String idDistrict;
		private String name;
	}

	@Data
	@AllArgsConstructor
	@NoArgsConstructor
	public static class Commune {
		private String idDistrict;
		private String idCommune;
		private String name;
	}
}
