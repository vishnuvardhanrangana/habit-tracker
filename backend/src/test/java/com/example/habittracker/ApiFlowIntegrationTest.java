package com.example.habittracker;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ApiFlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void registeredUserCanUseThePrimaryHabitTrackingFlow() throws Exception {
        String email = "phase1.flow@example.com";
        String password = "secure-test-password";

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Phase One User\",\"email\":\"" + email + "\",\"password\":\"" + password + "\",\"confirmPassword\":\"" + password + "\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.email").value(email));

        String loginResponse = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn().getResponse().getContentAsString();
        String token = objectMapper.readTree(loginResponse).path("data").path("token").asText();
        String authorization = "Bearer " + token;

        String habitResponse = mockMvc.perform(post("/api/habits")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Read\",\"description\":\"Twenty minutes\",\"category\":\"Learning\",\"frequency\":\"Daily\",\"targetCount\":1,\"color\":\"emerald\",\"icon\":\"BookOpen\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andReturn().getResponse().getContentAsString();
        JsonNode habit = objectMapper.readTree(habitResponse).path("data");
        long habitId = habit.path("id").asLong();

        mockMvc.perform(post("/api/habits/{id}/complete", habitId).header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.completedToday").value(true));

        mockMvc.perform(get("/api/dashboard").header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.completedToday").value(1));
        mockMvc.perform(get("/api/completions").header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0]").value(habitId));
        mockMvc.perform(get("/api/completions/range")
                        .header("Authorization", authorization)
                        .param("startDate", java.time.LocalDate.now().toString())
                        .param("endDate", java.time.LocalDate.now().toString()))
                .andExpect(status().isOk());
        mockMvc.perform(get("/api/analytics").header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.habitPerformances[0].name").value("Read"));
        mockMvc.perform(get("/api/analytics").header("Authorization", authorization).param("month", "13"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Month must be between 1 and 12"));
        mockMvc.perform(put("/api/profile")
                        .header("Authorization", authorization)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"fullName\":\"Updated User\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.fullName").value("Updated User"));

        mockMvc.perform(delete("/api/habits/{id}", habitId).header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));
    }
}
