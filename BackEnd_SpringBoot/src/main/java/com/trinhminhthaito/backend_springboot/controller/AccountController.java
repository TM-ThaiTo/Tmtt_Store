package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.request.ForgotPasswordRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SendMailRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SignUpRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import com.trinhminhthaito.backend_springboot.services.MailServices;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/account")
@CrossOrigin(origins = "*", maxAge = 3600)
@Validated
@Tag(name = "Account Controller")
public class AccountController {

	private final AccountServices accountServices;
	private final MailServices mailServices;

	@Autowired
	public AccountController(AccountServices accountServices,
			MailServices mailServices) {
		this.accountServices = accountServices;
		this.mailServices = mailServices;
	}

	// api: send mail
	// gọi khi yêu cầu OTP tạo account or forgot password
	@Operation(summary = "Send OTP to mail", description = "API create OTP")
	@Transactional
	@PostMapping("/sendmail")
	public ResponseEntity<?> sendMail(@RequestBody SendMailRequest sendMailRequest) {
		MessageResponse response = mailServices.sendMail(sendMailRequest);
		return ResponseEntity.ok(response);
	}

	// api: create account type local
	@Transactional
	@PostMapping("/signup")
	public ResponseEntity<?> newAccount(@RequestBody SignUpRequest dto) {
		MessageResponse response = accountServices.createAccount(dto);
		return ResponseEntity.ok(response);
	}

	// api: forgot password
	@Transactional
	@PostMapping("/forgot")
	public ResponseEntity<?> forGotPassword(@RequestBody ForgotPasswordRequest dto) {
		MessageResponse response = accountServices.forgotPassword(dto);
		return ResponseEntity.ok(response);
	}
}
