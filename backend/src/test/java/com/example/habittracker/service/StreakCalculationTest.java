package com.example.habittracker.service;

import org.junit.jupiter.api.Test;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class StreakCalculationTest {

    @Test
    public void testEmptyCompletions() {
        LocalDate today = LocalDate.of(2026, 8, 21);
        HabitService.StreakInfo streak = HabitService.calculateStreaks(Collections.emptyList(), today);
        assertEquals(0, streak.currentStreak);
        assertEquals(0, streak.bestStreak);
    }

    @Test
    public void testConsecutiveEndingToday() {
        LocalDate today = LocalDate.of(2026, 8, 21);
        List<LocalDate> dates = Arrays.asList(
                today.minusDays(2),
                today.minusDays(1),
                today
        );
        HabitService.StreakInfo streak = HabitService.calculateStreaks(dates, today);
        assertEquals(3, streak.currentStreak);
        assertEquals(3, streak.bestStreak);
    }

    @Test
    public void testConsecutiveEndingYesterday() {
        LocalDate today = LocalDate.of(2026, 8, 21);
        List<LocalDate> dates = Arrays.asList(
                today.minusDays(3),
                today.minusDays(2),
                today.minusDays(1)
        );
        HabitService.StreakInfo streak = HabitService.calculateStreaks(dates, today);
        assertEquals(3, streak.currentStreak);
        assertEquals(3, streak.bestStreak);
    }

    @Test
    public void testBrokenStreakEndingTwoDaysAgo() {
        LocalDate today = LocalDate.of(2026, 8, 21);
        List<LocalDate> dates = Arrays.asList(
                today.minusDays(4),
                today.minusDays(3),
                today.minusDays(2)
        );
        HabitService.StreakInfo streak = HabitService.calculateStreaks(dates, today);
        assertEquals(0, streak.currentStreak);
        assertEquals(3, streak.bestStreak);
    }

    @Test
    public void testGapsInHistory() {
        LocalDate today = LocalDate.of(2026, 8, 21);
        List<LocalDate> dates = Arrays.asList(
                today.minusDays(6),
                today.minusDays(5),
                today.minusDays(4), // Streak of 3
                today.minusDays(2),
                today.minusDays(1)  // Streak of 2 ending yesterday
        );
        HabitService.StreakInfo streak = HabitService.calculateStreaks(dates, today);
        assertEquals(2, streak.currentStreak);
        assertEquals(3, streak.bestStreak);
    }

    @Test
    public void testSingleCompletionToday() {
        LocalDate today = LocalDate.of(2026, 8, 21);
        List<LocalDate> dates = Collections.singletonList(today);
        HabitService.StreakInfo streak = HabitService.calculateStreaks(dates, today);
        assertEquals(1, streak.currentStreak);
        assertEquals(1, streak.bestStreak);
    }

    @Test
    public void testSingleCompletionYesterday() {
        LocalDate today = LocalDate.of(2026, 8, 21);
        List<LocalDate> dates = Collections.singletonList(today.minusDays(1));
        HabitService.StreakInfo streak = HabitService.calculateStreaks(dates, today);
        assertEquals(1, streak.currentStreak);
        assertEquals(1, streak.bestStreak);
    }
}
