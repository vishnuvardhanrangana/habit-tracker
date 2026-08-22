package com.example.habittracker.security;

import com.example.habittracker.exception.BadRequestException;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * A small in-process guard for the public registration endpoint. Deployments
 * with multiple application instances should replace this with a shared
 * gateway or distributed rate limiter.
 */
@Component
public class RegistrationRateLimiter {
    private static final int MAX_ATTEMPTS = 5;
    private static final Duration WINDOW = Duration.ofMinutes(15);

    private final ConcurrentHashMap<String, AttemptWindow> attempts = new ConcurrentHashMap<>();

    public void check(String clientAddress) {
        Instant now = Instant.now();
        AttemptWindow window = attempts.compute(clientAddress, (key, existing) -> {
            if (existing == null || now.isAfter(existing.startedAt.plus(WINDOW))) {
                return new AttemptWindow(now);
            }
            existing.count.incrementAndGet();
            return existing;
        });

        if (window.count.get() > MAX_ATTEMPTS) {
            throw new BadRequestException("Too many registration attempts. Please try again later.");
        }
    }

    private static final class AttemptWindow {
        private final Instant startedAt;
        private final AtomicInteger count = new AtomicInteger(1);

        private AttemptWindow(Instant startedAt) {
            this.startedAt = startedAt;
        }
    }
}
