package com.example.backend.repository;

import com.example.backend.model.Category;
import com.example.backend.model.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(Category category);
}
