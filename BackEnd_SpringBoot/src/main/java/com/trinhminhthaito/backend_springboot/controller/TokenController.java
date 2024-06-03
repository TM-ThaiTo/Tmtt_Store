package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.request.LoginRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.LoginResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;

@RestController
@RequestMapping("/apis/account")
public class TokenController {
	private final JwtEncoder jwtEncoder;
	private final AccountRepository accountRepository;
	private final AccountServices accountServices;

	public TokenController(JwtEncoder jwtEncoder,
						   AccountRepository accountRepository,
						   AccountServices accountServices) {
		this.jwtEncoder = jwtEncoder;
		this.accountRepository = accountRepository;
		this.accountServices = accountServices;
	}

	@Transactional
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
		 var account = accountRepository.findByUsername(loginRequest.username());
		 if (account.isEmpty()) {
			 return ResponseEntity.badRequest().body(new MessageResponse(1, "Invalid username or password"));
		 } // check account

		 // check password
		 MessageResponse response = accountServices.passwordCheck(loginRequest);
		 if(response.getCode() != 0){
			 return ResponseEntity.badRequest().body(response);
		 }

		 var now = Instant.now();
		 var expiresIn = 300L;
		 var scopes = account.get().getRole().getName();
		 var claims = JwtClaimsSet.builder()
				 .issuer("tmttstore")
				 .subject(account.get().getUsername())
				 .issuedAt(now)
				 .expiresAt(now.plusSeconds(expiresIn))
				 .claim("scope", scopes)
				 .build();
		 var jwtValue = jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
		 return ResponseEntity.ok(new LoginResponse(jwtValue, expiresIn));
	}
}
