package com.example.habittracker;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class HabitCrudAndCompletionIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String authorization;

    @BeforeEach
    void setUp() throws Exception {
        String email = "habit_crud_user_" + System.currentTimeMillis() + "@example.com";
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Habit CRUD User\",\"email\":\"" + email + "\",\"password\":\"password123\",\"confirmPassword\":\"password123\"}"))
                .andExpect(status().isCreated());

        String loginRes = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        authorization = "Bearer " + objectMapper.readTree(loginRes).path("data").path("token").asText();
    }

    @Test
    void testCreateHabitValidationFailures() throws Exception {
        // Missing name
        mockMvc.perform(post("/api/habits")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"description\":\"No name\",\"category\":\"Study\",\"frequency\":\"Daily\",\"targetCount\":1,\"color\":\"emerald\",\"icon\":\"BookOpen\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        // Invalid category
        mockMvc.perform(post("/api/habits")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Bad Category\",\"category\":\"InvalidCat\",\"frequency\":\"Daily\",\"targetCount\":1,\"color\":\"emerald\",\"icon\":\"BookOpen\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        // Invalid frequency
        mockMvc.perform(post("/api/habits")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Bad Freq\",\"category\":\"Study\",\"frequency\":\"Yearly\",\"targetCount\":1,\"color\":\"emerald\",\"icon\":\"BookOpen\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));

        // Target count < 1
        mockMvc.perform(post("/api/habits")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Zero Target\",\"category\":\"Study\",\"frequency\":\"Daily\",\"targetCount\":0,\"color\":\"emerald\",\"icon\":\"BookOpen\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false));
    }

    @Test
    void testHabitLifecycleAndArchiveRestore() throws Exception {
        // Create habit
        String res = mockMvc.perform(post("/api/habits")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Morning Walk\",\"description\":\"Fast pace\",\"category\":\"Fitness\",\"frequency\":\"Daily\",\"targetCount\":1,\"color\":\"indigo\",\"icon\":\"Flame\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.data.name").value("Morning Walk"))
                .andExpect(jsonPath("$.data.active").value(true))
                .andReturn().getResponse().getContentAsString();
        long habitId = objectMapper.readTree(res).path("data").path("id").asLong();

        // Update habit
        mockMvc.perform(put("/api/habits/{id}", habitId)
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Morning Jog\",\"description\":\"Jogging\",\"category\":\"Fitness\",\"frequency\":\"Daily\",\"targetCount\":2,\"color\":\"indigo\",\"icon\":\"Flame\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("Morning Jog"))
                .andExpect(jsonPath("$.data.targetCount").value(2));

        // Archive habit
        mockMvc.perform(patch("/api/habits/{id}/archive", habitId)
                        .header("Authorization", authorization)
                        .param("archive", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(false));

        // Verify it is not in active habits list
        mockMvc.perform(get("/api/habits")
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(0)));

        // Verify it is in all habits list
        mockMvc.perform(get("/api/habits")
                        .header("Authorization", authorization)
                        .param("includeArchived", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));

        // Restore habit
        mockMvc.perform(patch("/api/habits/{id}/archive", habitId)
                        .header("Authorization", authorization)
                        .param("archive", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.active").value(true));

        // Verify it is back in active habits list
        mockMvc.perform(get("/api/habits")
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data", hasSize(1)));
    }

    @Test
    void testHabitCompletionFlow() throws Exception {
        String res = mockMvc.perform(post("/api/habits")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Water Intake\",\"category\":\"Health\",\"frequency\":\"Daily\",\"targetCount\":2,\"color\":\"blue\",\"icon\":\"Coffee\"}"))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long habitId = objectMapper.readTree(res).path("data").path("id").asLong();

        // Complete today (count 1 of 2)
        mockMvc.perform(post("/api/habits/{id}/complete", habitId)
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.completedCount").value(1))
                .andExpect(jsonPath("$.data.completedToday").value(false));

        // Complete today again (count 2 of 2 -> completedToday = true)
        mockMvc.perform(post("/api/habits/{id}/complete", habitId)
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.completedCount").value(2))
                .andExpect(jsonPath("$.data.completedToday").value(true));

        // Reject future date completion
        LocalDate tomorrow = LocalDate.now().plusDays(1);
        mockMvc.perform(post("/api/habits/{id}/complete", habitId)
                        .header("Authorization", authorization)
                        .param("date", tomorrow.toString()))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Cannot complete a habit on a future date"));

        // Undo once (count 2 -> 1)
        mockMvc.perform(delete("/api/habits/{id}/complete", habitId)
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.completedCount").value(1));

        // Undo again (count 1 -> removed)
        mockMvc.perform(delete("/api/habits/{id}/complete", habitId)
                        .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.completedCount").value(0));

        // Undo when not completed (idempotent 200 OK)
        mockMvc.perform(delete("/api/habits/{id}/complete", habitId)
                        .header("Authorization", authorization))
                .andExpect(status().isOk());

        // Permanent deletion
        mockMvc.perform(delete("/api/habits/{id}", habitId)
                        .header("Authorization", authorization))
                .andExpect(status().isOk());

        // Verify gone
        mockMvc.perform(get("/api/habits/{id}", habitId)
                        .header("Authorization", authorization))
                .andExpect(status().isNotFound());
    }
}
