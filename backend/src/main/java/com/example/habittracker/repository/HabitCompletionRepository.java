package com.example.habittracker.repository;

import com.example.habittracker.entity.Habit;
import com.example.habittracker.entity.HabitCompletion;
import com.example.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface HabitCompletionRepository extends JpaRepository<HabitCompletion, Long> {
    List<HabitCompletion> findByHabit(Habit habit);
    List<HabitCompletion> findByHabitOrderByCompletionDateAsc(Habit habit);
    Optional<HabitCompletion> findByHabitAndCompletionDate(Habit habit, LocalDate completionDate);
    boolean existsByHabit(Habit habit);
    long deleteByHabit(Habit habit);
    
    // Efficient batch fetching to avoid N+1 queries
    List<HabitCompletion> findByHabit_UserAndCompletionDate(User user, LocalDate completionDate);
    List<HabitCompletion> findByHabit_UserAndCompletionDateBetween(User user, LocalDate startDate, LocalDate endDate);
}
