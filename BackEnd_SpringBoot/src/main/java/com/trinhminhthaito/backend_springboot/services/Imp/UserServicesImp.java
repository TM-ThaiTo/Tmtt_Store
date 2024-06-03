package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.request.InfoUserRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.User;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.UserRepository;
import com.trinhminhthaito.backend_springboot.services.UserServices;
import org.springframework.stereotype.Service;

@Service
public class UserServicesImp implements UserServices {

	private final UserRepository userRepository;

	public UserServicesImp(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	// fn: update user
	@Override
	public MessageResponse updateUser(InfoUserRequest dto){
		MessageResponse response = new MessageResponse();
		User updateUser = userRepository.findByAccountId(dto.accountId());
		if(updateUser == null){
			response.setCode(1);
			response.setMessage("User Not Found");
			return response;
		}
		try{
			updateUser.setGender(dto.gender());
			updateUser.setFullName(dto.fullName());
			updateUser.setDateOfBirth(dto.birthday());
			updateUser.setAddress(dto.address());
			userRepository.save(updateUser);
			response.setCode(0);
			response.setMessage("Success");
		}
		catch(Exception e){
			response.setCode(-1);
			response.setMessage(e.toString());
		}
		return response;
	}
}
