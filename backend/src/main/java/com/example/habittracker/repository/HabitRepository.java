package com.example.habittracker.repository;

import com.example.habittracker.entity.Habit;
import com.example.habittracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HabitRepository extends JpaRepository<Habit, Long> {
    List<Habit> findByUser(User user);
    List<Habit> findByUserAndActive(User user, boolean active);
    List<Habit> findByUserAndActiveAndCategory(User user, boolean active, String category);
    Optional<Habit> findByIdAndUser(Long id, User user);
}
