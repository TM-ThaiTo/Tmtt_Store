package com.trinhminhthaito.backend_springboot.config;

import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import com.trinhminhthaito.backend_springboot.enums.Role;
import java.util.HashSet;

@Configuration
public class AdminConfig implements CommandLineRunner {

	private final AccountRepository accountRepository;
	private final BCryptPasswordEncoder passwordEncoder;

	public AdminConfig(AccountRepository accountRepository,
					   BCryptPasswordEncoder passwordEncoder) {
		this.accountRepository = accountRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	@Transactional
	public void run(String... args) {
		HashSet<String> roles = new HashSet<>();
		roles.add(Role.ADMIN.name());

		if (accountRepository.findByUsername("admin").isPresent()) {
			System.out.println("admin already exists");
		} else {
			Account newAdmin = new Account();
			newAdmin.setUsername("admin");
			newAdmin.setPassword(passwordEncoder.encode("12345"));
			newAdmin.setRoles(roles);
			accountRepository.save(newAdmin);
		}
	}
}
