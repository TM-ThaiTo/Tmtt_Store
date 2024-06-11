package com.trinhminhthaito.backend_springboot.config.jwt;

import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class JwtProvider {

	private final JwtEncoder jwtEncoder;
	private final JwtDecoder jwtDecoder;
	private final AccountServices accountServices;

	@Autowired
	public JwtProvider(JwtEncoder jwtEncoder, JwtDecoder jwtDecoder,
					   AccountServices accountServices) {
		this.jwtEncoder = jwtEncoder;
		this.jwtDecoder = jwtDecoder;
		this.accountServices = accountServices;
	}

	// fn: createAccessToken
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

	// fn: createRefreshToken
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
	public Boolean validateAccessToken(String token) {
		try {
			Jwt jwt = jwtDecoder.decode(token);
			if (jwt.getExpiresAt().isBefore(Instant.now())) {
				return false;
			}
			return true;
		} catch (JwtException e) {
			return false;
		}
	}

	// fn: check refresh token trong database
	private Boolean checkRefreshToken(String token, String username) {
		Account account = accountServices.findAccountByUserName(username);
		if (account == null || account.getRefreshToken() == null || !account.getRefreshToken().equals(token)) {
			return false;
		}
		return true;
	}

	// fn: check ton tai refresh token
	public Boolean existRefreshToken(String token) {
		Jwt jwt = jwtDecoder.decode(token);
		String username = (String) jwt.getClaims().get("sub");
		if(!checkRefreshToken(token, username)){
			return false;
		}
		return true;
	}

	// fn: kiem tra het hang của refresh token
	public Boolean validateRefreshToken(String token) {
		try {
			Jwt jwt = jwtDecoder.decode(token);
			if (jwt.getExpiresAt().isBefore(Instant.now())) {
				return false;
			}
			return true;
		} catch (JwtException e) {
			return false;
		}
	}

	// fn: tạo access token
	public String createTokenToRefresh(String token) {
		Jwt jwt = jwtDecoder.decode(token);
		String role = (String) jwt.getClaims().get("scope");
		String userame = (String) jwt.getClaims().get("sub");
		return createAccessToken(role, userame);
	}
}
