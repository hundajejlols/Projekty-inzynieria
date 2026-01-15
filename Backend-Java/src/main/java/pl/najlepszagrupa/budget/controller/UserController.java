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
import jakarta.validation.Valid;

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
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        User created = userService.addUser(user);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            credentials.get("username"),
                            credentials.get("password")
                    )
            );

            String token = jwtUtils.generateToken(auth.getName());

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "username", auth.getName(),
                    "message", "Zalogowano pomyślnie"
            ));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Błędny login lub hasło"));
        }
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<?> getUserData(@PathVariable String username) {
        User user = userService.findByUsername(username);
        HashMap<String, Object> response = new HashMap<>();
        response.put("balance", user.getBalance());

        if (user.getFamily() != null) {
            Map<String, Object> fam = new HashMap<>();
            fam.put("id", user.getFamily().getId());
            fam.put("name", user.getFamily().getName());
            fam.put("familyBalance", user.getFamily().getFamilyBalance());
            fam.put("joinCode", user.getFamily().getJoinCode());
            fam.put("ownerName", user.getFamily().getOwnerName()); // Dodano właściciela
            response.put("family", fam);
        } else {
            response.put("family", null);
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/user/add-balance")
    public ResponseEntity<?> addBalance(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        Double amount = Double.valueOf(payload.get("amount").toString());
        User updated = userService.addBalance(username, amount);
        return ResponseEntity.ok(Map.of("newBalance", updated.getBalance()));
    }

    @PutMapping("/user/update")
    public ResponseEntity<?> updateUser(@RequestBody Map<String, String> payload) {
        String currentUsername = payload.get("currentUsername");
        String newUsername = payload.get("newUsername");
        String newPassword = payload.get("newPassword");
        String oldPassword = payload.get("oldPassword"); // Nowe pole

        userService.updateUser(currentUsername, newUsername, newPassword, oldPassword);

        return ResponseEntity.ok(Map.of(
                "message", "Dane zaktualizowane",
                "newUsername", newUsername != null ? newUsername : currentUsername
        ));
    }
}