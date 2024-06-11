package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.ProductResponse;
import com.trinhminhthaito.backend_springboot.services.ProductServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/product")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

	private final ProductServices productServices;

	@Autowired
	public ProductController(ProductServices productServices) {
		this.productServices = productServices;
	}

	// api: get one product + detail + desc
	@GetMapping("/one")
	public ResponseEntity<?> getProductById(@RequestParam String id) {
		ProductResponse productResponse = productServices.getProductById(id);
		MessageDataResponse productResponseData = new MessageDataResponse();
		if (productResponse != null) {
			productResponseData.setCode(0);
			productResponseData.setMessage("success");
			productResponseData.setData(productResponse);
			return ResponseEntity.ok(productResponseData);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// api: get product to type
	@GetMapping("/type")
	public ResponseEntity<?> getProducts(@RequestParam int type, @RequestParam int quantity) {
		MessageDataResponse messageResponse = productServices.getProductToType(type, quantity);
		if (messageResponse.getCode() != 0 || messageResponse.getData() == null) {
			return ResponseEntity.badRequest().body(messageResponse);
		}
		return ResponseEntity.ok(messageResponse);
	}

	// api: get product và phân trang
	@GetMapping("/page")
	public ResponseEntity<?> getProductsByPage(@RequestParam int page, @RequestParam int size) {
		MessageDataResponse messageResponse = productServices.getProductByPage(page, size);
		if (messageResponse.getCode() != 0 || messageResponse.getData() == null) {
			return ResponseEntity.badRequest().body(messageResponse);
		}
		return ResponseEntity.ok(messageResponse);
	}
}