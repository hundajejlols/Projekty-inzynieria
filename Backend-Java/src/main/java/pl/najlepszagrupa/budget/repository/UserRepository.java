package pl.najlepszagrupa.budget.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.najlepszagrupa.budget.model.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email); // <--- NOWA METODA

    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}