package com.trinhminhthaito.backend_springboot.repository.accountRepository;

import com.trinhminhthaito.backend_springboot.models.accountModels.Verify;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerifyRepository extends MongoRepository<Verify, String> {
	Optional<Verify> findByEmailAndCode(String email, String code);
	Optional<Verify> findByEmail(String email);
	void deleteByEmail(String email);
}
