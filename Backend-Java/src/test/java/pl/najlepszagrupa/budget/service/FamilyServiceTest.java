package pl.najlepszagrupa.budget.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.najlepszagrupa.budget.model.Family;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.FamilyRepository;
import pl.najlepszagrupa.budget.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FamilyServiceTest {

    @Mock
    private FamilyRepository familyRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private FamilyService familyService;

    @Test
    void shouldCreateFamilyAndAssignToUser() {
        // GIVEN
        String username = "jan";
        String familyName = "Kowalscy";

        User user = new User();
        user.setUsername(username);

        // Mockujemy znalezienie użytkownika
        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        // Mockujemy zapis rodziny
        when(familyRepository.save(any(Family.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN
        Family created = familyService.createFamily(username, familyName);

        // THEN
        assertNotNull(created);
        assertEquals(familyName, created.getName());
        assertNotNull(created.getJoinCode()); // Czy kod rodziny się wygenerował?

        // Sprawdzamy czy user został przypisany do tej rodziny
        assertEquals(created, user.getFamily());

        verify(userRepository).save(user); // Czy zaktualizowano usera?
        verify(familyRepository).save(any(Family.class)); // Czy zapisano rodzinę?
    }
}