package pl.najlepszagrupa.budget.service;

import jakarta.transaction.Transactional;
import pl.najlepszagrupa.budget.model.Receipt;
import pl.najlepszagrupa.budget.model.ReceiptItem;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.model.Family;
import pl.najlepszagrupa.budget.repository.ReceiptRepository;
import pl.najlepszagrupa.budget.repository.UserRepository;
import pl.najlepszagrupa.budget.repository.FamilyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FamilyRepository familyRepository;

    public List<Receipt> getReceiptsForUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getFamily() != null) {
            return receiptRepository.findByUsernameOrFamily(username, user.getFamily().getId());
        } else {
            return receiptRepository.findByUser_Username(username);
        }
    }

    @Transactional
    public Receipt saveReceipt(Receipt receipt, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        receipt.setUser(user);

        if (receipt.getIsFamilyExpense()) {
            Family family = user.getFamily();
            if (family == null) throw new RuntimeException("Nie należysz do rodziny!");
            family.setFamilyBalance(family.getFamilyBalance() - receipt.getTotalAmount());
            familyRepository.save(family);
        } else {
            user.setBalance(user.getBalance() - receipt.getTotalAmount());
            userRepository.save(user);
        }

        if (receipt.getItems() != null) {
            receipt.getItems().forEach(item -> item.setReceipt(receipt));
        }
        return receiptRepository.save(receipt);
    }

    public void deleteReceipt(Long id) {
        Receipt receipt = receiptRepository.findById(id).orElse(null);
        if (receipt != null) {
            if (receipt.getIsFamilyExpense() && receipt.getUser().getFamily() != null) {
                Family f = receipt.getUser().getFamily();
                f.setFamilyBalance(f.getFamilyBalance() + receipt.getTotalAmount());
                familyRepository.save(f);
            } else {
                User u = receipt.getUser();
                u.setBalance(u.getBalance() + receipt.getTotalAmount());
                userRepository.save(u);
            }
            receiptRepository.deleteById(id);
        }
    }

    @Transactional
    public Receipt updateReceipt(Long id, Receipt updatedReceipt) {
        Receipt existing = receiptRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paragon nie istnieje"));

        // 1. Cofnij saldo (oddaj pieniądze ze starej kwoty)
        if (existing.getIsFamilyExpense()) {
            Family f = existing.getUser().getFamily();
            if(f != null) {
                f.setFamilyBalance(f.getFamilyBalance() + existing.getTotalAmount());
                familyRepository.save(f);
            }
        } else {
            User u = existing.getUser();
            u.setBalance(u.getBalance() + existing.getTotalAmount());
            userRepository.save(u);
        }

        // 2. Aktualizuj pola nagłówkowe
        existing.setShopName(updatedReceipt.getShopName());
        existing.setDate(updatedReceipt.getDate());
        existing.setCategory(updatedReceipt.getCategory());
        existing.setTotalAmount(updatedReceipt.getTotalAmount());

        // 3. AKTUALIZACJA PRODUKTÓW (To naprawia brak zapisu zmian)
        if (updatedReceipt.getItems() != null) {
            // Czyścimy starą listę (dzięki orphanRemoval=true usunie stare z bazy)
            existing.getItems().clear();

            // Dodajemy nowe
            for (ReceiptItem item : updatedReceipt.getItems()) {
                item.setReceipt(existing); // Wiążemy z paragonem
                existing.getItems().add(item);
            }
        }

        // 4. Odejmij nową kwotę z salda
        if (existing.getIsFamilyExpense()) {
            Family f = existing.getUser().getFamily();
            if(f != null) {
                f.setFamilyBalance(f.getFamilyBalance() - updatedReceipt.getTotalAmount());
                familyRepository.save(f);
            }
        } else {
            User u = existing.getUser();
            u.setBalance(u.getBalance() - updatedReceipt.getTotalAmount());
            userRepository.save(u);
        }

        return receiptRepository.save(existing);
    }
}