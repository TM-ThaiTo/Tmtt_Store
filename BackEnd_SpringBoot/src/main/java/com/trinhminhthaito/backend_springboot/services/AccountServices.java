package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.request.ForgotPasswordRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.LoginRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SignUpRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;

public interface AccountServices {
	MessageResponse deleteAccountById(String id);

	MessageResponse createAccount(SignUpRequest dto);

	MessageResponse forgotPassword(ForgotPasswordRequest dto);

	Account findAccountByUserName(String email);

	MessageResponse passwordCheck(LoginRequest dto);
}
