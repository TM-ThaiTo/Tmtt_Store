package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.config.jwt.JwtProvider;
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
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.models.orderModels.ItemsOrder;
import com.trinhminhthaito.backend_springboot.models.orderModels.Order;
import com.trinhminhthaito.backend_springboot.repository.OrderRepository;
import com.trinhminhthaito.backend_springboot.repository.ProductRepository;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.services.CloudinaryServices;
import com.trinhminhthaito.backend_springboot.services.ProductServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.Collections;
import java.util.stream.Collectors;

@Service
public class ProductServicesImp implements ProductServices {

	private final DetailProductHelper detailProductHelper;
	private final ProductRepository productRepository;
	private final CloudinaryServices cloudinaryServices;
	private final AccountRepository accountRepository;
	private final OrderRepository orderRepository;
	private final JwtProvider jwtProvider;
	private final ChangeValueToType changeValueToType;

	@Autowired
	private ProductServicesImp(DetailProductHelper detailProductHelper,
			CloudinaryServices cloudinaryServices,
			ProductRepository productRepository,
			JwtProvider jwtProvider,
			AccountRepository accountRepository,
			OrderRepository orderRepository,
			ChangeValueToType changeValueToType) {
		this.detailProductHelper = detailProductHelper;
		this.cloudinaryServices = cloudinaryServices;
		this.productRepository = productRepository;
		this.jwtProvider = jwtProvider;
		this.accountRepository = accountRepository;
		this.orderRepository = orderRepository;
		this.changeValueToType = changeValueToType;
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
	private void addDesc(DescRequest descRequest, Product product, String codeProduct) {
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

	// fn: search product
	@Override
	public MessageDataResponse getSearchProduct(String nameP, String codeP, Number typeP) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			// Fetch all products initially
			List<Product> products = productRepository.findAll();

			// Filter by code if codeP is not null and not empty
			if (codeP != null && !codeP.isEmpty()) {
				products = products.stream()
						.filter(p -> p.getCode().toLowerCase().contains(codeP.toLowerCase()))
						.collect(Collectors.toList());
			}

			// // Filter by type if typeP is not null
			if (typeP != null) {
				int typeValue = typeP.intValue();
				products = products.stream()
						.filter(p -> p.getType() == typeValue)
						.collect(Collectors.toList());
			}

			// Set the response data
			messageDataResponse.setCode(0);
			messageDataResponse.setMessage("Success");
			messageDataResponse.setData(products);
			messageDataResponse.setCount(products.size());
		} catch (Exception ex) {
			messageDataResponse.setCode(-1);
			messageDataResponse.setMessage("Lỗi server: " + ex.getMessage());
		}
		return messageDataResponse;
	}

	// fn: get product giảm giá
	@Override
	public MessageDataResponse getOutstanding() {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			// Lấy 8 sản phẩm có rate cao nhất
			List<Product> topRatedProducts = productRepository.findTop8ByOrderByRatesDesc(PageRequest.of(0, 8))
					.getContent();
			// Lấy 8 sản phẩm có discount cao nhất
			List<Product> topDiscountedProducts = productRepository.findTop8ByOrderByDiscountDesc(PageRequest.of(0, 8))
					.getContent();

			List<Product> combinedList = new ArrayList<>();
			combinedList.addAll(topRatedProducts);
			combinedList.addAll(topDiscountedProducts);

			// Trộn ngẫu nhiên danh sách sản phẩm
			Collections.shuffle(combinedList);

			if (combinedList.isEmpty()) {
				messageDataResponse.setCode(1);
				messageDataResponse.setMessage("Không có sản phẩm nổi bật");
			} else {
				messageDataResponse.setCode(0);
				messageDataResponse.setMessage("Success");
				messageDataResponse.setData(combinedList);
				messageDataResponse.setCount(combinedList.size());
			}
		} catch (Exception ex) {
			messageDataResponse.setCode(-1);
			messageDataResponse.setMessage("Lỗi server " + ex.getMessage());
		}
		return messageDataResponse;
	}

	// fn: getReOrder
	@Override
	public MessageDataResponse getReOrder(String tokenR) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			String token = jwtProvider.extractTokenFromHeader(tokenR);
			String userName = jwtProvider.getUsernameFromToken(token);
			Optional<Account> accountOptional = accountRepository.findByUsername(userName);
			if (accountOptional == null) {
				messageDataResponse.setCode(1);
				messageDataResponse.setMessage("User Not Found");
			} else {
				Account account = accountOptional.get();
				List<Order> listOrders = orderRepository.findByCustomerOrderCustomerId(account.getId());

				if (listOrders == null) {
					messageDataResponse.setCode(2);
					messageDataResponse.setMessage("User have not order");
					return messageDataResponse;
				}

				List<ItemsOrder> lItemsOrders = new ArrayList<>();
				for (Order items : listOrders) {
					for (ItemsOrder item : items.getItemsOrders()) {
						lItemsOrders.add(item);
					}
				}

				// Extract unique idProduct values
				Set<String> uniqueProductIds = lItemsOrders.stream()
						.map(ItemsOrder::getProductId)
						.collect(Collectors.toSet());

				// Convert Set to List if needed
				List<String> idProductList = new ArrayList<>(uniqueProductIds);

				List<Product> products = productRepository.findAllById(idProductList);

				messageDataResponse.setCode(0);
				messageDataResponse.setMessage("Success");
				messageDataResponse.setData(products);
			}
		} catch (Exception exception) {
			messageDataResponse.setCode(-1);
			messageDataResponse.setMessage("Lỗi server: " + exception.getMessage());
		}
		return messageDataResponse;
	}

	// fn: filter product
	@Override
	public MessageDataResponse getFilterProductServices(int type, int page, int perPage) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			List<Product> products = productRepository.findByType(type);

			messageDataResponse.setCode(0);
			messageDataResponse.setMessage("suscces");
			messageDataResponse.setData(products);
			messageDataResponse.setCount(products.size());
		} catch (Exception ex) {
			messageDataResponse.setCode(-1);
			messageDataResponse.setMessage("Lỗi server: " + ex.getMessage());
		}
		return messageDataResponse;
	}

	// fn: search product page user
	public MessageDataResponse getSearchProductPageUser(String value, Number page, Number perPage) {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			// Gọi hàm getProductType từ ChangeValueToType để lấy loại sản phẩm
			Number productType = changeValueToType.productTypeMap(value.toLowerCase());

			if (productType.intValue() == -1) {
				messageDataResponse.setCode(1);
				messageDataResponse.setMessage("Không tìm thấy loại sản phẩm phù hợp");
			} else {
				// Thực hiện logic tìm kiếm sản phẩm dựa trên productType
				List<Product> products = productRepository.findByType(productType,
						PageRequest.of(page.intValue() - 1, perPage.intValue()));

				if (products.isEmpty()) {
					messageDataResponse.setCode(2);
					messageDataResponse.setMessage("Không tìm thấy sản phẩm");
				} else {
					messageDataResponse.setCode(0);
					messageDataResponse.setMessage("Thành công");
					messageDataResponse.setData(products);
					messageDataResponse.setCount(products.size());
				}
				// messageDataResponse.setData(productType);
			}
		} catch (Exception exception) {
			messageDataResponse.setCode(-1);
			messageDataResponse.setMessage("Lỗi server: " + exception.getMessage());
		}
		return messageDataResponse;
	}
}
