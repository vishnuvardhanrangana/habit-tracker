package com.example.habittracker.controller;

import com.example.habittracker.dto.HabitRequest;
import com.example.habittracker.dto.HabitResponse;
import com.example.habittracker.entity.HabitCompletion;
import com.example.habittracker.repository.HabitCompletionRepository;
import com.example.habittracker.service.HabitService;
import com.example.habittracker.service.UserService;
import com.example.habittracker.util.ApiResponse;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class HabitController {

    private final HabitService habitService;
    private final UserService userService;
    private final HabitCompletionRepository completionRepository;

    public HabitController(HabitService habitService,
                           UserService userService,
                           HabitCompletionRepository completionRepository) {
        this.habitService = habitService;
        this.userService = userService;
        this.completionRepository = completionRepository;
    }

    @GetMapping("/habits")
    public ResponseEntity<ApiResponse<List<HabitResponse>>> getActiveHabits(
            @RequestParam(required = false) String category,
            @RequestParam(required = false, defaultValue = "false") boolean includeArchived) {
        List<HabitResponse> habits;
        if (includeArchived) {
            habits = habitService.getAllHabits();
        } else {
            habits = habitService.getActiveHabits(category);
        }
        ApiResponse<List<HabitResponse>> response = new ApiResponse<>(true, "Habits retrieved successfully", habits);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/habits")
    public ResponseEntity<ApiResponse<HabitResponse>> createHabit(@Valid @RequestBody HabitRequest request) {
        HabitResponse createdHabit = habitService.createHabit(request);
        ApiResponse<HabitResponse> response = new ApiResponse<>(true, "Habit created successfully", createdHabit);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/habits/{id}")
    public ResponseEntity<ApiResponse<HabitResponse>> getHabitById(@PathVariable Long id) {
        HabitResponse habit = habitService.getHabitById(id);
        ApiResponse<HabitResponse> response = new ApiResponse<>(true, "Habit retrieved successfully", habit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/habits/{id}")
    public ResponseEntity<ApiResponse<HabitResponse>> updateHabit(@PathVariable Long id, @Valid @RequestBody HabitRequest request) {
        HabitResponse updatedHabit = habitService.updateHabit(id, request);
        ApiResponse<HabitResponse> response = new ApiResponse<>(true, "Habit updated successfully", updatedHabit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/habits/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteHabit(@PathVariable Long id) {
        habitService.deleteHabit(id);
        ApiResponse<Void> response = new ApiResponse<>(true, "Habit deleted permanently");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/habits/archived")
    public ResponseEntity<ApiResponse<Void>> clearArchivedHabits() {
        habitService.clearArchivedHabits();
        ApiResponse<Void> response = new ApiResponse<>(true, "All archived habits cleared permanently");
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/habits/{id}/archive")
    public ResponseEntity<ApiResponse<HabitResponse>> archiveHabit(
            @PathVariable Long id,
            @RequestParam(defaultValue = "true") boolean archive) {
        HabitResponse archivedHabit = habitService.archiveHabit(id, archive);
        String msg = archive ? "Habit archived successfully" : "Habit restored successfully";
        ApiResponse<HabitResponse> response = new ApiResponse<>(true, msg, archivedHabit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/habits/{id}/complete")
    public ResponseEntity<ApiResponse<HabitResponse>> completeHabit(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate completionDate = (date != null) ? date : LocalDate.now();
        HabitResponse responseHabit = habitService.completeHabit(id, completionDate);
        ApiResponse<HabitResponse> response = new ApiResponse<>(true, "Habit completed successfully", responseHabit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/habits/{id}/complete")
    public ResponseEntity<ApiResponse<HabitResponse>> undoCompleteHabit(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate completionDate = (date != null) ? date : LocalDate.now();
        HabitResponse responseHabit = habitService.undoCompleteHabit(id, completionDate);
        ApiResponse<HabitResponse> response = new ApiResponse<>(true, "Habit completion undone successfully", responseHabit);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/habits/{id}/completions")
    public ResponseEntity<ApiResponse<List<LocalDate>>> getCompletions(@PathVariable Long id) {
        List<LocalDate> dates = habitService.getCompletedDates(id);
        ApiResponse<List<LocalDate>> response = new ApiResponse<>(true, "Completed dates retrieved", dates);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/completions")
    public ResponseEntity<ApiResponse<List<Long>>> getCompletionsByDate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        LocalDate targetDate = (date != null) ? date : LocalDate.now();
        List<HabitCompletion> completions = completionRepository.findByHabit_UserAndCompletionDate(
                userService.getCurrentUserEntity(), targetDate);
        
        List<Long> completedHabitIds = completions.stream()
                .map(c -> c.getHabit().getId())
                .collect(Collectors.toList());

        ApiResponse<List<Long>> response = new ApiResponse<>(true, "Completions for date retrieved", completedHabitIds);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/completions/range")
    public ResponseEntity<ApiResponse<Map<LocalDate, List<Long>>>> getCompletionsByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<HabitCompletion> completions = completionRepository.findByHabit_UserAndCompletionDateBetween(
                userService.getCurrentUserEntity(), startDate, endDate);

        Map<LocalDate, List<Long>> groupedCompletions = completions.stream()
                .collect(Collectors.groupingBy(
                        HabitCompletion::getCompletionDate,
                        Collectors.mapping(c -> c.getHabit().getId(), Collectors.toList())
                ));

        ApiResponse<Map<LocalDate, List<Long>>> response = new ApiResponse<>(true, "Range completions retrieved", groupedCompletions);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/completions/range/details")
    public ResponseEntity<ApiResponse<Map<LocalDate, Map<Long, Integer>>>> getCompletionCountsByRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        validateDateRange(startDate, endDate);
        Map<LocalDate, Map<Long, Integer>> result = completionRepository
                .findByHabit_UserAndCompletionDateBetween(userService.getCurrentUserEntity(), startDate, endDate)
                .stream().collect(Collectors.groupingBy(HabitCompletion::getCompletionDate,
                        Collectors.toMap(completion -> completion.getHabit().getId(),
                                completion -> completion.getCompletionCount() == null ? 1 : completion.getCompletionCount())));
        return ResponseEntity.ok(new ApiResponse<>(true, "Completion counts retrieved", result));
    }

    @GetMapping("/calendar/progress")
    public ResponseEntity<ApiResponse<Map<LocalDate, Double>>> getCalendarProgress(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        validateDateRange(startDate, endDate);
        Map<LocalDate, Double> progress = new java.util.LinkedHashMap<>();
        List<com.example.habittracker.entity.Habit> habits = habitService.getCurrentUserHabits();
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            progress.put(date, habitService.getProgressForDate(habits, date));
        }
        return ResponseEntity.ok(new ApiResponse<>(true, "Calendar progress retrieved", progress));
    }

    private void validateDateRange(LocalDate startDate, LocalDate endDate) {
        if (endDate.isBefore(startDate)) {
            throw new com.example.habittracker.exception.BadRequestException("End date must not be before start date");
        }
        if (startDate.plusDays(366).isBefore(endDate)) {
            throw new com.example.habittracker.exception.BadRequestException("Date range must not exceed 366 days");
        }
    }
}
