package pl.najlepszagrupa.budget.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.najlepszagrupa.budget.model.BudgetLimit;
import pl.najlepszagrupa.budget.model.User;
import java.util.List;
import java.util.Optional;

public interface BudgetLimitRepository extends JpaRepository<BudgetLimit, Long> {
    List<BudgetLimit> findByUser(User user);
    Optional<BudgetLimit> findByUserAndCategory(User user, String category);
}