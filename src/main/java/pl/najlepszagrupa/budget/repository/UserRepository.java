package pl.najlepszagrupa.budget.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import pl.najlepszagrupa.budget.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {


}
