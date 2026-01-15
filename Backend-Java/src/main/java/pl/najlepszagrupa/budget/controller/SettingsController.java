package pl.najlepszagrupa.budget.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.model.UserSettings;
import pl.najlepszagrupa.budget.repository.UserRepository;
import pl.najlepszagrupa.budget.repository.UserSettingsRepository;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin(origins = "http://localhost:5173")
public class SettingsController {

    private final UserSettingsRepository settingsRepository;
    private final UserRepository userRepository;

    public SettingsController(UserSettingsRepository settingsRepository, UserRepository userRepository) {
        this.settingsRepository = settingsRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getSettings(@PathVariable String username) {
        UserSettings settings = settingsRepository.findByUser_Username(username)
                .orElseGet(() -> {
                    User user = userRepository.findByUsername(username).orElseThrow();
                    UserSettings newSettings = new UserSettings(user);
                    return settingsRepository.save(newSettings);
                });
        return ResponseEntity.ok(settings);
    }

    @PostMapping("/{username}")
    public ResponseEntity<?> updateSettings(@PathVariable String username, @RequestBody UserSettings newSettings) {
        UserSettings settings = settingsRepository.findByUser_Username(username)
                .orElseThrow(() -> new RuntimeException("Brak ustawień"));

        settings.setCurrency(newSettings.getCurrency());
        settings.setDarkTheme(newSettings.isDarkTheme());
        settings.setEmailNotifications(newSettings.isEmailNotifications());

        settingsRepository.save(settings);
        return ResponseEntity.ok(settings);
    }
}