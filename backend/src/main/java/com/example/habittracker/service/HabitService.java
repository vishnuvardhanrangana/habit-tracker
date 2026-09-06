package com.example.habittracker.service;

import com.example.habittracker.dto.HabitRequest;
import com.example.habittracker.dto.HabitResponse;
import com.example.habittracker.entity.Habit;
import com.example.habittracker.entity.HabitCompletion;
import com.example.habittracker.entity.User;
import com.example.habittracker.exception.BadRequestException;
import com.example.habittracker.exception.ResourceNotFoundException;
import com.example.habittracker.repository.HabitCompletionRepository;
import com.example.habittracker.repository.HabitRepository;
import com.example.habittracker.repository.HabitActivePeriodRepository;
import com.example.habittracker.entity.HabitActivePeriod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class HabitService {

    private final HabitRepository habitRepository;
    private final HabitCompletionRepository completionRepository;
    private final HabitActivePeriodRepository activePeriodRepository;
    private final HabitMetricsService metricsService;
    private final UserService userService;

    public HabitService(HabitRepository habitRepository,
                        HabitCompletionRepository completionRepository,
                        HabitActivePeriodRepository activePeriodRepository,
                        HabitMetricsService metricsService,
                        UserService userService) {
        this.habitRepository = habitRepository;
        this.completionRepository = completionRepository;
        this.activePeriodRepository = activePeriodRepository;
        this.metricsService = metricsService;
        this.userService = userService;
    }

    @Transactional
    public HabitResponse createHabit(HabitRequest request) {
        User user = userService.getCurrentUserEntity();

        Habit habit = new Habit();
        habit.setUser(user);
        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setCategory(request.getCategory());
        habit.setFrequency(request.getFrequency());
        habit.setTargetCount(request.getTargetCount());
        habit.setColor(request.getColor());
        habit.setIcon(request.getIcon());
        habit.setActive(true);

        Habit savedHabit = habitRepository.save(habit);
        HabitActivePeriod activePeriod = new HabitActivePeriod();
        activePeriod.setHabit(savedHabit);
        activePeriod.setStartDate(LocalDate.now());
        activePeriodRepository.save(activePeriod);
        return mapToResponse(savedHabit, LocalDate.now());
    }

    @Transactional
    public HabitResponse updateHabit(Long id, HabitRequest request) {
        User user = userService.getCurrentUserEntity();
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id " + id));

        habit.setName(request.getName());
        habit.setDescription(request.getDescription());
        habit.setCategory(request.getCategory());
        habit.setFrequency(request.getFrequency());
        habit.setTargetCount(request.getTargetCount());
        habit.setColor(request.getColor());
        habit.setIcon(request.getIcon());

        Habit updatedHabit = habitRepository.save(habit);
        return mapToResponse(updatedHabit, LocalDate.now());
    }

    @Transactional
    public HabitResponse archiveHabit(Long id, boolean archive) {
        User user = userService.getCurrentUserEntity();
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id " + id));

        if (archive && habit.isActive()) {
            Optional<HabitActivePeriod> openPeriod = activePeriodRepository.findFirstByHabitAndEndDateIsNullOrderByStartDateDesc(habit);
            if (openPeriod.isPresent()) {
                HabitActivePeriod period = openPeriod.get();
                period.setEndDate(LocalDate.now());
                activePeriodRepository.save(period);
            } else {
                HabitActivePeriod period = new HabitActivePeriod();
                period.setHabit(habit);
                LocalDate start = habit.getCreatedAt() != null ? habit.getCreatedAt().toLocalDate() : LocalDate.now();
                period.setStartDate(start);
                period.setEndDate(LocalDate.now());
                activePeriodRepository.save(period);
            }
            habit.setActive(false);
        } else if (!archive && !habit.isActive()) {
            HabitActivePeriod activePeriod = new HabitActivePeriod();
            activePeriod.setHabit(habit);
            activePeriod.setStartDate(LocalDate.now());
            activePeriodRepository.save(activePeriod);
            habit.setActive(true);
        }
        Habit updatedHabit = habitRepository.save(habit);
        return mapToResponse(updatedHabit, LocalDate.now());
    }

    @Transactional
    public void deleteHabit(Long id) {
        User user = userService.getCurrentUserEntity();
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id " + id));
        // Permanent deletion is an explicit, user-confirmed destructive operation.
        // Delete dependent records first rather than using cascade removal, so normal
        // archive/restore operations continue to preserve the habit's history.
        completionRepository.deleteByHabit(habit);
        activePeriodRepository.deleteByHabit(habit);
        habitRepository.delete(habit);
    }

    @Transactional
    public void clearArchivedHabits() {
        User user = userService.getCurrentUserEntity();
        List<Habit> archivedHabits = habitRepository.findByUserAndActive(user, false);
        for (Habit habit : archivedHabits) {
            completionRepository.deleteByHabit(habit);
            activePeriodRepository.deleteByHabit(habit);
        }
        habitRepository.deleteAll(archivedHabits);
    }

    public HabitResponse getHabitById(Long id) {
        User user = userService.getCurrentUserEntity();
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id " + id));
        return mapToResponse(habit, LocalDate.now());
    }

    public List<HabitResponse> getActiveHabits(String category) {
        User user = userService.getCurrentUserEntity();
        List<Habit> habits;
        if (category != null && !category.trim().isEmpty()) {
            habits = habitRepository.findByUserAndActiveAndCategory(user, true, category);
        } else {
            habits = habitRepository.findByUserAndActive(user, true);
        }
        LocalDate today = LocalDate.now();
        return habits.stream()
                .map(habit -> mapToResponse(habit, today))
                .collect(Collectors.toList());
    }

    public List<HabitResponse> getAllHabits() {
        User user = userService.getCurrentUserEntity();
        List<Habit> habits = habitRepository.findByUser(user);
        LocalDate today = LocalDate.now();
        return habits.stream()
                .map(habit -> mapToResponse(habit, today))
                .collect(Collectors.toList());
    }

    public List<Habit> getCurrentUserHabits() {
        return habitRepository.findByUser(userService.getCurrentUserEntity());
    }

    public double getProgressForDate(List<Habit> habits, LocalDate date) {
        List<Habit> expected = habits.stream().filter(habit -> metricsService.isActiveOn(habit, date)).collect(Collectors.toList());
        return expected.isEmpty() ? 0 : expected.stream()
                .mapToDouble(habit -> metricsService.progressForDate(habit, date))
                .average().orElse(0);
    }

    @Transactional
    public HabitResponse completeHabit(Long id, LocalDate date) {
        User user = userService.getCurrentUserEntity();
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id " + id));

        if (!habit.isActive()) {
            throw new BadRequestException("Cannot complete an archived habit");
        }
        if (date.isAfter(LocalDate.now())) {
            throw new BadRequestException("Cannot complete a habit on a future date");
        }
        if (!metricsService.isActiveOn(habit, date)) {
            throw new BadRequestException("Habit was not active on this date");
        }

        Optional<HabitCompletion> existingCompletion = completionRepository.findByHabitAndCompletionDate(habit, date);
        if (existingCompletion.isPresent()) {
            HabitCompletion completion = existingCompletion.get();
            int currentCount = completion.getCompletionCount() == null || completion.getCompletionCount() < 1 ? 1 : completion.getCompletionCount();
            completion.setCompletionCount(currentCount + 1);
            completionRepository.save(completion);
            return mapToResponse(habit, LocalDate.now());
        }

        HabitCompletion completion = new HabitCompletion();
        completion.setHabit(habit);
        completion.setCompletionDate(date);
        completion.setCompleted(true);
        completion.setCompletionCount(1);
        completionRepository.save(completion);

        return mapToResponse(habit, LocalDate.now());
    }

    @Transactional
    public HabitResponse undoCompleteHabit(Long id, LocalDate date) {
        User user = userService.getCurrentUserEntity();
        Habit habit = habitRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id " + id));

        Optional<HabitCompletion> existingCompletion = completionRepository.findByHabitAndCompletionDate(habit, date);
        existingCompletion.ifPresent(completion -> {
            int currentCount = completion.getCompletionCount() == null || completion.getCompletionCount() < 1 ? 1 : completion.getCompletionCount();
            if (currentCount > 1) {
                completion.setCompletionCount(currentCount - 1);
                completionRepository.save(completion);
            } else {
                completionRepository.delete(completion);
            }
        });

        return mapToResponse(habit, LocalDate.now());
    }

    public List<LocalDate> getCompletedDates(Long habitId) {
        User user = userService.getCurrentUserEntity();
        Habit habit = habitRepository.findByIdAndUser(habitId, user)
                .orElseThrow(() -> new ResourceNotFoundException("Habit not found with id " + habitId));

        List<HabitCompletion> completions = completionRepository.findByHabitOrderByCompletionDateAsc(habit);
        return completions.stream()
                .map(HabitCompletion::getCompletionDate)
                .collect(Collectors.toList());
    }

    public HabitResponse mapToResponse(Habit habit, LocalDate today) {
        LocalDate creationDate = habit.getCreatedAt() != null ? habit.getCreatedAt().toLocalDate() : today;
        HabitMetricsService.Summary summary = metricsService.summarize(habit, creationDate, today);

        HabitResponse response = new HabitResponse(
                habit.getId(),
                habit.getName(),
                habit.getDescription(),
                habit.getCategory(),
                habit.getFrequency(),
                habit.getTargetCount(),
                habit.getColor(),
                habit.getIcon(),
                habit.isActive(),
                summary.currentStreak,
                summary.bestStreak,
                summary.currentProgress >= 1,
                summary.rate(),
                habit.getCreatedAt()
        );
        // Additive fields preserve the existing response contract while allowing the
        // current UI and future clients to show multi-count progress.
        response.setCompletedCount(summary.currentCount);
        response.setPeriodProgress(summary.currentProgress);
        return response;
    }

    public static StreakInfo calculateStreaks(List<LocalDate> completedDates, LocalDate today) {
        if (completedDates == null || completedDates.isEmpty()) {
            return new StreakInfo(0, 0);
        }

        List<LocalDate> sortedDates = completedDates.stream()
                .filter(java.util.Objects::nonNull)
                .distinct()
                .sorted()
                .collect(Collectors.toList());

        if (sortedDates.isEmpty()) {
            return new StreakInfo(0, 0);
        }

        int currentStreak = 0;
        int bestStreak = 0;
        int tempStreak = 0;
        LocalDate prevDate = null;

        for (LocalDate date : sortedDates) {
            if (prevDate == null) {
                tempStreak = 1;
            } else {
                long daysBetween = ChronoUnit.DAYS.between(prevDate, date);
                if (daysBetween == 1) {
                    tempStreak++;
                } else if (daysBetween > 1) {
                    if (tempStreak > bestStreak) {
                        bestStreak = tempStreak;
                    }
                    tempStreak = 1;
                }
            }
            prevDate = date;
        }

        if (tempStreak > bestStreak) {
            bestStreak = tempStreak;
        }

        LocalDate lastDate = sortedDates.get(sortedDates.size() - 1);
        if (lastDate.equals(today) || lastDate.equals(today.minusDays(1))) {
            int currentCount = 1;
            LocalDate cursor = lastDate;
            for (int i = sortedDates.size() - 2; i >= 0; i--) {
                LocalDate d = sortedDates.get(i);
                long diff = ChronoUnit.DAYS.between(d, cursor);
                if (diff == 1) {
                    currentCount++;
                    cursor = d;
                } else if (diff > 1) {
                    break;
                }
            }
            currentStreak = currentCount;
        } else {
            currentStreak = 0;
        }

        return new StreakInfo(currentStreak, bestStreak);
    }

    public static class StreakInfo {
        public final int currentStreak;
        public final int bestStreak;

        public StreakInfo(int currentStreak, int bestStreak) {
            this.currentStreak = currentStreak;
            this.bestStreak = bestStreak;
        }
    }
}
