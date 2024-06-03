package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.request.ForgotPasswordRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.LoginRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SendMailRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SignUpRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.models.accountModels.Role;
import com.trinhminhthaito.backend_springboot.models.accountModels.User;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.RoleRepository;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.UserRepository;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import com.trinhminhthaito.backend_springboot.services.MailServices;
import com.trinhminhthaito.backend_springboot.services.VerifyServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AccountServicesImp implements AccountServices {

	private final AccountRepository accountRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final UserRepository userRepository;
	private final RoleRepository roleRepository;
	private final VerifyServices verifyServices;
	private final MailServices mailServices;

	@Autowired
	private AccountServicesImp(AccountRepository accountRepository,
							   BCryptPasswordEncoder bCryptPasswordEncoder,
							   UserRepository userRepository,
							   RoleRepository roleRepository,
							   VerifyServices verifyServices,
							   MailServices mailServices) {
		this.accountRepository = accountRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
		this.userRepository = userRepository;
		this.roleRepository = roleRepository;
		this.verifyServices = verifyServices;
		this.mailServices = mailServices;
	}

	// fn: add account to database
	private void addAccount(SignUpRequest dto, Role userRole){
		var newAccount = new Account();
		newAccount.setUsername(dto.username());
		newAccount.setPassword(bCryptPasswordEncoder.encode(dto.password()));
		newAccount.setRole(userRole);
		newAccount.setGoogleId(null);
		newAccount.setAuthType("LOCAL");
		newAccount.setFailedLoginTimes(0);
		newAccount.setRefreshToken(null);
		accountRepository.save(newAccount);
		addUser(dto, newAccount.getId());
	}

	// fn: add user to database
	private void addUser(SignUpRequest dto, String accountId){
		var user = new User();
		user.setAccountId(accountId);
		user.setFullName(dto.fullName());
		user.setGender(dto.gender());
		user.setAddress(dto.address());
		userRepository.save(user);
	}

	// fn: check otp
	private Boolean checkOTP(String email, String otp) {
		return verifyServices.checkVerifyToEmail(email, otp);
	}

	// fn: create account
	@Override
	public MessageResponse createAccount(SignUpRequest dto) {
		MessageResponse response = new MessageResponse();

		// check role
		var userRole = roleRepository.findByName(Role.Vales.USER.name())
				.orElseThrow(() -> new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "User role not found"));

		if(!checkOTP(dto.username(), dto.verifyCode())){
			response.setCode(1);
			response.setMessage("OTP không đúng hoặc quá hạn");
			return response;
		}

		// check account
		var userFromDb = findAccountByUserName(dto.username());

		if (userFromDb != null) {
			response.setCode(2);
			response.setMessage("Account đã tồn tại");
			return response;
		}
		addAccount(dto, userRole);
		response.setCode(0);
		response.setMessage("Account created successfully");
		verifyServices.deleteVerify(dto.username());
		return response;
	}

	// fn: find account by username
	@Override
	public Account findAccountByUserName(String userName) {
		return accountRepository.findByUsername(userName).orElse(null);
	}

	// fn: forgot password
	@Override
	public MessageResponse forgotPassword(ForgotPasswordRequest dto) {
		MessageResponse response = new MessageResponse();
		try{
			// check otp
			if(!checkOTP(dto.username(), dto.verifyCode())){
				response.setCode(1);
				response.setMessage("OTP không đúng hoặc quá hạn");
				return response;
			}
			var userFromDb = findAccountByUserName(dto.username());
			if (userFromDb == null) {
				response.setCode(2);
				response.setMessage("Account not found");
				return response;
			}
			userFromDb.setPassword(bCryptPasswordEncoder.encode(dto.password()));
			accountRepository.save(userFromDb);
			verifyServices.deleteVerify(dto.username());
			updateFailedLogin(dto.username());
			response.setCode(0);
			response.setMessage("Account successfully forgotten");
		}
		catch(Exception e){
			response.setCode(-1);
			response.setMessage(e.getMessage());
		}
		return response;
	}

	// fn: findAllAccounts
	@Override
	public List<Account> findAllAccounts(){
		return accountRepository.findAll();
	}

	// fn: check password
	private Boolean checkPassword(String email, String password) {
		return bCryptPasswordEncoder.matches(password, findAccountByUserName(email).getPassword());
	}

	// fn: check failed login
	private Boolean checkFailedLogin(LoginRequest dto){
		var userFromDb = findAccountByUserName(dto.username());
		if(userFromDb.getFailedLoginTimes() >= 4){
			return false;
		}
		return true;
	}

	// fn: tang failed login
	private void failedLogin(LoginRequest dto){
		var userFromDb = findAccountByUserName(dto.username());
		userFromDb.setFailedLoginTimes(userFromDb.getFailedLoginTimes() + 1);
		accountRepository.save(userFromDb);
	}

	// fn: delete failed login
	private void updateFailedLogin(String username){
		var userFromDb = findAccountByUserName(username);
		userFromDb.setFailedLoginTimes(0);
		accountRepository.save(userFromDb);
	}

	// fn: check password
	@Override
	public MessageResponse passwordCheck(LoginRequest dto) {
		MessageResponse response = new MessageResponse();
		try{
			if(!checkFailedLogin(dto)){
				SendMailRequest sendMail = new SendMailRequest(dto.username(), 3);
				response = mailServices.sendMail(sendMail);
				if(response.getCode() != 0){
					return response;
				}
				response.setCode(1);
				response.setMessage("Đăng nhập sai nhiều lần!");
				return response;
			} // login very failed

			if(!checkPassword(dto.username(), dto.password())){
				response.setCode(2);
				response.setMessage("Mật khẩu sai");
				failedLogin(dto);
				return response;
			}
			updateFailedLogin(dto.username());
			response.setCode(0);
			response.setMessage("success");
		}
		catch(Exception e){
			response.setCode(-1);
			response.setMessage(e.getMessage());
		}
		return response;
	}
}
