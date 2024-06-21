package com.trinhminhthaito.backend_springboot.services;

import com.trinhminhthaito.backend_springboot.dtos.request.InfoUserRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;

public interface UserServices {
	MessageResponse updateUser(InfoUserRequest dto);

	MessageDataResponse getUser(String token);

	MessageDataResponse getAllUser();
}