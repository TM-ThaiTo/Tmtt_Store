package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.AddProductRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.ProductRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.productModels.Product;
import com.trinhminhthaito.backend_springboot.repository.ProductRepository;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import com.trinhminhthaito.backend_springboot.services.OrderServices;
import com.trinhminhthaito.backend_springboot.services.ProductServices;
import com.trinhminhthaito.backend_springboot.services.StatisticServices;
import com.trinhminhthaito.backend_springboot.services.UserServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {
	private final AccountServices accountServices;
	private final ProductRepository productRepository;
	private final ProductServices productServices;
	private final UserServices userServices;
	private final OrderServices orderServices;
	private final StatisticServices statisticServices;

	@Autowired
	public AdminController(AccountServices accountServices,
			ProductRepository productRepository,
			ProductServices productServices,
			UserServices userServices,
			OrderServices orderServices,
			StatisticServices statisticServices) {
		this.productRepository = productRepository;
		this.accountServices = accountServices;
		this.productServices = productServices;
		this.userServices = userServices;
		this.orderServices = orderServices;
		this.statisticServices = statisticServices;
	}

	// #region Product
	// api: add new product
	@Transactional
	@PostMapping("/product/add")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> add(@RequestBody AddProductRequest product) {
		MessageResponse res = productServices.addProduct(product);
		return ResponseEntity.ok(res);
	}

	// api: get all product cho page admin
	@Transactional
	@GetMapping("/product/all")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getAllProducts() {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		List<Product> products = productRepository.findAll();
		int count = products.size();
		messageDataResponse.setCode(0);
		messageDataResponse.setMessage("Success");
		messageDataResponse.setData(products);
		messageDataResponse.setCount(count);
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: delete one product + detail + desc
	@Transactional
	@DeleteMapping("/product/delete")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> deleteProduct(@RequestParam String id) {
		MessageResponse newMessage = productServices.deleteProductById(id);
		return ResponseEntity.ok(newMessage);
	}

	// api: update product
	@Transactional
	@PutMapping("/product/update")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> updateProduct(@RequestBody ProductRequest product) {
		MessageResponse messageResponse = productServices.updateProductById(product);
		if (messageResponse.getCode() != 0) {
			return ResponseEntity.badRequest().body(messageResponse);
		}
		return ResponseEntity.ok(messageResponse);
	}

	// api: Get search product
	@GetMapping("/product/search")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getSearchProduct(@RequestParam String nameP, @RequestParam String codeP,
			@RequestParam Number typeP) {
		MessageDataResponse messageDataResponse = productServices.getSearchProduct(nameP, codeP, typeP);
		return ResponseEntity.ok(messageDataResponse);
	}
	// #endregion

	// #region User
	// api: get all user
	@Transactional
	@GetMapping("/user/all")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getAllUsers() {
		MessageDataResponse messageDataResponse = userServices.getAllUser();
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: get user admin
	@GetMapping("/user/admin")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getAllAdmin() {
		MessageDataResponse messageDataResponse = userServices.getAllAdmin();
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: delete account
	@Transactional
	@DeleteMapping("/user/delete")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> deleteUser(@RequestParam String id) {
		MessageResponse messageResponse = accountServices.deleteAccountById(id);
		if (messageResponse.getCode() != 0) {
			return ResponseEntity.badRequest().body(messageResponse);
		}
		return ResponseEntity.ok(messageResponse);
	}
	// #endregion

	// #region Order
	// api: get all order
	@GetMapping("/order/all")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getALLOrder() {
		MessageDataResponse messageDataResponse = orderServices.getAllOrder();
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: search order
	@GetMapping("/order/search")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getSearchOrder(@RequestParam String codeOrder, @RequestParam String paymentOrder,
			@RequestParam Number status) {
		MessageDataResponse messageDataResponse = orderServices.getSearchOrder(codeOrder, paymentOrder, status);
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: update status order
	@PutMapping("/order/update")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> putUpdateOrder(@RequestParam String idOrder, @RequestParam Number status) {
		MessageResponse messageResponse = orderServices.putUpdateStatus(idOrder, status);
		return ResponseEntity.ok(messageResponse);
	}

	// api: delete order
	@DeleteMapping("/order/delete")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> deleteOrder(@RequestParam String id) {
		MessageResponse messageResponse = orderServices.deleteOrder(id);
		return ResponseEntity.ok(messageResponse);
	}
	// #endregion

	// #region Card và thống kê doanh thu
	// api: lấy danh sách card
	@GetMapping("/statistic/card")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getStatisticCard() {
		MessageDataResponse messageDataResponse = statisticServices.getCard();
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: lấy doanh thu theo năm và năm trước đó
	@GetMapping("/statistic/monthly")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getStatisticMonthy(@RequestParam Number year) {
		MessageDataResponse messageDataResponse = statisticServices.getMonthRevenue(year);
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: lấy danh thu từ năm bắt đầu tới năm kết thúc
	@GetMapping("/statistic/annual")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getStatisticAnnual(@RequestParam Number startYear, @RequestParam Number endYear) {
		MessageDataResponse messageDataResponse = statisticServices.getStatisticAnnual(startYear, endYear);
		return ResponseEntity.ok(messageDataResponse);
	}
	// #endregion
}