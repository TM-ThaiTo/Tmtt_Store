package com.trinhminhthaito.backend_springboot.repository.accountRepository;

import com.trinhminhthaito.backend_springboot.models.accountModels.Account;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends MongoRepository<Account, String> {
	Optional<Account> findByUsername(String username);

	@Query(value = "{}", fields = "{ 'password' : 0 }")
	List<Account> findAllByUsernameNotContainingPassword();
}
