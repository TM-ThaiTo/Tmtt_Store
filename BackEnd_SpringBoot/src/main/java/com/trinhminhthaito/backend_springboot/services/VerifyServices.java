package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;

public interface VerifyServices {
	String createVerify(String mail);
	Boolean checkVerifyToEmail(String mail, String otp);
	void deleteVerify(String mail);
	Boolean checkVerifyExist(String mail);
}
