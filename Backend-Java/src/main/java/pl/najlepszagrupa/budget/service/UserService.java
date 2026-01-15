package pl.najlepszagrupa.budget.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));
    }

    public User addUser(User user) {
        // WALIDACJA DANYCH
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Nazwa użytkownika nie może być pusta!");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Ta nazwa użytkownika jest już zajęta!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Ten email jest już używany!");
        }
        // POPRAWKA: Wymuszamy minimum 8 znaków
        if (user.getPassword() == null || user.getPassword().length() < 8) {
            throw new RuntimeException("Hasło musi mieć co najmniej 8 znaków!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public boolean checkCredentials(String username, String password) {
        return userRepository.findByUsername(username)
                .map(user -> passwordEncoder.matches(password, user.getPassword()))
                .orElse(false);
    }

    // Dodawanie wypłaty
    public User addBalance(String username, Double amount) {
        User user = findByUsername(username);
        user.setBalance(user.getBalance() + amount);
        return userRepository.save(user);
    }

    // Odejmowanie przy zakupach
    public void deductBalance(String username, Double amount) {
        User user = findByUsername(username);
        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);
    }
}