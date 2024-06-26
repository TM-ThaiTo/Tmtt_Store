package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.AddProductRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.ProductRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.ProductResponse;

public interface ProductServices {
	MessageResponse addProduct(AddProductRequest product);

	ProductResponse getProductById(String id);

	MessageResponse deleteProductById(String id);

	MessageResponse updateProductById(ProductRequest product);

	MessageDataResponse getProductToType(int id, int quantity);

	MessageDataResponse getProductByPage(int page, int size);

	MessageDataResponse getFilterProductServices(int type, int page, int perPage);

	MessageDataResponse getSearchProduct(String nameP, String codeP, Number typeP);

	MessageDataResponse getOutstanding();

	MessageDataResponse getReOrder(String token);

	MessageDataResponse getSearchProductPageUser(String value, Number page, Number perPage);
}
