package com.example.habittracker;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class UserIsolationIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String tokenUserA;
    private String tokenUserB;
    private long habitIdUserA;

    @BeforeEach
    void setUp() throws Exception {
        long ts = System.currentTimeMillis();
        String emailA = "user_a_" + ts + "@example.com";
        String emailB = "user_b_" + ts + "@example.com";

        // Register User A
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"User A\",\"email\":\"" + emailA + "\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}"))
                .andExpect(status().isCreated());

        // Login User A
        String loginResA = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + emailA + "\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        tokenUserA = "Bearer " + objectMapper.readTree(loginResA).path("data").path("token").asText();

        // Register User B
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"User B\",\"email\":\"" + emailB + "\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}"))
                .andExpect(status().isCreated());

        // Login User B
        String loginResB = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + emailB + "\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        tokenUserB = "Bearer " + objectMapper.readTree(loginResB).path("data").path("token").asText();

        // User A creates a habit
        String habitResA = mockMvc.perform(post("/api/habits")
                        .header("Authorization", tokenUserA)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"User A Secret Routine\",\"description\":\"Confidential\",\"category\":\"Study\",\"frequency\":\"Daily\",\"targetCount\":1,\"color\":\"emerald\",\"icon\":\"BookOpen\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        habitIdUserA = objectMapper.readTree(habitResA).path("data").path("id").asLong();

        // User A completes the habit
        mockMvc.perform(post("/api/habits/{id}/complete", habitIdUserA)
                        .header("Authorization", tokenUserA))
                .andExpect(status().isOk());
    }

    @Test
    void userBCannotReadUserAHabit() throws Exception {
        mockMvc.perform(get("/api/habits/{id}", habitIdUserA)
                        .header("Authorization", tokenUserB))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void userBCannotUpdateUserAHabit() throws Exception {
        mockMvc.perform(put("/api/habits/{id}", habitIdUserA)
                        .header("Authorization", tokenUserB)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Hacked Name\",\"description\":\"Hacked\",\"category\":\"Study\",\"frequency\":\"Daily\",\"targetCount\":1,\"color\":\"emerald\",\"icon\":\"BookOpen\"}"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void userBCannotDeleteUserAHabit() throws Exception {
        mockMvc.perform(delete("/api/habits/{id}", habitIdUserA)
                        .header("Authorization", tokenUserB))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void userBCannotArchiveOrRestoreUserAHabit() throws Exception {
        mockMvc.perform(patch("/api/habits/{id}/archive", habitIdUserA)
                        .header("Authorization", tokenUserB)
                        .param("archive", "true"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void userBCannotCompleteUserAHabit() throws Exception {
        mockMvc.perform(post("/api/habits/{id}/complete", habitIdUserA)
                        .header("Authorization", tokenUserB))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void userBCannotUndoUserAHabitCompletion() throws Exception {
        mockMvc.perform(delete("/api/habits/{id}/complete", habitIdUserA)
                        .header("Authorization", tokenUserB))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void userBCannotAccessUserAHabitCompletions() throws Exception {
        mockMvc.perform(get("/api/habits/{id}/completions", habitIdUserA)
                        .header("Authorization", tokenUserB))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void userBHabitsListDoesNotContainUserAHabit() throws Exception {
        mockMvc.perform(get("/api/habits")
                        .header("Authorization", tokenUserB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));
    }

    @Test
    void userBDashboardDoesNotIncludeUserAHabit() throws Exception {
        mockMvc.perform(get("/api/dashboard")
                        .header("Authorization", tokenUserB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.totalToday").value(0))
                .andExpect(jsonPath("$.data.completedToday").value(0))
                .andExpect(jsonPath("$.data.totalCompletions").value(0));
    }

    @Test
    void userBAnalyticsDoesNotIncludeUserAHabit() throws Exception {
        mockMvc.perform(get("/api/analytics")
                        .header("Authorization", tokenUserB))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.habitPerformances", hasSize(0)))
                .andExpect(jsonPath("$.data.totalCompletions").value(0));
    }
}
