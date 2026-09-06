package com.example.habittracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProfileAndAnalyticsIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String userEmail;
    private String authorization;

    @BeforeEach
    void setUp() throws Exception {
        userEmail = "prof_user_" + System.currentTimeMillis() + "@example.com";
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Profile Tester\",\"email\":\"" + userEmail + "\",\"password\":\"oldPassword123\",\"confirmPassword\":\"oldPassword123\"}"))
                .andExpect(status().isCreated());

        String loginRes = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + userEmail + "\",\"password\":\"oldPassword123\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        authorization = "Bearer " + objectMapper.readTree(loginRes).path("data").path("token").asText();
    }

    @Test
    void testGetProfile() throws Exception {
        mockMvc.perform(get("/api/profile")
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(userEmail))
                .andExpect(jsonPath("$.data.fullName").value("Profile Tester"));
    }

    @Test
    void testUpdateProfileName() throws Exception {
        // Valid update
        mockMvc.perform(put("/api/profile")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Updated Profile Name\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.fullName").value("Updated Profile Name"));

        // Empty name rejected with 400
        mockMvc.perform(put("/api/profile")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"   \"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Full name cannot be empty"));
    }

    @Test
    void testPasswordChangeFlow() throws Exception {
        // Incorrect old password -> 400
        mockMvc.perform(put("/api/profile")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"wrongOldPassword\",\"newPassword\":\"newPassword123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Current password is incorrect"));

        // Same password -> 400
        mockMvc.perform(put("/api/profile")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"oldPassword123\",\"newPassword\":\"oldPassword123\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("New password cannot be the same as the current password"));

        // Short new password (< 6) -> 400
        mockMvc.perform(put("/api/profile")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"oldPassword123\",\"newPassword\":\"12345\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("New password must be at least 6 characters long"));

        // Successful password change
        mockMvc.perform(put("/api/profile")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"currentPassword\":\"oldPassword123\",\"newPassword\":\"newPassword123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Old password no longer works
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + userEmail + "\",\"password\":\"oldPassword123\"}"))
                .andExpect(status().isUnauthorized());

        // New password works
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + userEmail + "\",\"password\":\"newPassword123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    void testAnalyticsAndDashboard() throws Exception {
        // Dashboard loads with 200 OK
        mockMvc.perform(get("/api/dashboard")
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Analytics loads with 200 OK
        mockMvc.perform(get("/api/analytics")
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Invalid month (> 12) -> 400
        mockMvc.perform(get("/api/analytics")
                        .header("Authorization", authorization)
                        .param("month", "13"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Month must be between 1 and 12"));

        // Invalid year (< 2000) -> 400
        mockMvc.perform(get("/api/analytics")
                        .header("Authorization", authorization)
                        .param("year", "1999"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Year must be between 2000 and 2100"));
    }
}
