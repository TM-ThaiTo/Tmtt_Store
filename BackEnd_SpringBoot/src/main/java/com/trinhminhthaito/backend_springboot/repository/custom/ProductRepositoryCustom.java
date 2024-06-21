package com.trinhminhthaito.backend_springboot.repository.custom;

import com.trinhminhthaito.backend_springboot.models.productModels.Product;

import java.util.List;

public interface ProductRepositoryCustom {
    List<Product> searchProducts(String codeP, String nameP, Number typeP);
}