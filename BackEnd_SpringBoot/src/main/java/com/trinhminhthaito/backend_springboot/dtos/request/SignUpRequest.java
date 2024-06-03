package com.trinhminhthaito.backend_springboot.dtos.request;

import java.time.LocalDateTime;

public record SignUpRequest(
		String username,
		String password,
		String verifyCode,
		String fullName,
		LocalDateTime birthDate,
		int gender,
		String address
) {
}
