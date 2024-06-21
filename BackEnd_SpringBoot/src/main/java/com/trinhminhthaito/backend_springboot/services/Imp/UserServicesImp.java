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
import org.springframework.stereotype.Service;

import java.util.*;

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
	public MessageResponse updateUser(InfoUserRequest dto) {
		MessageResponse response = new MessageResponse();
		User updateUser = userRepository.findByAccountId(dto.accountId());
		if (updateUser == null) {
			response.setCode(1);
			response.setMessage("User Not Found");
			return response;
		}
		try {
			updateUser.setGender(dto.gender());
			updateUser.setFullName(dto.fullName());
			updateUser.setDateOfBirth(dto.birthday());
			updateUser.setAddress(dto.address());
			userRepository.save(updateUser);
			response.setCode(0);
			response.setMessage("Success");
		} catch (Exception e) {
			response.setCode(-1);
			response.setMessage(e.toString());
		}
		return response;
	}

	// fn: get 1 user
	@Override
	public MessageDataResponse getUser(String tokenB) {
		MessageDataResponse messageResponse = new MessageDataResponse();
		try {
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
		} catch (Exception e) {
			messageResponse.setCode(-1);
			messageResponse.setMessage(e.toString());
		}
		return messageResponse;
	}

	// fn: get all user
	@Override
	public MessageDataResponse getAllUser() {
		MessageDataResponse messageDataResponse = new MessageDataResponse();
		try {
			List<Account> listAccounts = accountRepository.findAll();

			if (listAccounts == null || listAccounts.isEmpty()) {
				messageDataResponse.setCode(1);
				messageDataResponse.setMessage("Account not found");
			} else {
				List<UserDto> lDtos = new ArrayList<>();
				for (Account item : listAccounts) {
					String role = item.getRoles().iterator().next();
					UserDto userDto = new UserDto();
					if ("USER".equals(role)) {
						User user = userRepository.findByAccountId(item.getId());
						if (user == null) {
							continue;
						}
						userDto.setId(item.getId());
						userDto.setEmail(item.getUsername());
						userDto.setFullName(user.getFullName());
						userDto.setBirthDay(user.getDateOfBirth());
						userDto.setGender(user.getGender());
						userDto.setAddress(user.getAddress());
						userDto.setAuthType(item.getAuthType());
						lDtos.add(userDto);
					}
				}
				messageDataResponse.setCode(0);
				messageDataResponse.setMessage("Success");
				messageDataResponse.setData(lDtos);
				messageDataResponse.setCount(lDtos.size());
			}
		} catch (Exception ex) {
			messageDataResponse.setCode(-1);
			messageDataResponse.setMessage("Server error: " + ex.getMessage());
		}
		return messageDataResponse;
	}

	@Override
	public MessageDataResponse getAllAdmin() {
		MessageDataResponse messageDataResponse = new MessageDataResponse();

		return messageDataResponse;
	}

}
