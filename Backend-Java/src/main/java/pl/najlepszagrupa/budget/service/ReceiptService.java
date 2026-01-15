package pl.najlepszagrupa.budget.service;

import jakarta.transaction.Transactional;
import pl.najlepszagrupa.budget.model.Receipt;
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
            // Jeśli ma rodzinę: jego paragony + rodzinne paragony innych
            return receiptRepository.findByUsernameOrFamily(username, user.getFamily().getId());
        } else {
            // Jeśli nie ma rodziny: tylko jego paragony
            return receiptRepository.findByUser_Username(username);
        }
    }

    @Transactional
    public Receipt saveReceipt(Receipt receipt, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // --- WAŻNE: PRZYPISANIE UŻYTKOWNIKA DO PARAGONU ---
        receipt.setUser(user);
        // --------------------------------------------------

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
        receiptRepository.deleteById(id);
    }
}