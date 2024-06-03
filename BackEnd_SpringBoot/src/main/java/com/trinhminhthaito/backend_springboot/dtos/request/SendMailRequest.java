package com.trinhminhthaito.backend_springboot.dtos.request;

public record SendMailRequest(String mail, int title) {
	// mail: có hoặc không
	// title:
	// 1: signup
	// 2: forgot pass
}
