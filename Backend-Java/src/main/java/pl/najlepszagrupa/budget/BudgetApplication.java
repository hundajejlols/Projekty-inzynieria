package pl.najlepszagrupa.budget;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import pl.najlepszagrupa.budget.service.CategoryService;

@SpringBootApplication
public class BudgetApplication {
	public static void main(String[] args) {
		SpringApplication.run(BudgetApplication.class, args);
	}

	@Bean
	public CommandLineRunner initCategories(CategoryService categoryService) {
		return args -> {
			categoryService.initializeDefaultCategories();
		};
	}
}
