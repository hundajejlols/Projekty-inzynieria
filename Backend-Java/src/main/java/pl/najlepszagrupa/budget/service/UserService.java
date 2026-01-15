package pl.najlepszagrupa.budget.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.UserRepository;

import java.util.ArrayList;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // --- Metoda wymagana przez Spring Security (UserDetailsService) ---
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Użytkownik nie znaleziony: " + username));

        // Zwracamy obiekt UserDetails Springa (uproszczony, bez ról)
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>() // brak ról
        );
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Użytkownik nie istnieje"));
    }

    public User addUser(User user) {
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Nazwa użytkownika nie może być pusta!");
        }
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Ta nazwa użytkownika jest już zajęta!");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Ten email jest już używany!");
        }
        if (user.getPassword() == null || user.getPassword().length() < 8) {
            throw new RuntimeException("Hasło musi mieć co najmniej 8 znaków!");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    // Metoda checkCredentials nie jest już potrzebna przy JWT (AuthenticationManager to robi)

    public User addBalance(String username, Double amount) {
        User user = findByUsername(username);
        user.setBalance(user.getBalance() + amount);
        return userRepository.save(user);
    }

    public void deductBalance(String username, Double amount) {
        User user = findByUsername(username);
        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);
    }
}