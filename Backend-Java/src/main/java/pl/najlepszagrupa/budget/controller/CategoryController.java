package pl.najlepszagrupa.budget.controller;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:5173")
public class CategoryController {

    @GetMapping
    public List<String> getCategories() {
        return List.of(
                "Zakupy", "Jedzenie", "Transport", "Rozrywka",
                "Dom", "Zdrowie", "Inne", "Edukacja", "Prezenty"
        );
    }
}