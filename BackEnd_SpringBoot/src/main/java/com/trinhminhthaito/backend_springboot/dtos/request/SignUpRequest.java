package com.trinhminhthaito.backend_springboot.dtos.request;

public record SignUpRequest(
		String username,
		String password,
		String verifyCode,
		String fullName,
		String birthday,
		int gender,
		String address) {
}
