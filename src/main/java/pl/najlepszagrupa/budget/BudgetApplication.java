package pl.najlepszagrupa.budget;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class BudgetApplication {
	public static void main(String[] args) {SpringApplication.run(BudgetApplication.class, args);}
    @GetMapping("/home")
    public String home() {return "Hello World!";}

}
