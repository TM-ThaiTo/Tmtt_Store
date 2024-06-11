package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.AddProductRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.productRequest.ProductRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.repository.ProductRepository;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import com.trinhminhthaito.backend_springboot.services.ProductServices;
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
	private final AccountRepository accountRepository;
	private final AccountServices accountServices;
	private final ProductRepository productRepository;
	private final ProductServices productServices;

	@Autowired
	public AdminController(AccountRepository accountRepository,
						   AccountServices accountServices,
						   ProductRepository productRepository,
						   ProductServices productServices) {
		this.productRepository = productRepository;
		this.accountServices = accountServices;
		this.accountRepository = accountRepository;
		this.productServices = productServices;
	}

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
		return ResponseEntity.ok(productRepository.findAll());
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
		if(messageResponse.getCode() != 0){
			return ResponseEntity.badRequest().body(messageResponse);
		}
		return ResponseEntity.ok(messageResponse);
	}

	// api: get all user
	@Transactional
	@GetMapping("/user/all")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> getAllUsers() {
		MessageResponse messageResponse = new MessageResponse();
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		List<Account> accounts = accountRepository.findAllByUsernameNotContainingPassword();

		if(accounts == null){
			messageResponse.setCode(1);
			messageDataResponse.setMessage("Account not found");
			return ResponseEntity.ok(messageResponse);
		}

		messageDataResponse.setCode(0);
		messageDataResponse.setMessage("Success");
		messageDataResponse.setData(accounts);
		return ResponseEntity.ok(messageDataResponse);
	}

	// api: delete account
	@Transactional
	@DeleteMapping("/user/delete")
	@PreAuthorize("hasAuthority('SCOPE_ADMIN')")
	public ResponseEntity<?> deleteUser(@RequestParam String id) {
		MessageResponse messageResponse = accountServices.deleteAccountById(id);
		if(messageResponse.getCode() != 0){
			return ResponseEntity.badRequest().body(messageResponse);
		}
		return ResponseEntity.ok(messageResponse);
	}
}