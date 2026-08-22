package com.example.habittracker.repository;

import com.example.habittracker.entity.Habit;
import com.example.habittracker.entity.HabitActivePeriod;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface HabitActivePeriodRepository extends JpaRepository<HabitActivePeriod, Long> {
    List<HabitActivePeriod> findByHabitOrderByStartDateAsc(Habit habit);
    Optional<HabitActivePeriod> findFirstByHabitAndEndDateIsNullOrderByStartDateDesc(Habit habit);
    long deleteByHabit(Habit habit);
}
