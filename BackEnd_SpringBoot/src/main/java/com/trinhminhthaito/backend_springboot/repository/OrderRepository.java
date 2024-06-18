package com.trinhminhthaito.backend_springboot.repository;

import com.trinhminhthaito.backend_springboot.models.orderModels.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.*;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByCustomerOrderCustomerId(String customerId);

    Boolean existsByOrderCode(String orderCode);
}
