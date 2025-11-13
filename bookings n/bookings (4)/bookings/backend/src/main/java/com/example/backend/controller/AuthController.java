package com.example.backend.controller;

import com.example.backend.model.User;
import com.example.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @Autowired
    private com.example.backend.service.JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (user.getEmail() == null || user.getPassword() == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email and password required"));
        }
        return authService.register(user)
                .map(saved -> {
                    String token = jwtUtil.generateToken(saved.getId());
                    return ResponseEntity.ok(Map.of("token", token, "userId", saved.getId()));
                })
                .orElseGet(() -> ResponseEntity.badRequest().body(Map.of("error", "email already in use")));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signin(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "email and password required"));
        }
        return authService.authenticate(email, password)
                .map(user -> {
                    String token = jwtUtil.generateToken(user.getId());
                    return ResponseEntity.ok(Map.of(
                            "token", token,
                            "name", user.getName(),
                            "email", user.getEmail()
                    ));
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "invalid credentials")));
    }
}
