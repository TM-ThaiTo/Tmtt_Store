package com.trinhminhthaito.backend_springboot.config;

import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import com.trinhminhthaito.backend_springboot.models.accountModels.Role;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.AccountRepository;
import com.trinhminhthaito.backend_springboot.repository.accountRepository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

@Configuration
public class AdminConfig implements CommandLineRunner {

	private final RoleRepository roleRepository;
	private final AccountRepository accountRepository;
	private final BCryptPasswordEncoder passwordEncoder;

	public AdminConfig(RoleRepository roleRepository, AccountRepository accountRepository,
					   BCryptPasswordEncoder passwordEncoder) {
		this.roleRepository = roleRepository;
		this.accountRepository = accountRepository;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	@Transactional
	public void run(String... args) throws Exception{

		Role roleAdmin = roleRepository.findByName(Role.Vales.ADMIN.name())
				.orElseGet(() -> roleRepository.save(new Role(null, Role.Vales.ADMIN.name())));

		Role roleUser = roleRepository.findByName(Role.Vales.USER.name())
				.orElseGet(() -> roleRepository.save(new Role(null, Role.Vales.USER.name())));

		var userAdmin = accountRepository.findByUsername("admin");

		userAdmin.ifPresentOrElse(
				account -> System.out.println("admin ja exit"),
				() -> {
					var account = new Account();
					account.setUsername("admin");
					account.setPassword(passwordEncoder.encode("12345"));
					account.setRole(roleAdmin);
					accountRepository.save(account);
				}
		);
	}
}
