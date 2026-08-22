package com.example.habittracker.service;

import com.example.habittracker.dto.AnalyticsResponse;
import com.example.habittracker.dto.AnalyticsResponse.ChartPoint;
import com.example.habittracker.dto.HabitPerformanceDto;
import com.example.habittracker.entity.Habit;
import com.example.habittracker.entity.User;
import com.example.habittracker.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {
    private final HabitRepository habitRepository;
    private final HabitMetricsService metricsService;
    private final UserService userService;

    public AnalyticsService(HabitRepository habitRepository,
                            HabitMetricsService metricsService,
                            UserService userService) {
        this.habitRepository = habitRepository;
        this.metricsService = metricsService;
        this.userService = userService;
    }

    public AnalyticsResponse getAnalyticsData(Integer year, Integer month) {
        User user = userService.getCurrentUserEntity();
        LocalDate today = LocalDate.now();
        int selectedYear = year == null ? today.getYear() : year;
        int selectedMonth = month == null ? today.getMonthValue() : month;
        LocalDate rangeStart = LocalDate.of(selectedYear, selectedMonth, 1);
        LocalDate rangeEnd = rangeStart.withDayOfMonth(rangeStart.lengthOfMonth());
        if (rangeEnd.isAfter(today)) rangeEnd = today;

        List<Habit> habits = habitRepository.findByUser(user);
        if (habits.isEmpty() || rangeEnd.isBefore(rangeStart)) {
            return new AnalyticsResponse(0, 0, Collections.emptyList(), null, null, Collections.emptyList(), Collections.emptyList());
        }

        List<HabitPerformanceDto> performances = new ArrayList<>();
        int completed = 0;
        int expected = 0;
        for (Habit habit : habits) {
            HabitMetricsService.Summary summary = metricsService.summarize(habit, rangeStart, rangeEnd);
            completed += summary.completed;
            expected += summary.expected;
            performances.add(new HabitPerformanceDto(
                    habit.getId(), habit.getName(), habit.getCategory(), summary.rate(),
                    summary.currentStreak, summary.bestStreak, habit.getColor(), habit.getIcon()
            ));
        }

        HabitPerformanceDto best = performances.stream().max(Comparator.comparingDouble(HabitPerformanceDto::getCompletionRate)).orElse(null);
        Set<Long> activeIds = habits.stream().filter(Habit::isActive).map(Habit::getId).collect(Collectors.toSet());
        HabitPerformanceDto lowest = performances.stream()
                .filter(performance -> activeIds.contains(performance.getId()))
                .min(Comparator.comparingDouble(HabitPerformanceDto::getCompletionRate))
                .orElseGet(() -> performances.stream().min(Comparator.comparingDouble(HabitPerformanceDto::getCompletionRate)).orElse(null));

        List<ChartPoint> weekly = dailyChart(habits, today.minusDays(6), today, true);
        List<ChartPoint> monthly = dailyChart(habits, rangeStart, rangeEnd, false);
        return new AnalyticsResponse(expected == 0 ? 0 : Math.min(1.0, (double) completed / expected),
                completed, performances, best, lowest, weekly, monthly);
    }

    private List<ChartPoint> dailyChart(List<Habit> habits, LocalDate start, LocalDate end, boolean weekdayLabels) {
        List<ChartPoint> chart = new ArrayList<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            List<Habit> expected = habits.stream().filter(habit -> metricsService.isActiveOn(habit, date)).collect(Collectors.toList());
            double rate = expected.isEmpty() ? 0 : expected.stream()
                    .mapToDouble(habit -> metricsService.progressForDate(habit, date))
                    .average().orElse(0);
            String label = weekdayLabels
                    ? date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH)
                    : String.valueOf(date.getDayOfMonth());
            chart.add(new ChartPoint(label, date, Math.min(1.0, rate)));
        }
        return chart;
    }
}
