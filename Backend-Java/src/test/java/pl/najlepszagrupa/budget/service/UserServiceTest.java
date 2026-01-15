package pl.najlepszagrupa.budget.service; // Zwróć uwagę na pakiet

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void shouldAddUserSuccessfully() {
        // GIVEN (Przygotowanie danych)
        User user = new User();
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setPassword("password123");

        // Symulujemy, że użytkownika nie ma w bazie
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);
        // Symulujemy hashowanie hasła
        when(passwordEncoder.encode("password123")).thenReturn("zakodowaneHasloXYZ");
        // Symulujemy zapis - zwracamy obiekt, który "próbujemy" zapisać
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN (Wykonanie testowanej metody)
        User created = userService.addUser(user);

        // THEN (Sprawdzenie wyników)
        assertNotNull(created);
        assertEquals("zakodowaneHasloXYZ", created.getPassword()); // Czy hasło zostało zakodowane?
        verify(userRepository).save(any(User.class)); // Czy metoda save została w ogóle wywołana?
    }

    @Test
    void shouldThrowExceptionWhenUsernameExists() {
        // GIVEN
        User user = new User();
        user.setUsername("zajetyLogin");
        user.setPassword("pass");

        // Symulujemy, że taki login już istnieje
        when(userRepository.existsByUsername("zajetyLogin")).thenReturn(true);

        // WHEN & THEN
        // Spodziewamy się błędu (wyjątku)
        assertThrows(RuntimeException.class, () -> userService.addUser(user));

        // Upewniamy się, że repozytorium NIE zapisało nic w bazie
        verify(userRepository, never()).save(any());
    }
}