package com.example.habittracker.controller;

import com.example.habittracker.dto.ProfileUpdateRequest;
import com.example.habittracker.dto.UserDto;
import com.example.habittracker.service.UserService;
import com.example.habittracker.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserService userService;

    public ProfileController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        UserDto userDto = userService.getCurrentUser();
        ApiResponse<UserDto> response = new ApiResponse<>(true, "Profile retrieved successfully", userDto);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@Valid @RequestBody ProfileUpdateRequest request) {
        UserDto updatedUser = userService.updateProfile(request);
        ApiResponse<UserDto> response = new ApiResponse<>(true, "Profile updated successfully", updatedUser);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
