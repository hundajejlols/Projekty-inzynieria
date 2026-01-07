package pl.najlepszagrupa.budget.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.service.UserService;
import java.util.Map;

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
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Błędne dane"));
    }

    // Endpoint pobierający saldo: GET /api/user/Mateusz
    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserData(@PathVariable String username) {
        try {
            User user = userService.findByUsername(username);
            return ResponseEntity.ok(Map.of("balance", user.getBalance()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Użytkownik nie istnieje"));
        }
    }

    // Endpoint dodający saldo: POST /api/user/add-balance
    @PostMapping("/user/add-balance")
    public ResponseEntity<?> addBalance(@RequestBody Map<String, Object> payload) {
        try {
            String username = (String) payload.get("username");
            Double amount = Double.valueOf(payload.get("amount").toString());
            User updated = userService.addBalance(username, amount);
            return ResponseEntity.ok(Map.of("newBalance", updated.getBalance()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "Nie udało się dodać środków"));
        }
    }
}