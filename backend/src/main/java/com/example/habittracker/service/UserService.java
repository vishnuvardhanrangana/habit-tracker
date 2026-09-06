package com.example.habittracker.service;

import com.example.habittracker.dto.*;
import com.example.habittracker.entity.User;
import com.example.habittracker.exception.BadRequestException;
import com.example.habittracker.exception.ResourceNotFoundException;
import com.example.habittracker.repository.UserRepository;
import com.example.habittracker.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider,
                       AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.authenticationManager = authenticationManager;
    }

    @Transactional
    public UserDto registerUser(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email address is already in use");
        }

        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        User user = new User();
        user.setFullName(request.getFullName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    public AuthResponse authenticateUser(LoginRequest request) {
        String email = request.getEmail() != null ? request.getEmail().trim().toLowerCase() : "";
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        email,
                        request.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(email);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return new AuthResponse(jwt, mapToDto(user));
    }

    public User getCurrentUserEntity() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new BadRequestException("User is not authenticated");
        }
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    public UserDto getCurrentUser() {
        return mapToDto(getCurrentUserEntity());
    }

    @Transactional
    public UserDto updateProfile(ProfileUpdateRequest request) {
        User user = getCurrentUserEntity();

        if (request.getFullName() != null) {
            if (request.getFullName().trim().isEmpty()) {
                throw new BadRequestException("Full name cannot be empty");
            }
            if (request.getFullName().trim().length() > 100) {
                throw new BadRequestException("Full name must not exceed 100 characters");
            }
            user.setFullName(request.getFullName().trim());
        }

        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getCurrentPassword() == null || request.getCurrentPassword().isEmpty()) {
                throw new BadRequestException("Current password is required to change password");
            }
            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                throw new BadRequestException("New password cannot be the same as the current password");
            }
            if (request.getNewPassword().length() < 6) {
                throw new BadRequestException("New password must be at least 6 characters long");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User updatedUser = userRepository.save(user);
        return mapToDto(updatedUser);
    }

    public UserDto mapToDto(User user) {
        return new UserDto(user.getId(), user.getFullName(), user.getEmail(), user.getCreatedAt());
    }
}
