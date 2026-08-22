package com.example.habittracker.service;

import com.example.habittracker.dto.DashboardResponse;
import com.example.habittracker.dto.DashboardResponse.DayProgress;
import com.example.habittracker.dto.HabitResponse;
import com.example.habittracker.entity.Habit;
import com.example.habittracker.entity.HabitCompletion;
import com.example.habittracker.entity.User;
import com.example.habittracker.repository.HabitCompletionRepository;
import com.example.habittracker.repository.HabitRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository completionRepository;
    private final HabitService habitService;
    private final HabitMetricsService metricsService;
    private final UserService userService;

    public DashboardService(HabitRepository habitRepository,
                            HabitCompletionRepository completionRepository,
                            HabitService habitService,
                            HabitMetricsService metricsService,
                            UserService userService) {
        this.habitRepository = habitRepository;
        this.completionRepository = completionRepository;
        this.habitService = habitService;
        this.metricsService = metricsService;
        this.userService = userService;
    }

    public DashboardResponse getDashboardData() {
        User user = userService.getCurrentUserEntity();
        LocalDate today = LocalDate.now();

        // 1. Fetch active habits
        List<Habit> activeHabits = habitRepository.findByUserAndActive(user, true);
        List<HabitResponse> habitResponses = activeHabits.stream()
                .map(h -> habitService.mapToResponse(h, today))
                .collect(Collectors.toList());

        int totalToday = habitResponses.size();
        int completedToday = (int) habitResponses.stream()
                .filter(HabitResponse::isCompletedToday)
                .count();

        double progressToday = totalToday > 0 ? habitResponses.stream()
                .mapToDouble(HabitResponse::getPeriodProgress)
                .average().orElse(0.0) : 0.0;

        // Streaks
        int maxCurrentStreak = habitResponses.stream()
                .mapToInt(HabitResponse::getCurrentStreak)
                .max()
                .orElse(0);

        int maxBestStreak = habitResponses.stream()
                .mapToInt(HabitResponse::getBestStreak)
                .max()
                .orElse(0);

        // 2. Fetch total completions across ALL user habits (active & archived)
        List<Habit> allHabits = habitRepository.findByUser(user);
        long totalCompletions = allHabits.stream()
                .flatMap(h -> completionRepository.findByHabit(h).stream())
                .filter(c -> !c.getCompletionDate().isAfter(today))
                .mapToLong(c -> c.getCompletionCount() == null ? 1 : c.getCompletionCount())
                .sum();

        // 3. Weekly overview (last 7 days)
        LocalDate startDate = today.minusDays(6);
        List<HabitCompletion> weeklyCompletions = completionRepository
                .findByHabit_UserAndCompletionDateBetween(user, startDate, today);

        List<DayProgress> weeklyOverview = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dayName = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.ENGLISH);
            List<Habit> habitsExpectedThatDay = allHabits.stream()
                    .filter(habit -> metricsService.isActiveOn(habit, date))
                    .collect(Collectors.toList());
            double rate = habitsExpectedThatDay.isEmpty() ? 0.0 : habitsExpectedThatDay.stream()
                    .mapToDouble(habit -> metricsService.progressForDate(habit, date))
                    .average().orElse(0.0);
            weeklyOverview.add(new DayProgress(dayName, date, rate));
        }

        return new DashboardResponse(
                completedToday,
                totalToday,
                progressToday,
                maxCurrentStreak,
                maxBestStreak,
                totalCompletions,
                weeklyOverview
        );
    }
}
