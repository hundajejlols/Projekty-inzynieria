package pl.najlepszagrupa.budget.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.service.UserService;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // Brak try-catch! Błędy (duplikat, słabe hasło) obsłuży GlobalExceptionHandler
        User created = userService.addUser(user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        if (userService.checkCredentials(username, credentials.get("password"))) {
            return ResponseEntity.ok(Map.of(
                    "message", "Zalogowano",
                    "username", username
            ));
        }
        // Tu ręcznie zwracamy 401, bo checkCredentials zwraca false, a nie rzuca wyjątku
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Błędne dane"));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserData(@PathVariable String username) {
        // Wyjątek "Użytkownik nie istnieje" poleci do GlobalHandlera i zwróci 400
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