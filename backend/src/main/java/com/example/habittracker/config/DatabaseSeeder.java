package com.example.habittracker.config;

import com.example.habittracker.entity.User;
import com.example.habittracker.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private final String stupidPassword;
    private final String idiotPassword;

    public DatabaseSeeder(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.users.stupid.password}") String stupidPassword,
            @Value("${app.users.idiot.password}") String idiotPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.stupidPassword = stupidPassword;
        this.idiotPassword = idiotPassword;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUser("stupid", stupidPassword, "Stupid User");
        seedUser("idiot", idiotPassword, "Idiot User");
    }

    private void seedUser(String username, String rawPassword, String fullName) {
        if (!userRepository.existsByEmail(username)) {
            User user = new User();
            user.setEmail(username);
            user.setPassword(passwordEncoder.encode(rawPassword));
            user.setFullName(fullName);
            userRepository.save(user);
            System.out.println("Seeded user account: " + username);
        } else {
            System.out.println("User account already exists: " + username);
        }
    }
}
