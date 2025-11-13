package com.example.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {
    @Id
    private String id;
    private Category category;
    private String title;
    private String description;
    private double price;
    private int availableSeatsOrRooms;

    public Product() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public Category getCategory() { return category; }
    public void setCategory(Category category) { this.category = category; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public int getAvailableSeatsOrRooms() { return availableSeatsOrRooms; }
    public void setAvailableSeatsOrRooms(int availableSeatsOrRooms) { this.availableSeatsOrRooms = availableSeatsOrRooms; }
}
