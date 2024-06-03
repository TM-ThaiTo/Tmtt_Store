package com.trinhminhthaito.backend_springboot.controller;

import com.trinhminhthaito.backend_springboot.dtos.request.ForgotPasswordRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SendMailRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SignUpRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import com.trinhminhthaito.backend_springboot.services.MailServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/apis/account")
public class AccountController {

	private final AccountServices accountServices;
	private final MailServices mailServices;

	@Autowired
	public AccountController(AccountServices accountServices , MailServices mailServices) {
		this.accountServices = accountServices;
		this.mailServices = mailServices;
	}

	// api: send mail
	// gọi khi yêu cầu OTP tạo account or forgot password
	@Transactional
	@PostMapping("/sendmail")
	public ResponseEntity<MessageResponse> sendMail(@RequestBody SendMailRequest sendMailRequest){
		MessageResponse response =  mailServices.sendMail(sendMailRequest);
		return ResponseEntity.ok(response);
	}

	// api: create account type local
	@Transactional
	@PostMapping("/signup")
	public ResponseEntity<MessageResponse> newAccount(@RequestBody SignUpRequest dto) {
		MessageResponse response = accountServices.createAccount(dto);
		return ResponseEntity.ok(response);
	}

	// api: forgot password
	@Transactional
	@PostMapping("/forgot")
	public ResponseEntity<MessageResponse> forGotPassword(@RequestBody ForgotPasswordRequest dto) {
		MessageResponse response = accountServices.forgotPassword(dto);
		return ResponseEntity.ok(response);
	}
}
