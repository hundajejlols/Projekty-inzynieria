package pl.najlepszagrupa.budget.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import pl.najlepszagrupa.budget.model.Receipt;
import pl.najlepszagrupa.budget.repository.ReceiptRepository;

import java.util.List;

@Service
public class ReceiptService {

    @Autowired
    private ReceiptRepository receiptRepository;

    public List<Receipt> getAllReceipts() {
        return receiptRepository.findAll();
    }

    public Receipt saveReceipt(Receipt receipt) {
        // Ważne: przy dwukierunkowej relacji musimy ustawić referencję w każdym produkcie
        if (receipt.getItems() != null) {
            receipt.getItems().forEach(item -> item.setReceipt(receipt));
        }
        return receiptRepository.save(receipt);
    }
}