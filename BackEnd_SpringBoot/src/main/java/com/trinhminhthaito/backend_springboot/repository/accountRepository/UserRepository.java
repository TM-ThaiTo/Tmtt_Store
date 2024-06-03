package com.trinhminhthaito.backend_springboot.repository.accountRepository;

import com.trinhminhthaito.backend_springboot.models.accountModels.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
	User findByAccountId(String accountId);
}
