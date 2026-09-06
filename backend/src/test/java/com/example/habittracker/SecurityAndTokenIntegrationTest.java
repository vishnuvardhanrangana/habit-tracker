package com.example.habittracker;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityAndTokenIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    void unauthenticatedAccessToProtectedEndpointsIsRejected() throws Exception {
        String[] endpoints = {
                "/api/habits",
                "/api/dashboard",
                "/api/analytics",
                "/api/profile",
                "/api/completions",
                "/api/auth/me"
        };

        for (String endpoint : endpoints) {
            mockMvc.perform(get(endpoint))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.success").value(false))
                    .andExpect(jsonPath("$.message").value("Unauthorized"));
        }
    }

    @Test
    void invalidTokenAccessIsRejected() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .header("Authorization", "Bearer invalid_or_forged_jwt_token_12345"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.success").value(false));
    }
}
