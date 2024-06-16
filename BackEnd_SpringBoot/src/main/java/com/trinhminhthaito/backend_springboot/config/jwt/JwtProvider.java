package com.trinhminhthaito.backend_springboot.config.jwt;

import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Optional;

@Service
public class JwtProvider {

	private final JwtEncoder jwtEncoder;
	private final JwtDecoder jwtDecoder;
	private final AccountServices accountServices;
	private final AccountRepository accountRepository;

	@Autowired
	public JwtProvider(JwtEncoder jwtEncoder,
					   JwtDecoder jwtDecoder,
					   AccountServices accountServices,
					   AccountRepository accountRepository) {
		this.jwtEncoder = jwtEncoder;
		this.jwtDecoder = jwtDecoder;
		this.accountServices = accountServices;
		this.accountRepository = accountRepository;
	}
	// fn: create new AccessToken
	public String createAccessToken(String role, String username) {
		Instant now = Instant.now();
		long expiresIn = 300L; // 5 minutes
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer("TMTTStore")
				.subject(username)
				.issuedAt(now)
				.expiresAt(now.plusSeconds(expiresIn))
				.claim("scope", role)
				.build();
		return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
	}

	// fn: create new RefreshToken
	public String createRefreshToken(String role, String username) {
		Instant now = Instant.now();
		long expiresIn = 604800L; // 1 week
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer("TMTTStore")
				.subject(username)
				.issuedAt(now)
				.expiresAt(now.plusSeconds(expiresIn))
				.claim("scope", role)
				.build();
		return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
	}

	// fn: check valid accessToken
	// check access token da het hang hay chua
	// roi -> false
	// chua -> true
	public Boolean validateToken(String token) {
		try {
			Jwt jwt = jwtDecoder.decode(token);
			if (jwt == null || jwt.getExpiresAt() == null) { return false; }
			return !jwt.getExpiresAt().isBefore(Instant.now());
		} catch (JwtException e) {
			return false;
		}
	}

	// fn: get user name trong token
	public String getUsernameFromToken(String token) {
		Jwt jwt = jwtDecoder.decode(token);
		return jwt.getSubject();
	}

	// fn: tạo lại access token
	public String createTokenToRefresh(String token) {
		Jwt jwt = jwtDecoder.decode(token);
		String role = (String) jwt.getClaims().get("scope");
		String username = (String) jwt.getClaims().get("sub");
		return createAccessToken(role, username);
	}

	// Phương thức để trích xuất token từ header Authorization
	public String extractTokenFromHeader(String authorizationHeader) {
		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			return authorizationHeader.substring(7); // Trả về chuỗi token sau khi loại bỏ "Bearer "
		}
		return null;
	}

	// fn: kiểm tra refresh token có còn hạn
	public Boolean validateTokenToRefresh(String userName) {
		Optional<Account> optionalAccount = accountRepository.findByUsername(userName);
		if (optionalAccount.isEmpty()) {
			return false;
		}

		Account account = optionalAccount.get();
		String token = account.getRefreshToken();

		if (token == null || token.isEmpty()) {
			return false;
		}

		if (!validateToken(token)) {
			return false;
		}

		try {
			Jwt jwt = jwtDecoder.decode(token);
			return jwt.getExpiresAt().isAfter(Instant.now());
		} catch (JwtException e) {
			return false;
		}
	}
}
