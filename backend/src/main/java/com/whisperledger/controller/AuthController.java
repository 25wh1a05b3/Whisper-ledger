package com.whisperledger.controller;

import com.whisperledger.dto.AuthDtos.*;
import com.whisperledger.entity.User;
import com.whisperledger.repository.UserRepository;
import com.whisperledger.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        User user = new User(
                "u-" + UUID.randomUUID().toString().substring(0, 8),
                request.getName(),
                request.getEmail(),
                request.getDepartment(),
                request.getYear(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole() != null ? request.getRole() : User.Role.STUDENT
        );
        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getDepartment());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getDepartment(), user.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail(), user.getRole().name(), user.getDepartment());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.getDepartment(), user.getRole().name()));
    }
}
