package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.request.ForgotPasswordRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.LoginRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SignUpRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;

import java.util.List;

public interface AccountServices {
	MessageResponse createAccount(SignUpRequest dto);
	MessageResponse forgotPassword(ForgotPasswordRequest dto);
	Account findAccountByUserName(String email);
	List<Account> findAllAccounts();
	MessageResponse passwordCheck(LoginRequest dto);
}
