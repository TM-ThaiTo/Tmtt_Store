package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.dtos.request.ForgotPasswordRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.LoginRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SendMailRequest;
import com.trinhminhthaito.backend_springboot.dtos.request.SignUpRequest;
import com.trinhminhthaito.backend_springboot.dtos.response.MessageResponse;
import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.models.accountModels.User;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.UserRepository;
import com.trinhminhthaito.backend_springboot.services.AccountServices;
import com.trinhminhthaito.backend_springboot.services.MailServices;
import com.trinhminhthaito.backend_springboot.services.VerifyServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import com.trinhminhthaito.backend_springboot.enums.Role;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.text.ParseException;

@Service
public class AccountServicesImp implements AccountServices {

	private final AccountRepository accountRepository;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	private final UserRepository userRepository;
	private final VerifyServices verifyServices;
	private final MailServices mailServices;

	@Autowired
	private AccountServicesImp(AccountRepository accountRepository,
			BCryptPasswordEncoder bCryptPasswordEncoder,
			UserRepository userRepository,
			VerifyServices verifyServices,
			MailServices mailServices) {
		this.accountRepository = accountRepository;
		this.bCryptPasswordEncoder = bCryptPasswordEncoder;
		this.userRepository = userRepository;
		this.verifyServices = verifyServices;
		this.mailServices = mailServices;
	}

	// fn: add account to database
	private void addAccount(SignUpRequest dto) throws ParseException {
		var newAccount = new Account();
		HashSet<String> roles = new HashSet<>();
		roles.add(Role.USER.name());
		newAccount.setRoles(roles);

		newAccount.setUsername(dto.username());
		newAccount.setPassword(bCryptPasswordEncoder.encode(dto.password()));
		newAccount.setGoogleId(null);
		newAccount.setAuthType("LOCAL");
		newAccount.setFailedLoginTimes(0);
		newAccount.setRefreshToken(null);
		accountRepository.save(newAccount);
		addUser(dto, newAccount.getId());
	}

	private Date parseDateString(String dateString) throws ParseException {
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy");
		return dateFormat.parse(dateString);
	}

	// fn: add user to database
	private void addUser(SignUpRequest dto, String accountId) throws ParseException {
		var user = new User();
		user.setAccountId(accountId);
		user.setFullName(dto.fullName());
		user.setGender(dto.gender());
		Date dateOfBirth = parseDateString(dto.birthday());

		user.setDateOfBirth(dateOfBirth);
		user.setAddress(dto.address());
		userRepository.save(user);
	}

	// fn: check otp
	private Boolean checkOTP(String email, String otp) {
		return verifyServices.checkVerifyToEmail(email, otp);
	}

	// fn: create account
	@Override
	public MessageResponse createAccount(SignUpRequest dto) throws ParseException {
		MessageResponse response = new MessageResponse();

		if (!checkOTP(dto.username(), dto.verifyCode())) {
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
		addAccount(dto);
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
		try {
			// check otp
			// if (!checkOTP(dto.username(), dto.verifyCode())) {
			// response.setCode(1);
			// response.setMessage("OTP không đúng hoặc quá hạn");
			// return response;
			// }
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
		} catch (Exception e) {
			response.setCode(-1);
			response.setMessage(e.getMessage());
		}
		return response;
	}

	// fn: check password
	private Boolean checkPassword(String email, String password) {
		return bCryptPasswordEncoder.matches(password, findAccountByUserName(email).getPassword());
	}

	// fn: check failed login
	private Boolean checkFailedLogin(LoginRequest dto) {
		var userFromDb = findAccountByUserName(dto.email());
		return userFromDb.getFailedLoginTimes() < 4;
	}

	// fn: tang failed login
	private void failedLogin(LoginRequest dto) {
		var userFromDb = findAccountByUserName(dto.email());
		userFromDb.setFailedLoginTimes(userFromDb.getFailedLoginTimes() + 1);
		accountRepository.save(userFromDb);
	}

	// fn: delete failed login
	private void updateFailedLogin(String username) {
		var userFromDb = findAccountByUserName(username);
		userFromDb.setFailedLoginTimes(0);
		accountRepository.save(userFromDb);
	}

	// fn: check password
	@Override
	public MessageResponse passwordCheck(LoginRequest dto) {
		MessageResponse response = new MessageResponse();
		try {
			if (!checkFailedLogin(dto)) {
				SendMailRequest sendMail = new SendMailRequest(dto.email(), 3);
				response = mailServices.sendMail(sendMail);
				if (response.getCode() != 0) {
					return response;
				}
				response.setCode(1);
				response.setMessage("Đăng nhập sai nhiều lần!");
				return response;
			} // login very failed

			if (!checkPassword(dto.email(), dto.password())) {
				response.setCode(2);
				response.setMessage("Mật khẩu sai");
				failedLogin(dto);
				return response;
			}
			updateFailedLogin(dto.email());
			response.setCode(0);
			response.setMessage("success");
		} catch (Exception e) {
			response.setCode(-1);
			response.setMessage(e.getMessage());
		}
		return response;
	}

	// fn: delete account by Id
	@Override
	public MessageResponse deleteAccountById(String id) {
		MessageResponse response = new MessageResponse();

		Account account = accountRepository.findById(id).orElse(null);
		User user = userRepository.findById(id).orElse(null);

		// Defensive programming: Check for null account first
		if (account == null) {
			response.setCode(1);
			response.setMessage("Account not found");
			return response;
		}

		// Check if the account has the ADMIN role
		boolean isAdmin = account.getRoles().contains(Role.ADMIN.name());
		if (isAdmin) {
			response.setCode(2);
			response.setMessage("Cannot delete account with ADMIN role");
			return response;
		}

		// Now we can safely check for null user
		if (user == null) {
			response.setCode(3); // A new code for this case
			response.setMessage("User associated with account not found");
			return response;
		}

		accountRepository.delete(account);
		userRepository.delete(user);

		response.setCode(0);
		response.setMessage("Account deleted successfully");
		return response;
	}
}
