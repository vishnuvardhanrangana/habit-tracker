package com.example.habittracker.controller;

import com.example.habittracker.dto.*;
import com.example.habittracker.security.RegistrationRateLimiter;
import com.example.habittracker.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import com.example.habittracker.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final RegistrationRateLimiter registrationRateLimiter;

    public AuthController(UserService userService, RegistrationRateLimiter registrationRateLimiter) {
        this.userService = userService;
        this.registrationRateLimiter = registrationRateLimiter;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDto>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest) {
        registrationRateLimiter.check(httpRequest.getRemoteAddr());
        UserDto registeredUser = userService.registerUser(request);
        ApiResponse<UserDto> response = new ApiResponse<>(true, "Account created successfully", registeredUser);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }


    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse authResponse = userService.authenticateUser(request);
        ApiResponse<AuthResponse> response = new ApiResponse<>(true, "Login successful", authResponse);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto currentUser = userService.getCurrentUser();
        ApiResponse<UserDto> response = new ApiResponse<>(true, "Current user retrieved successfully", currentUser);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
