package pl.najlepszagrupa.budget.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import pl.najlepszagrupa.budget.model.Family;
import pl.najlepszagrupa.budget.model.Receipt;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.FamilyRepository;
import pl.najlepszagrupa.budget.repository.ReceiptRepository;
import pl.najlepszagrupa.budget.repository.UserRepository;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ReceiptServiceTest {

    @Mock
    private ReceiptRepository receiptRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private FamilyRepository familyRepository;

    @InjectMocks
    private ReceiptService receiptService;

    @Test
    void shouldDeductFromUserBalanceWhenPersonalExpense() {
        // GIVEN
        User user = new User();
        user.setUsername("jan");
        user.setBalance(1000.0); // Startowe saldo: 1000 PLN

        Receipt receipt = new Receipt();
        receipt.setTotalAmount(200.0); // Wydajemy 200 PLN
        receipt.setIsFamilyExpense(false); // Wydatek osobisty

        when(userRepository.findByUsername("jan")).thenReturn(Optional.of(user));
        when(receiptRepository.save(any(Receipt.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN
        receiptService.saveReceipt(receipt, "jan");

        // THEN
        assertEquals(800.0, user.getBalance()); // 1000 - 200 = 800
        verify(userRepository).save(user); // Czy zaktualizowano usera?
    }

    @Test
    void shouldDeductFromFamilyBalanceWhenFamilyExpense() {
        // GIVEN
        Family family = new Family();
        family.setId(1L);
        family.setFamilyBalance(5000.0); // Saldo rodziny: 5000 PLN

        User user = new User();
        user.setUsername("anna");
        user.setFamily(family); // Anna należy do rodziny

        Receipt receipt = new Receipt();
        receipt.setTotalAmount(500.0); // Wydajemy 500 PLN
        receipt.setIsFamilyExpense(true); // To wydatek rodzinny!

        when(userRepository.findByUsername("anna")).thenReturn(Optional.of(user));
        when(receiptRepository.save(any(Receipt.class))).thenAnswer(i -> i.getArguments()[0]);

        // WHEN
        receiptService.saveReceipt(receipt, "anna");

        // THEN
        assertEquals(4500.0, family.getFamilyBalance()); // 5000 - 500 = 4500
        verify(familyRepository).save(family); // Czy zaktualizowano rodzinę?
    }
}