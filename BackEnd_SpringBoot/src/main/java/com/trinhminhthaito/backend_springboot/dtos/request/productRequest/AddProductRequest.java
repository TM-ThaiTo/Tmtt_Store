package com.trinhminhthaito.backend_springboot.dtos.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AddProductRequest {
	private Product product;
	private ProductDetail details;
	private Desc desc;

}

// Product
@AllArgsConstructor
@NoArgsConstructor
@Data
class Product{
	private String name;
	private String code;
	private int type;
	private int price;
	private String brand;
	private String stock;
	private String avt;
}

// Desc
@AllArgsConstructor
@NoArgsConstructor
@Data
class Desc{
	private String title;
	private List<DetailDesList> detailDesList;
}
@AllArgsConstructor
@NoArgsConstructor
@Data
class DetailDesList{
	private String content;
	private String photo;
}

// Product Detail
@AllArgsConstructor
@NoArgsConstructor
@Data
class ProductDetail{
	private List<String> catalogs;
	private int warranty;
}

// camera
@AllArgsConstructor
@NoArgsConstructor
@Data
class InfoCamera extends ProductDetail{
	private String aperture;
	private String focalLength;
	private String sensor;
	private String numberOfPixel;
	private String resolution;
}