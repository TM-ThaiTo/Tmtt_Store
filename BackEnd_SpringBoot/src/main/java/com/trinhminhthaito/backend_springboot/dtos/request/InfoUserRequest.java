package com.trinhminhthaito.backend_springboot.dtos.request;

import java.util.Date;

public record InfoUserRequest(
		String accountId,
		String fullName,
		Date birthday,
		int gender,
		String address) {
}
