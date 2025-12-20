package pl.najlepszagrupa.budget.service;

import pl.najlepszagrupa.budget.model.Receipt;
import pl.najlepszagrupa.budget.repository.ReceiptRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    public List<Receipt> getAllReceipts() {
        return receiptRepository.findAll();
    }

    public Receipt saveReceipt(Receipt receipt) {
        if (receipt.getItems() != null) {
            receipt.getItems().forEach(item -> item.setReceipt(receipt));
        }
        return receiptRepository.save(receipt);
    }

    public void deleteReceipt(Long id) {
        receiptRepository.deleteById(id);
    }
}