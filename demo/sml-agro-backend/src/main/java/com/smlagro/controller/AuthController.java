package com.smlagro.controller;

import com.smlagro.dto.request.LoginRequest;
import com.smlagro.dto.response.ApiResponse;
import com.smlagro.dto.response.AuthResponse;
import com.smlagro.model.User;
import com.smlagro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByUsername(request.getUsername());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Invalid username or password"));
        }

        User user = userOpt.get();

        if (!Boolean.TRUE.equals(user.getIsActive())) {
            return ResponseEntity.status(403)
                    .body(ApiResponse.error("Account is disabled. Contact your administrator."));
        }

        boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());
        if (!passwordMatches) {
            return ResponseEntity.status(401)
                    .body(ApiResponse.error("Invalid username or password"));
        }

        AuthResponse authResponse = new AuthResponse(
                user.getUsername(),
                user.getFullName() != null ? user.getFullName() : user.getUsername(),
                user.getRole().name());

        return ResponseEntity.ok(ApiResponse.ok("Login successful", authResponse));
    }
}
