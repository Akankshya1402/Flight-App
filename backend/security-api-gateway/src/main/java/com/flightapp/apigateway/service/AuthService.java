package com.flightapp.apigateway.service;

import com.flightapp.apigateway.dto.AuthResponse;
import com.flightapp.apigateway.dto.ChangePasswordRequest;
import com.flightapp.apigateway.dto.LoginRequest;
import com.flightapp.apigateway.dto.RegisterRequest;
import com.flightapp.apigateway.security.JwtUtil;
import com.flightapp.auth.exception.InvalidPasswordException;
import com.flightapp.auth.exception.PasswordAttemptExceededException;

import jakarta.transaction.Transactional;
import jakarta.validation.Valid;

import com.flightapp.apigateway.model.User;
import com.flightapp.apigateway.repository.UserRepository;
import com.flightapp.apigateway.model.UserRole;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        UserRole role = request.getRole() != null ? request.getRole() : UserRole.ROLE_USER;

        User user = User.builder()
                .email(request.getEmail())
                .fullName(request.getFullName())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        return new AuthResponse(token, user.getEmail(), user.getRole());
    }

    @Transactional
    public void changePassword(ChangePasswordRequest req) {

        User user = userRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getFailedAttempts() >= 3) {
            throw new PasswordAttemptExceededException(
                "Too many wrong attempts. Try again later."
            );
        }

        if (!passwordEncoder.matches(req.getOldPassword(), user.getPasswordHash())) {
            user.incrementFailedAttempts();
            userRepository.save(user);
            throw new InvalidPasswordException("Old password incorrect");
        }

        if (passwordEncoder.matches(req.getNewPassword(), user.getPasswordHash())) {
            throw new InvalidPasswordException(
                "New password cannot be same as old"
            );
        }

        user.setPasswordHash(
            passwordEncoder.encode(req.getNewPassword())
        );
        user.resetFailedAttempts();
        userRepository.save(user);
    }


}
