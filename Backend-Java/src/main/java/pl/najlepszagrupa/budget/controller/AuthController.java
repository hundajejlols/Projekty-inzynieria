package pl.najlepszagrupa.budget.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import pl.najlepszagrupa.budget.model.PasswordResetToken;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.PasswordResetTokenRepository;
import pl.najlepszagrupa.budget.repository.UserRepository;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordResetTokenRepository tokenRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/forgot-password")
    @Transactional
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika z tym emailem."));

        tokenRepository.deleteByUser_Id(user.getId());

        PasswordResetToken token = new PasswordResetToken(user);
        tokenRepository.save(token);

        // SYMULACJA WYSYŁKI EMAILA
        System.out.println("==========================================");
        System.out.println("LINK RESETUJĄCY DLA " + email + ":");
        System.out.println("Token: " + token.getToken());
        System.out.println("==========================================");

        return ResponseEntity.ok(Map.of("message", "Link resetujący został wysłany (sprawdź konsolę serwera!)"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String tokenStr = payload.get("token");
        String newPassword = payload.get("password");

        PasswordResetToken token = tokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Nieprawidłowy token."));

        if (token.isExpired()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token wygasł."));
        }

        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        tokenRepository.delete(token);

        return ResponseEntity.ok(Map.of("message", "Hasło zostało zmienione. Zaloguj się."));
    }
}