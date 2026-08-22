package com.example.habittracker.dto;

import java.time.LocalDate;
import java.util.List;

public class AnalyticsResponse {
    private double overallCompletionRate;
    private long totalCompletions;
    private List<HabitPerformanceDto> habitPerformances;
    private HabitPerformanceDto bestPerformingHabit;
    private HabitPerformanceDto needsImprovementHabit;
    private List<ChartPoint> weeklyCompletionChart;
    private List<ChartPoint> monthlyCompletionChart;

    public AnalyticsResponse() {}

    public AnalyticsResponse(double overallCompletionRate, long totalCompletions,
                             List<HabitPerformanceDto> habitPerformances,
                             HabitPerformanceDto bestPerformingHabit,
                             HabitPerformanceDto needsImprovementHabit,
                             List<ChartPoint> weeklyCompletionChart,
                             List<ChartPoint> monthlyCompletionChart) {
        this.overallCompletionRate = overallCompletionRate;
        this.totalCompletions = totalCompletions;
        this.habitPerformances = habitPerformances;
        this.bestPerformingHabit = bestPerformingHabit;
        this.needsImprovementHabit = needsImprovementHabit;
        this.weeklyCompletionChart = weeklyCompletionChart;
        this.monthlyCompletionChart = monthlyCompletionChart;
    }

    public double getOverallCompletionRate() {
        return overallCompletionRate;
    }

    public void setOverallCompletionRate(double overallCompletionRate) {
        this.overallCompletionRate = overallCompletionRate;
    }

    public long getTotalCompletions() {
        return totalCompletions;
    }

    public void setTotalCompletions(long totalCompletions) {
        this.totalCompletions = totalCompletions;
    }

    public List<HabitPerformanceDto> getHabitPerformances() {
        return habitPerformances;
    }

    public void setHabitPerformances(List<HabitPerformanceDto> habitPerformances) {
        this.habitPerformances = habitPerformances;
    }

    public HabitPerformanceDto getBestPerformingHabit() {
        return bestPerformingHabit;
    }

    public void setBestPerformingHabit(HabitPerformanceDto bestPerformingHabit) {
        this.bestPerformingHabit = bestPerformingHabit;
    }

    public HabitPerformanceDto getNeedsImprovementHabit() {
        return needsImprovementHabit;
    }

    public void setNeedsImprovementHabit(HabitPerformanceDto needsImprovementHabit) {
        this.needsImprovementHabit = needsImprovementHabit;
    }

    public List<ChartPoint> getWeeklyCompletionChart() {
        return weeklyCompletionChart;
    }

    public void setWeeklyCompletionChart(List<ChartPoint> weeklyCompletionChart) {
        this.weeklyCompletionChart = weeklyCompletionChart;
    }

    public List<ChartPoint> getMonthlyCompletionChart() {
        return monthlyCompletionChart;
    }

    public void setMonthlyCompletionChart(List<ChartPoint> monthlyCompletionChart) {
        this.monthlyCompletionChart = monthlyCompletionChart;
    }

    public static class ChartPoint {
        private String label;
        private LocalDate date;
        private double value; // Completion percentage (0.0 to 1.0)

        public ChartPoint() {}

        public ChartPoint(String label, LocalDate date, double value) {
            this.label = label;
            this.date = date;
            this.value = value;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public double getValue() {
            return value;
        }

        public void setValue(double value) {
            this.value = value;
        }
    }
}
