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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("Użytkownik nie znaleziony: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                new ArrayList<>()
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
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User addBalance(String username, Double amount) {
        User user = findByUsername(username);
        user.setBalance(user.getBalance() + amount);
        return userRepository.save(user);
    }

    // --- ZMIENIONA METODA ---
    public void updateUser(String currentUsername, String newUsername, String newPassword, String oldPassword) {
        User user = findByUsername(currentUsername);

        // Zmiana nazwy użytkownika
        if (newUsername != null && !newUsername.isEmpty() && !newUsername.equals(currentUsername)) {
            if (userRepository.existsByUsername(newUsername)) {
                throw new RuntimeException("Nazwa użytkownika jest już zajęta!");
            }
            user.setUsername(newUsername);
        }

        // Zmiana hasła (wymaga podania starego)
        if (newPassword != null && !newPassword.isEmpty()) {
            if (oldPassword == null || oldPassword.isEmpty()) {
                throw new RuntimeException("Musisz podać stare hasło, aby ustawić nowe.");
            }
            // Sprawdź czy stare hasło pasuje do hasha w bazie
            if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
                throw new RuntimeException("Stare hasło jest nieprawidłowe!");
            }
            if (newPassword.length() < 8) {
                throw new RuntimeException("Nowe hasło musi mieć min. 8 znaków!");
            }
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        userRepository.save(user);
    }
}