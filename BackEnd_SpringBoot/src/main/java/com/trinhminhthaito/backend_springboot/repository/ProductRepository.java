package com.trinhminhthaito.backend_springboot.repository.productRepository;

import com.mongodb.lang.NonNull;
import com.trinhminhthaito.backend_springboot.models.productModels.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
	Optional<Product> findByCode(String code);
	List<Product> findByType(Number type, Pageable pageable);
	@NonNull
	Page<Product> findAll(@NonNull Pageable pageable);
}
