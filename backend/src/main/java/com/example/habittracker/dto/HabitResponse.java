package com.example.habittracker.dto;

import java.time.LocalDateTime;

public class HabitResponse {
    private Long id;
    private String name;
    private String description;
    private String category;
    private String frequency;
    private Integer targetCount;
    private String color;
    private String icon;
    private boolean active;
    private int currentStreak;
    private int bestStreak;
    private boolean completedToday;
    private int completedCount;
    private double periodProgress;
    private double completionRate;
    private LocalDateTime createdAt;

    public HabitResponse() {}

    public HabitResponse(Long id, String name, String description, String category, String frequency,
                         Integer targetCount, String color, String icon, boolean active,
                         int currentStreak, int bestStreak, boolean completedToday, double completionRate,
                         LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.category = category;
        this.frequency = frequency;
        this.targetCount = targetCount;
        this.color = color;
        this.icon = icon;
        this.active = active;
        this.currentStreak = currentStreak;
        this.bestStreak = bestStreak;
        this.completedToday = completedToday;
        this.completionRate = completionRate;
        this.createdAt = createdAt;
    }

    public int getCompletedCount() { return completedCount; }
    public void setCompletedCount(int completedCount) { this.completedCount = completedCount; }
    public double getPeriodProgress() { return periodProgress; }
    public void setPeriodProgress(double periodProgress) { this.periodProgress = periodProgress; }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public int getCurrentStreak() {
        return currentStreak;
    }

    public void setCurrentStreak(int currentStreak) {
        this.currentStreak = currentStreak;
    }

    public int getBestStreak() {
        return bestStreak;
    }

    public void setBestStreak(int bestStreak) {
        this.bestStreak = bestStreak;
    }

    public boolean isCompletedToday() {
        return completedToday;
    }

    public void setCompletedToday(boolean completedToday) {
        this.completedToday = completedToday;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
