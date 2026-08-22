package com.example.habittracker.dto;

public class HabitPerformanceDto {
    private Long id;
    private String name;
    private String category;
    private double completionRate;
    private int currentStreak;
    private int bestStreak;
    private String color;
    private String icon;

    public HabitPerformanceDto() {}

    public HabitPerformanceDto(Long id, String name, String category, double completionRate,
                               int currentStreak, int bestStreak, String color, String icon) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.completionRate = completionRate;
        this.currentStreak = currentStreak;
        this.bestStreak = bestStreak;
        this.color = color;
        this.icon = icon;
    }

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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(double completionRate) {
        this.completionRate = completionRate;
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
