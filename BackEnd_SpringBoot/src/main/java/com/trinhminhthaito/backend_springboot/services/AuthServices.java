package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.response.AuthResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.LoginResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;

public interface AuthServices {
	AuthResponse checkAuth(String token);
	LoginResponse refresh_token(String token);
	MessageResponse logout(String token);
}
