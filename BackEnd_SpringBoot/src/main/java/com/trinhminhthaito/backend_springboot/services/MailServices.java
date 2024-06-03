package com.trinhminhthaito.backend_springboot.services;


import com.trinhminhthaito.backend_springboot.dtos.request.SendMailRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;

public interface MailServices {
	MessageResponse sendMail(SendMailRequest sendMailRequest);
}
