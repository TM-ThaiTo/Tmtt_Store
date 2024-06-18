package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.AddProductRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DescProductRequest.DescRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.DetailProductRequest.ProductDetailRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.ProductRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.ProductResponse;
import com.trinhminhthaito.backend_springboot.helper.*;
import com.trinhminhthaito.backend_springboot.models.productModels.DescItem;
import com.trinhminhthaito.backend_springboot.models.productModels.DescProduct;
import com.trinhminhthaito.backend_springboot.models.productModels.Product;
import com.trinhminhthaito.backend_springboot.repository.ProductRepository;
import com.trinhminhthaito.backend_springboot.services.CloudinaryServices;
import com.trinhminhthaito.backend_springboot.services.ProductServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProductServicesImp implements ProductServices {

	private final DetailProductHelper detailProductHelper;
	private final ProductRepository productRepository;
	private final CloudinaryServices cloudinaryServices;

	@Autowired
	private ProductServicesImp(DetailProductHelper detailProductHelper,
			CloudinaryServices cloudinaryServices,
			ProductRepository productRepository) {
		this.detailProductHelper = detailProductHelper;
		this.cloudinaryServices = cloudinaryServices;
		this.productRepository = productRepository;
	}

	// fn: check product
	private Boolean check(ProductRequest productRequest) {
		return productRepository.findByCode(productRequest.getCode()).isPresent();
	}

	// fn: thêm thông tin product
	private void addProduct(ProductRequest productRequest, ProductDetailRequest detailRequest,
			DescRequest descRequest) {
		Product product = new Product();
		product.setCode(productRequest.getCode());
		product.setName(productRequest.getName());
		String urlAvt = cloudinaryServices.uploadImageProductAvatar(productRequest.getAvt(), productRequest.getCode());
		product.setAvt(urlAvt);
		product.setPrice(productRequest.getPrice());
		product.setType(productRequest.getType());
		product.setBrand(productRequest.getBrand());
		product.setStock(productRequest.getStock());
		product.setDiscount(product.getDiscount());
		productRepository.save(product); // lưu thông tin product
		addDetail(detailRequest, productRequest.getType(), product, product.getCode()); // add detail
		addDesc(descRequest, product, product.getCode()); // add Desc
	}

	// fn: thêm thông tin detail
	private void addDetail(ProductDetailRequest productDetailRequest, int type, Product product, String code) {
		List<String> catalogs = productDetailRequest.getCatalogs();
		List<String> linkUrl = cloudinaryServices.uploadImageCatalogs(catalogs, code);
		detailProductHelper.addDetail(productDetailRequest, type, linkUrl, product);
		productRepository.save(product);
	}

	// fn: thêm thông tin desc
	public void addDesc(DescRequest descRequest, Product product, String codeProduct) {
		DescProduct descProduct = new DescProduct();
		descProduct.setTitle(descRequest.getTitle());

		// Convert detail description list from request to DescItem list
		List<DescItem> descItems = descRequest.getDetailDesList().stream()
				.map(detailDesList -> {
					String photoUrl = cloudinaryServices.uploadImageDesc(detailDesList.getPhoto(), codeProduct);
					return new DescItem(detailDesList.getContent(), photoUrl);
				})
				.collect(Collectors.toList());
		descProduct.setDescItems(descItems);

		product.setDesc(descProduct);
		// Save to repository
		productRepository.save(product);
	}

	// fn: hàm đầu tiên để thêm product
	@Override
	public MessageResponse addProduct(AddProductRequest product) {
		MessageResponse messageResponse = new MessageResponse();

		if (product.getProduct().getType() == 0) {
			messageResponse.setCode(3);
			messageResponse.setMessage("Missing type adding product");
			return messageResponse;
		}

		try {
			ProductRequest newProduct = product.getProduct();
			ProductDetailRequest detailProduct = product.getDetails();
			DescRequest descProduct = product.getDesc();

			if (detailProduct == null || descProduct == null) {
				messageResponse.setCode(1);
				messageResponse.setMessage("Missing product information");
				return messageResponse;
			}

			if (check(newProduct)) {
				messageResponse.setCode(2);
				messageResponse.setMessage("Sản phẩm đã tồn tại");
				return messageResponse;
			}

			addProduct(newProduct, detailProduct, descProduct);

			messageResponse.setCode(0);
			messageResponse.setMessage("Product added successfully");
		} catch (Exception e) {
			messageResponse.setCode(-1);
			messageResponse.setMessage("Error adding product" + e.getMessage());
		}
		return messageResponse;
	}

	// fn: get all 1 product
	@Override
	public ProductResponse getProductById(String id) {
		ProductResponse productResponse = new ProductResponse();
		Product product = productRepository.findById(id).orElse(null);
		if (product == null) {
			return null;
		}

		ProductRequest productRequest = new ProductRequest();
		productRequest.setId(product.getId());
		productRequest.setRates(product.getRates());
		productRequest.setName(product.getName());
		productRequest.setCode(product.getCode());
		productRequest.setType((int) product.getType());
		productRequest.setDiscount((int) product.getDiscount());
		productRequest.setPrice(product.getPrice());
		productRequest.setBrand(product.getBrand());
		productRequest.setStock((int) product.getStock());
		productRequest.setAvt(product.getAvt());

		DescProduct descProduct = product.getDesc();
		Object detailProduct = detailProductHelper.findDetailByType((int) product.getType(), product);

		productResponse.setProduct(productRequest); // get product
		productResponse.setDesc(descProduct); // get desc
		productResponse.setDetail(detailProduct); // get detail
		return productResponse;
	}

	// fn: delete 1 product
	@Override
	public MessageResponse deleteProductById(String id) {
		MessageResponse messageResponse = new MessageResponse();
		try {
			Product product = productRepository.findById(id).orElse(null);
			if (product == null) {
				messageResponse.setCode(1);
				messageResponse.setMessage("Product not found");
				return messageResponse;
			}
			String code = product.getCode();
			String folderPath = "products/" + code;
			messageResponse = cloudinaryServices.deleteFolder(folderPath);
			if (messageResponse.getCode() != 0) {
				messageResponse.setCode(messageResponse.getCode());
				messageResponse.setMessage(messageResponse.getMessage());
				return messageResponse;
			}

			productRepository.deleteById(id); // xoá product
			messageResponse.setCode(0);
			messageResponse.setMessage("Product deleted successfully");
		} catch (Exception e) {
			messageResponse.setCode(-1);
			messageResponse.setMessage("Error deleting product" + e.getMessage());
		}
		return messageResponse;
	}

	// fn: get product to type
	@Override
	public MessageDataResponse getProductToType(int type, int quantity) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		Pageable pageable = PageRequest.of(0, quantity);
		// Sử dụng phương thức findByType với Pageable
		List<Product> productToType = productRepository.findByType(type, pageable);

		if (productToType == null || productToType.isEmpty()) {
			messageDataResponse.setCode(1);
			messageDataResponse.setMessage("Product not found");
			return messageDataResponse;
		}

		List<ProductRequest> productRequests = productToType.stream()
				.map(product -> new ProductRequest(
						product.getId(),
						product.getName(),
						product.getCode(),
						product.getType(),
						product.getPrice(),
						product.getBrand(),
						product.getStock(),
						product.getSold(),
						product.getDiscount(),
						product.getAvt(),
						product.getRates()))
				.collect(Collectors.toList());

		int count = productRequests.size();
		messageDataResponse.setCode(0);
		messageDataResponse.setMessage("Success");
		messageDataResponse.setData(productRequests);
		messageDataResponse.setCount(count);
		return messageDataResponse;
	}

	// fn: get product and page
	@Override
	public MessageDataResponse getProductByPage(int page, int size) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		Pageable pageable = PageRequest.of(page, size);
		Page<Product> productPage = productRepository.findAll(pageable);
		long count = productRepository.count();

		if (productPage.isEmpty()) {
			messageDataResponse.setCode(1);
			messageDataResponse.setMessage("Product not found for the requested page and size.");
			messageDataResponse.setCount(count);
			return messageDataResponse;
		}

		messageDataResponse.setCode(0);
		messageDataResponse.setMessage("Products found");
		messageDataResponse.setData(productPage.getContent());
		messageDataResponse.setCount(count);
		return messageDataResponse;
	}

	// fn: update product
	@Override
	public MessageResponse updateProductById(ProductRequest productRequest) {
		MessageResponse messageResponse = new MessageResponse();

		Optional<Product> optionalProduct = productRepository.findById(productRequest.getId());
		if (!optionalProduct.isPresent()) {
			messageResponse.setCode(1);
			messageResponse.setMessage("Product not found");
			return messageResponse;
		}
		Product product = optionalProduct.get();
		product.setName(productRequest.getName());
		product.setPrice(productRequest.getPrice());
		product.setBrand(productRequest.getBrand());
		product.setStock(productRequest.getStock());
		product.setDiscount(product.getDiscount());
		productRepository.save(product);

		messageResponse.setCode(0);
		messageResponse.setMessage("Product updated successfully");
		return messageResponse;
	}
}
