package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.config.jwt.JwtProvider;
import com.trinhminhthaito.backend_springboot.dtos.request.LoginRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.AuthResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.LoginResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import com.trinhminhthaito.backend_springboot.services.AuthServices;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/account")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TokenController {
	private final JwtProvider jwtProvider;
	private final AccountServices accountServices;
	private final AccountRepository accountRepository;
	private final AuthServices authServices;

	@Autowired
	public TokenController(JwtProvider jwtProvider,
			AccountRepository accountRepository,
			AccountServices accountServices,
			AuthServices authServices) {
		this.jwtProvider = jwtProvider;
		this.accountRepository = accountRepository;
		this.accountServices = accountServices;
		this.authServices = authServices;
	}

	// api: login
	@Transactional
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		var account = accountRepository.findByUsername(loginRequest.email());
		if (account.isEmpty()) {
			return ResponseEntity.badRequest().body(new MessageResponse(1, "Invalid username or password"));
		} // check account

		Account account1 = accountServices.findAccountByUserName(loginRequest.email());
		// check password
		MessageResponse response = accountServices.passwordCheck(loginRequest);
		if (response.getCode() != 0) {
			return ResponseEntity.badRequest().body(response);
		}

		String role = account.get().getRoles().iterator().next();
		String username = account.get().getUsername();
		String jwt_AccessToken = jwtProvider.createAccessToken(role, username); // tạo AccessToken
		String jwt_RefreshToken = jwtProvider.createRefreshToken(role, username); // tạo RefreshToken

		account1.setRefreshToken(jwt_RefreshToken);
		accountRepository.save(account1);

		return ResponseEntity.ok(new LoginResponse(0, "success", jwt_AccessToken, jwt_RefreshToken));
	}

	// api: auth user
	@Transactional
	@GetMapping("/auth")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> auth(@RequestHeader("Authorization") String token) {
		AuthResponse messageResponse = authServices.checkAuth(token);
		return ResponseEntity.ok(messageResponse);
	}

	// api: refresh_token
	@Transactional
	@GetMapping("/refresh_token")
	@PreAuthorize("hasAuthority('SCOPE_USER')")
	public ResponseEntity<?> refresh_token(@RequestHeader("Authorization") String token) {
		LoginResponse messageResponse = authServices.refresh_token(token);
		return ResponseEntity.ok(messageResponse);
	}

	// api: logout
	@Transactional
	@PostMapping("/logout")
	public ResponseEntity<?> logout(@RequestBody String token) {
		MessageResponse messageResponse = authServices.logout(token);
		return ResponseEntity.ok(messageResponse);
	}
}