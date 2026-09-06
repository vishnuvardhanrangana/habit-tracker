package com.example.habittracker.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class HabitRequest {

    @NotBlank(message = "Habit name is required")
    @Size(max = 100, message = "Habit name must not exceed 100 characters")
    private String name;

    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    private String description;

    @NotBlank(message = "Category is required")
    @Pattern(regexp = "^(Study|Health|Fitness|Personal|Work|Learning|Other)$", message = "Invalid category")
    private String category;

    @NotBlank(message = "Frequency is required")
    @Pattern(regexp = "^(Daily|Weekly|Custom)$", message = "Frequency must be Daily, Weekly, or Custom")
    private String frequency; // Daily, Weekly, Custom

    @NotNull(message = "Target count is required")
    @Min(value = 1, message = "Target count must be at least 1")
    @Max(value = 100, message = "Target count must not exceed 100")
    private Integer targetCount;

    @NotBlank(message = "Color is required")
    @Size(max = 50, message = "Color must not exceed 50 characters")
    private String color;

    @NotBlank(message = "Icon is required")
    @Size(max = 50, message = "Icon must not exceed 50 characters")
    private String icon;

    public HabitRequest() {}

    public HabitRequest(String name, String description, String category, String frequency, Integer targetCount, String color, String icon) {
        this.name = name;
        this.description = description;
        this.category = category;
        this.frequency = frequency;
        this.targetCount = targetCount;
        this.color = color;
        this.icon = icon;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getFrequency() {
        return frequency;
    }

    public void setFrequency(String frequency) {
        this.frequency = frequency;
    }

    public Integer getTargetCount() {
        return targetCount;
    }

    public void setTargetCount(Integer targetCount) {
        this.targetCount = targetCount;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }
}
