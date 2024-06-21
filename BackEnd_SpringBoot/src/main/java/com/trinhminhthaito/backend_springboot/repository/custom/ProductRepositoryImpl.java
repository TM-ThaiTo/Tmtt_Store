package com.trinhminhthaito.backend_springboot.repository.custom;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;
import com.trinhminhthaito.backend_springboot.models.productModels.Product;

import java.util.List;

@Repository
public class ProductRepositoryImpl implements ProductRepositoryCustom {

    @Autowired
    private MongoTemplate mongoTemplate;

    @Override
    public List<Product> searchProducts(String codeP, String nameP, Number typeP) {
        Query query = new Query();

        if (codeP != null && !codeP.isEmpty()) {
            query.addCriteria(Criteria.where("code").is(codeP));
        }
        if (nameP != null && !nameP.isEmpty()) {
            query.addCriteria(Criteria.where("name").regex(".*" + nameP + ".*", "i"));
        }
        if (typeP != null) {
            query.addCriteria(Criteria.where("type").is(typeP));
        }

        return mongoTemplate.find(query, Product.class);
    }
}
