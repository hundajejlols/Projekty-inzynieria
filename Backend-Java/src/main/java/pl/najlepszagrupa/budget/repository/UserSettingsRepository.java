package pl.najlepszagrupa.budget.repository;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.najlepszagrupa.budget.model.UserSettings;
import java.util.Optional;

public interface UserSettingsRepository extends JpaRepository<UserSettings, Long> {
    Optional<UserSettings> findByUser_Username(String username);
}