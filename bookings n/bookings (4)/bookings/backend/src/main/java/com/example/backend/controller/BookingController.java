package com.example.backend.controller;

import com.example.backend.model.Booking;
import com.example.backend.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private com.example.backend.service.JwtUtil jwtUtil; // CORRECT injection!

    @PostMapping("/add")
    public ResponseEntity<?> addBooking(@RequestBody Booking booking, @RequestHeader("Authorization") String authHeader) {
        // Remove "Bearer " and extract userId from token
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.getUserIdFromToken(token);
        booking.setUserId(userId);
        booking.setCreatedAt(Instant.now());
        Booking saved = bookingRepo.save(booking);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user")
    public ResponseEntity<List<Booking>> getUserBookings(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        String userId = jwtUtil.getUserIdFromToken(token);
        List<Booking> bookings = bookingRepo.findByUserId(userId);
        return ResponseEntity.ok(bookings);
    }
}
