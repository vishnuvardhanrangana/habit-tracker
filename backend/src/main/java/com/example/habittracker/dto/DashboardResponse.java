package com.example.habittracker.dto;

import java.time.LocalDate;
import java.util.List;

public class DashboardResponse {
    private int completedToday;
    private int totalToday;
    private double progressToday;
    private int currentStreak;
    private int bestStreak;
    private long totalCompletions;
    private List<DayProgress> weeklyOverview;

    public DashboardResponse() {}

    public DashboardResponse(int completedToday, int totalToday, double progressToday,
                             int currentStreak, int bestStreak, long totalCompletions,
                             List<DayProgress> weeklyOverview) {
        this.completedToday = completedToday;
        this.totalToday = totalToday;
        this.progressToday = progressToday;
        this.currentStreak = currentStreak;
        this.bestStreak = bestStreak;
        this.totalCompletions = totalCompletions;
        this.weeklyOverview = weeklyOverview;
    }

    public int getCompletedToday() {
        return completedToday;
    }

    public void setCompletedToday(int completedToday) {
        this.completedToday = completedToday;
    }

    public int getTotalToday() {
        return totalToday;
    }

    public void setTotalToday(int totalToday) {
        this.totalToday = totalToday;
    }

    public double getProgressToday() {
        return progressToday;
    }

    public void setProgressToday(double progressToday) {
        this.progressToday = progressToday;
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

    public long getTotalCompletions() {
        return totalCompletions;
    }

    public void setTotalCompletions(long totalCompletions) {
        this.totalCompletions = totalCompletions;
    }

    public List<DayProgress> getWeeklyOverview() {
        return weeklyOverview;
    }

    public void setWeeklyOverview(List<DayProgress> weeklyOverview) {
        this.weeklyOverview = weeklyOverview;
    }

    public static class DayProgress {
        private String dayName;
        private LocalDate date;
        private double completionRate;

        public DayProgress() {}

        public DayProgress(String dayName, LocalDate date, double completionRate) {
            this.dayName = dayName;
            this.date = date;
            this.completionRate = completionRate;
        }

        public String getDayName() {
            return dayName;
        }

        public void setDayName(String dayName) {
            this.dayName = dayName;
        }

        public LocalDate getDate() {
            return date;
        }

        public void setDate(LocalDate date) {
            this.date = date;
        }

        public double getCompletionRate() {
            return completionRate;
        }

        public void setCompletionRate(double completionRate) {
            this.completionRate = completionRate;
        }
    }
}
