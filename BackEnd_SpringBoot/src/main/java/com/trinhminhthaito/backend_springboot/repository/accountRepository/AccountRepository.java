package com.trinhminhthaito.backend_springboot.repository.accountRepository;

import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
	Optional<Account> findByUsername(String username);
}
