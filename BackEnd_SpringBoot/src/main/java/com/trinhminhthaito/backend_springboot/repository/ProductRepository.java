package com.trinhminhthaito.backend_springboot.repository;

import com.mongodb.lang.NonNull;
import com.trinhminhthaito.backend_springboot.models.productModels.Product;
import com.trinhminhthaito.backend_springboot.repository.custom.ProductRepositoryCustom;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends MongoRepository<Product, String>, ProductRepositoryCustom {
	Optional<Product> findByCode(String code);

	List<Product> findByType(Number type, Pageable pageable);

	List<Product> findByType(Number type);

	List<Product> findByNameContainingIgnoreCase(String name);

	List<Product> findByCodeContainingIgnoreCase(String code);

	List<Product> findByNameContainingIgnoreCaseAndType(String name, Number type);

	List<Product> findByCodeContainingIgnoreCaseAndType(String code, Number type);

	List<Product> findByNameContainingIgnoreCaseAndCodeContainingIgnoreCase(String name, String code);

	List<Product> findByNameContainingIgnoreCaseAndCodeContainingIgnoreCaseAndType(String name, String code,
			Number type);

	Page<Product> findTop8ByOrderByRatesDesc(Pageable pageable);

	Page<Product> findTop8ByOrderByDiscountDesc(Pageable pageable);

	@NonNull
	Page<Product> findAll(@NonNull Pageable pageable);
}
