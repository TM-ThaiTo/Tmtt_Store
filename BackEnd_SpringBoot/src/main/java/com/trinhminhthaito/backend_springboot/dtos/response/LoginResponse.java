package com.trinhminhthaito.backend_springboot.dtos.response;

public record LoginResponse(
		int code,
		String message,
		String accessToken
) {
}
