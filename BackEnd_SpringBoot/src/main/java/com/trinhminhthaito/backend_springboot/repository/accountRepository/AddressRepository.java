package com.trinhminhthaito.backend_springboot.repository.accountRepository;

import com.trinhminhthaito.backend_springboot.models.accountModels.Address;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AddressRepository extends MongoRepository<Address, String> {
}
