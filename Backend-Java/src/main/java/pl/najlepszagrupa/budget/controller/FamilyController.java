package pl.najlepszagrupa.budget.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import pl.najlepszagrupa.budget.model.Family;
import pl.najlepszagrupa.budget.service.FamilyService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/family")
@CrossOrigin(origins = "http://localhost:5173")
public class FamilyController {

    private final FamilyService familyService;

    public FamilyController(FamilyService familyService) {
        this.familyService = familyService;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Map<String, String> payload) {
        Family f = familyService.createFamily(payload.get("username"), payload.get("familyName"));
        return ResponseEntity.ok(f);
    }

    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody Map<String, String> payload) {
        Family f = familyService.joinFamily(payload.get("username"), payload.get("code"));
        return ResponseEntity.ok(f);
    }

    @PostMapping("/transfer")
    public ResponseEntity<?> transfer(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        Double amount = Double.valueOf(payload.get("amount").toString());
        familyService.transferToFamily(username, amount);
        return ResponseEntity.ok(Map.of("message", "Przelano środki"));
    }

    @GetMapping("/members/{username}")
    public ResponseEntity<?> getMembers(@PathVariable String username) {
        List<String> members = familyService.getFamilyMembers(username);
        return ResponseEntity.ok(members);
    }
}