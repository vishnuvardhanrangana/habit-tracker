package com.example.habittracker.service;

import com.example.habittracker.entity.Habit;
import com.example.habittracker.entity.HabitActivePeriod;
import com.example.habittracker.entity.HabitCompletion;
import com.example.habittracker.repository.HabitActivePeriodRepository;
import com.example.habittracker.repository.HabitCompletionRepository;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HabitMetricsService {
    private final HabitCompletionRepository completionRepository;
    private final HabitActivePeriodRepository activePeriodRepository;

    public HabitMetricsService(HabitCompletionRepository completionRepository,
                               HabitActivePeriodRepository activePeriodRepository) {
        this.completionRepository = completionRepository;
        this.activePeriodRepository = activePeriodRepository;
    }

    public boolean isWeekly(Habit habit) {
        return "Weekly".equalsIgnoreCase(habit.getFrequency());
    }

    public LocalDate periodStart(Habit habit, LocalDate date) {
        return isWeekly(habit) ? date.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY)) : date;
    }

    public boolean isActiveOn(Habit habit, LocalDate date) {
        List<HabitActivePeriod> periods = activePeriodRepository.findByHabitOrderByStartDateAsc(habit);
        if (periods.isEmpty()) {
            LocalDate created = habit.getCreatedAt() == null ? date : habit.getCreatedAt().toLocalDate();
            LocalDate end = habit.isActive() ? null : habit.getUpdatedAt().toLocalDate();
            return !date.isBefore(created) && (end == null || !date.isAfter(end));
        }
        return periods.stream().anyMatch(period -> !date.isBefore(period.getStartDate())
                && (period.getEndDate() == null || !date.isAfter(period.getEndDate())));
    }

    public int countForPeriod(Habit habit, List<HabitCompletion> completions, LocalDate periodStart, LocalDate asOf) {
        LocalDate periodEnd = isWeekly(habit) ? periodStart.plusDays(6) : periodStart;
        return completions.stream()
                .filter(completion -> !completion.getCompletionDate().isBefore(periodStart)
                        && !completion.getCompletionDate().isAfter(periodEnd)
                        && !completion.getCompletionDate().isAfter(asOf))
                .mapToInt(completion -> Optional.ofNullable(completion.getCompletionCount()).orElse(1))
                .sum();
    }

    public Summary summarize(Habit habit, LocalDate start, LocalDate end) {
        LocalDate today = LocalDate.now();
        LocalDate boundedEnd = end.isAfter(today) ? today : end;
        if (boundedEnd.isBefore(start)) return new Summary(0, 0, 0, 0, 0, 0);
        List<HabitCompletion> completions = completionRepository.findByHabitOrderByCompletionDateAsc(habit).stream()
                .filter(completion -> !completion.getCompletionDate().isAfter(today))
                .collect(Collectors.toList());
        Set<LocalDate> periods = expectedPeriods(habit, start, boundedEnd);
        int target = habit.getTargetCount();
        int completed = periods.stream().mapToInt(period -> Math.min(target, countForPeriod(habit, completions, period, boundedEnd))).sum();
        int expected = periods.size() * target;
        LocalDate currentStart = periodStart(habit, boundedEnd);
        int currentCount = isActiveOn(habit, boundedEnd) ? countForPeriod(habit, completions, currentStart, boundedEnd) : 0;
        Streak streak = streak(habit, completions, today);
        return new Summary(completed, expected, currentCount, Math.min(1.0, (double) currentCount / target), streak.current, streak.best);
    }

    public double progressForDate(Habit habit, LocalDate date) {
        if (date.isAfter(LocalDate.now()) || !isActiveOn(habit, date)) return 0;
        List<HabitCompletion> completions = completionRepository.findByHabitOrderByCompletionDateAsc(habit);
        return Math.min(1.0, (double) countForPeriod(habit, completions, periodStart(habit, date), date) / habit.getTargetCount());
    }

    public Set<LocalDate> expectedPeriods(Habit habit, LocalDate start, LocalDate end) {
        Set<LocalDate> result = new TreeSet<>();
        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            if (isActiveOn(habit, date)) result.add(periodStart(habit, date));
        }
        return result;
    }

    private Streak streak(Habit habit, List<HabitCompletion> completions, LocalDate today) {
        LocalDate created = habit.getCreatedAt() == null ? today : habit.getCreatedAt().toLocalDate();
        Set<LocalDate> expected = expectedPeriods(habit, created, today);
        if (expected.isEmpty()) return new Streak(0, 0);
        List<LocalDate> successful = expected.stream()
                .filter(period -> countForPeriod(habit, completions, period, today) >= habit.getTargetCount())
                .collect(Collectors.toList());
        if (successful.isEmpty()) return new Streak(0, 0);

        int best = 0;
        int run = 0;
        LocalDate previous = null;
        for (LocalDate period : successful) {
            if (previous != null && period.equals(nextPeriod(habit, previous))) run++;
            else run = 1;
            best = Math.max(best, run);
            previous = period;
        }

        LocalDate latest = successful.get(successful.size() - 1);
        LocalDate allowedLatest = periodStart(habit, today);
        LocalDate priorAllowed = isWeekly(habit) ? allowedLatest.minusWeeks(1) : allowedLatest.minusDays(1);
        if (!latest.equals(allowedLatest) && !latest.equals(priorAllowed)) return new Streak(0, best);

        int current = 1;
        for (int index = successful.size() - 2; index >= 0; index--) {
            if (successful.get(index).equals(nextPreviousPeriod(habit, latest))) {
                current++;
                latest = successful.get(index);
            } else {
                break;
            }
        }
        return new Streak(current, best);
    }

    private LocalDate nextPeriod(Habit habit, LocalDate date) {
        return isWeekly(habit) ? date.plusWeeks(1) : date.plusDays(1);
    }

    private LocalDate nextPreviousPeriod(Habit habit, LocalDate date) {
        return isWeekly(habit) ? date.minusWeeks(1) : date.minusDays(1);
    }

    public static class Summary {
        public final int completed;
        public final int expected;
        public final int currentCount;
        public final double currentProgress;
        public final int currentStreak;
        public final int bestStreak;

        public Summary(int completed, int expected, int currentCount, double currentProgress, int currentStreak, int bestStreak) {
            this.completed = completed;
            this.expected = expected;
            this.currentCount = currentCount;
            this.currentProgress = currentProgress;
            this.currentStreak = currentStreak;
            this.bestStreak = bestStreak;
        }

        public double rate() {
            return expected == 0 ? 0 : Math.min(1.0, (double) completed / expected);
        }
    }

    private static class Streak {
        final int current;
        final int best;
        Streak(int current, int best) { this.current = current; this.best = best; }
    }
}
