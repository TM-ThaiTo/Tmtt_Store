package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.config.jwt.JwtProvider;
import com.trinhminhthaito.backend_springboot.dtos.request.InfoUserRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageDataResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.dtos.response.UserDto;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.models.accountModels.User;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.UserRepository;
import com.trinhminhthaito.backend_springboot.services.UserServices;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServicesImp implements UserServices {

	private final UserRepository userRepository;
	private final JwtProvider jwtProvider;
	private final AccountRepository accountRepository;

	public UserServicesImp(UserRepository userRepository,
						   JwtProvider jwtProvider,
						   AccountRepository accountRepository) {
		this.userRepository = userRepository;
		this.jwtProvider = jwtProvider;
		this.accountRepository = accountRepository;
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

	// fn: get user
	@Override
	public MessageDataResponse getUser(String tokenB){
		MessageDataResponse messageResponse = new MessageDataResponse();
		try{
			String token = jwtProvider.extractTokenFromHeader(tokenB);
			String username = jwtProvider.getUsernameFromToken(token);
			Optional<Account> optionalAccount = accountRepository.findByUsername(username);
			if (optionalAccount.isEmpty()) {
				messageResponse.setCode(2);
				messageResponse.setMessage("Account Not Found");
				return messageResponse;
			}

			Account account = optionalAccount.get();
			User infoUser = userRepository.findByAccountId(account.getId());
			if (infoUser == null) {
				messageResponse.setCode(3);
				messageResponse.setMessage("User Not Found");
				return messageResponse;
			}
			// gán giá trị
			UserDto userDto = new UserDto();
			userDto.setId(account.getId());
			userDto.setEmail(account.getUsername());
			userDto.setFullName(infoUser.getFullName());
			userDto.setGender(infoUser.getGender());
			userDto.setBirthDay(infoUser.getDateOfBirth());
			userDto.setAddress(infoUser.getAddress());

			// return
			messageResponse.setCode(0);
			messageResponse.setMessage("Success");
			messageResponse.setData(userDto);
		}
		catch(Exception e){
			messageResponse.setCode(-1);
			messageResponse.setMessage(e.toString());
		}
		return messageResponse;
	}
}
