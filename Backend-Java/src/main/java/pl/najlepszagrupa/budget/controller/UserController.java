package pl.najlepszagrupa.budget.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
import pl.najlepszagrupa.budget.config.JwtUtils;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.service.UserService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public UserController(UserService userService, AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User created = userService.addUser(user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            // 1. Spring Security sprawdza hasło (automatycznie używa PasswordEncoder)
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            credentials.get("username"),
                            credentials.get("password")
                    )
            );

            // 2. Jeśli OK -> generujemy token
            String token = jwtUtils.generateToken(auth.getName());

            // 3. Zwracamy token i nazwę użytkownika
            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", auth.getName(),
                    "message", "Zalogowano pomyślnie"
            ));

        } catch (AuthenticationException e) {
            // Jeśli hasło złe -> 401 Unauthorized
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Błędny login lub hasło"));
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserData(@PathVariable String username) {
        User user = userService.findByUsername(username);
        HashMap<String, Object> response = new HashMap<>();
        response.put("balance", user.getBalance());
        response.put("family", user.getFamily());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/add-balance")
    public ResponseEntity<?> addBalance(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        Double amount = Double.valueOf(payload.get("amount").toString());
        User updated = userService.addBalance(username, amount);
        return ResponseEntity.ok(Map.of("newBalance", updated.getBalance()));
    }
}