package pl.najlepszagrupa.budget.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.najlepszagrupa.budget.model.BudgetLimit;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.BudgetLimitRepository;
import pl.najlepszagrupa.budget.repository.UserRepository;

import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/limits")
@CrossOrigin(origins = "http://localhost:5173")
public class LimitController {

    private final BudgetLimitRepository limitRepository;
    private final UserRepository userRepository;

    public LimitController(BudgetLimitRepository limitRepository, UserRepository userRepository) {
        this.limitRepository = limitRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserLimits(@PathVariable String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Double> limitsMap = limitRepository.findByUser(user).stream()
                .collect(Collectors.toMap(BudgetLimit::getCategory, BudgetLimit::getLimitAmount));

        return ResponseEntity.ok(limitsMap);
    }

    @PostMapping("/{username}")
    public ResponseEntity<?> updateLimit(@PathVariable String username, @RequestBody Map<String, Object> payload) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String category = (String) payload.get("category");
        Double amount = Double.valueOf(payload.get("limit").toString());

        BudgetLimit limit = limitRepository.findByUserAndCategory(user, category)
                .orElse(new BudgetLimit(category, amount, user));

        limit.setLimitAmount(amount);
        limitRepository.save(limit);

        return ResponseEntity.ok(Map.of("message", "Limit zaktualizowany"));
    }
}