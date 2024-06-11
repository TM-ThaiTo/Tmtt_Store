package com.trinhminhthaito.backend_springboot.dtos.request;

import java.util.Date;

public record SignUpRequest(
		String username,
		String password,
		String verifyCode,
		String fullName,
		Date birthDate,
		int gender,
		String address
) {
}
