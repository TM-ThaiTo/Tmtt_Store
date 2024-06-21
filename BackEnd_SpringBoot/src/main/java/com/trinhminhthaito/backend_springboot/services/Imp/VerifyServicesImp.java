package com.trinhminhthaito.backend_springboot.services.Imp;

import com.trinhminhthaito.backend_springboot.models.accountModels.Verify;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.VerifyRepository;
import com.trinhminhthaito.backend_springboot.services.VerifyServices;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class VerifyServicesImp implements VerifyServices {

	private final VerifyRepository verifyRepository;
	private static final SecureRandom secureRandom = new SecureRandom();

	public VerifyServicesImp(VerifyRepository verifyRepository) {
		this.verifyRepository = verifyRepository;
	}

	// fn: handle create OTP
	private String createOTP() {
		int otp = secureRandom.nextInt(1000000);
		return String.format("%06d", otp);
	}

	// fn: handle save OTP to verify
	// => save verify -> database
	private void saveOTP(String mail, String otp) {
		Verify verify = new Verify();
		verify.setEmail(mail);
		verify.setCode(otp);
		verify.setDateCreated(LocalDateTime.now());
		verifyRepository.save(verify);
	}

	// fn: create verify
	@Override
	public String createVerify(String mail) {
		String otp = createOTP();
		saveOTP(mail, otp);
		return otp;
	}

	// fn: delete verify
	// xoa khi thuc hien thanh cong
	@Override
	public void deleteVerify(String email) {
		verifyRepository.deleteByEmail(email);
	}

	// fn: check verify đã tồn tại chưa
	@Override
	public Boolean checkVerifyExist(String email) {
		Optional<Verify> verifyOptional = verifyRepository.findByEmail(email);
		if (verifyOptional.isPresent()) {
			Verify verify = verifyOptional.get();
			LocalDateTime now = LocalDateTime.now();
			LocalDateTime dateCreated = verify.getDateCreated();
			Duration duration = Duration.between(dateCreated, now);
			long minutes = duration.toMinutes();
			if (minutes < 10) {
				return false;
			}
		}
		// ok -> delete otp cu
		verifyRepository.deleteByEmail(email);
		return true;
	}

	// fn: check verify vs email
	@Override
	public Boolean checkVerifyToEmail(String email, String otp) {
		Optional<Verify> verifyOptional = verifyRepository.findByEmailAndCode(email, otp);
		if (verifyOptional.isPresent()) {
			Verify verify = verifyOptional.get();
			LocalDateTime now = LocalDateTime.now();
			LocalDateTime dateCreated = verify.getDateCreated();
			Duration duration = Duration.between(dateCreated, now);
			long minutes = duration.toMinutes();
			return minutes <= 10;
		}
		return false;
	}
}
