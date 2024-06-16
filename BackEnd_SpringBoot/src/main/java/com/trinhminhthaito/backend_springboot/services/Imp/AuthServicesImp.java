package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.config.jwt.JwtProvider;
import com.trinhminhthaito.backend_springboot.dtos.request.LoginRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.AuthResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.LoginResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.UserRepository;
import com.trinhminhthaito.backend_springboot.services.AuthServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthServicesImp implements AuthServices {
	private final AccountRepository accountRepository;
	private final JwtProvider jwtProvider;

	@Autowired
	public AuthServicesImp(AccountRepository accountRepository,
						   JwtProvider jwtProvider) {
		this.accountRepository = accountRepository;
		this.jwtProvider = jwtProvider;
	}

	@Override
	public AuthResponse checkAuth(String tokenB) {
		AuthResponse messageResponse = new AuthResponse();
		String token =  jwtProvider.extractTokenFromHeader(tokenB);
		String username = jwtProvider.getUsernameFromToken(token);
		try {
			if(!jwtProvider.validateTokenToRefresh(username)){
				messageResponse.setCode(2);
				messageResponse.setIsAuth(false);
				return messageResponse;
			}

			if (!jwtProvider.validateToken(token)) {
				messageResponse.setCode(10);
				messageResponse.setIsAuth(false);
			} else {
				Optional<Account> account = accountRepository.findByUsername(username);
				if (account.isPresent()) {
					messageResponse.setCode(0);
					messageResponse.setIsAuth(true);
				} else {
					messageResponse.setCode(2);
					messageResponse.setIsAuth(false);
				}
			}
		} catch (Exception e) {
			messageResponse.setCode(-1);
			messageResponse.setIsAuth(false);
		}
		return messageResponse;
	}

	@Override
	public LoginResponse refresh_token(String tokenB){
		LoginResponse refreshToken = new LoginResponse();
		String token =  jwtProvider.extractTokenFromHeader(tokenB);
		String username = jwtProvider.getUsernameFromToken(token);
		try{
			if(!jwtProvider.validateTokenToRefresh(username)){
				refreshToken.setCode(2);
				refreshToken.setMessage("Refresh token expired");
				return refreshToken;
			}
			String token1 = jwtProvider.createTokenToRefresh(token);
			refreshToken.setCode(0);
			refreshToken.setMessage("success");
			refreshToken.setAccessToken(token1);
		}
		catch (Exception e){
			refreshToken.setCode(-1);
			refreshToken.setMessage("Lỗi " + e.getMessage());
		}
		return  refreshToken;
	}

	@Override
	public MessageResponse logout(String token) {
		MessageResponse messageResponse = new MessageResponse();
		String username = jwtProvider.getUsernameFromToken(token);
		Optional<Account> optionalAccount = accountRepository.findByUsername(username);
		if (optionalAccount.isEmpty()) {
			messageResponse.setCode(2);
			messageResponse.setMessage("Logout failed");
			return messageResponse;
		}
		Account account = optionalAccount.get();
		account.setRefreshToken("");
		try {
			accountRepository.save(account);
			messageResponse.setCode(0);
			messageResponse.setMessage("Logout successful");
		} catch (Exception e) {
			messageResponse.setCode(2);
			messageResponse.setMessage("Logout failed: " + e.getMessage());
		}
		return messageResponse;
	}
}
