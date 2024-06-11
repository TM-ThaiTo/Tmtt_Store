package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.config.jwt.JwtProvider;
import com.trinhminhthaito.backend_springboot.dtos.request.LoginRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.RefreshToken;
import com.trinhminhthaito.backend_springboot.dtos.response.LoginResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/account")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TokenController {
	private final JwtProvider jwtProvider;
	private final AccountServices accountServices;
	private final AccountRepository accountRepository;

	public TokenController(JwtProvider jwtProvider,
						   AccountRepository accountRepository,
						   AccountServices accountServices) {
		this.jwtProvider = jwtProvider;
		this.accountRepository = accountRepository;
		this.accountServices = accountServices;
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
		 if(response.getCode() != 0){
			 return ResponseEntity.badRequest().body(response);
		 }

		 String role = account.get().getRoles().iterator().next();
		 String username = account.get().getUsername();
	    String jwt_AccessToken = jwtProvider.createAccessToken(role, username); // tạo AccessToken
		String jwt_RefreshToken = jwtProvider.createRefreshToken(role, username); // tạo RefreshToken

		account1.setRefreshToken(jwt_RefreshToken);
		accountRepository.save(account1);

		return ResponseEntity.ok(new LoginResponse(0, "success", jwt_AccessToken));
	}

	// api: refresh token
	@Transactional
	@PostMapping("/refresh")
	public ResponseEntity<?> refreshToke(@RequestBody RefreshToken token) {
		String accessToken = token.accessToken();
		String refreshToken = token.refreshToken();

		if(accessToken == null || refreshToken == null) {
			return ResponseEntity.badRequest().body(new MessageResponse(1, "Invalid access token"));
		} // kiểm tra null

		// code = 1, yeu cau dang nhap lai
		if(!jwtProvider.validateRefreshToken(refreshToken)) {
			return ResponseEntity.ok(new MessageResponse(1, "Expired refresh token"));
		}

		if(!jwtProvider.validateAccessToken(accessToken) && !jwtProvider.validateRefreshToken(refreshToken)) {
			return ResponseEntity.ok(new MessageResponse(1, "Expired refresh token"));
		}

		if(!jwtProvider.validateAccessToken(accessToken)) {
			if(!jwtProvider.existRefreshToken(refreshToken)) {
				return ResponseEntity.ok(new MessageResponse(1, "Khong ton tai refresh token"));
			}
		}

		String access = jwtProvider.createTokenToRefresh(token.refreshToken());
		return ResponseEntity.ok(new LoginResponse(0, "success", access));
	}
}