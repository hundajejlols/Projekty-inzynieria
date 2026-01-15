package pl.najlepszagrupa.budget.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.najlepszagrupa.budget.model.Family;
import java.util.Optional;

public interface FamilyRepository extends JpaRepository<Family, Long> {
    Optional<Family> findByJoinCode(String joinCode);
}