package com.trinhminhthaito.backend_springboot.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class LoginResponse {
	private int code;
	private String message;
	private String accessToken;
	private String refreshToken;
}
