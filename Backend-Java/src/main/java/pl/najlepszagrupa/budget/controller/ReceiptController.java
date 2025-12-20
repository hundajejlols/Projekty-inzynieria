package pl.najlepszagrupa.budget.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import pl.najlepszagrupa.budget.model.Receipt;
import pl.najlepszagrupa.budget.service.ReceiptService;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    // Pobiera wszystkie paragony (razem z produktami dzięki JPA)
    @GetMapping
    public List<Receipt> getAll() {
        return receiptService.getAllReceipts();
    }

    // Dodaje nowy paragon
    @PostMapping
    public Receipt addReceipt(@RequestBody Receipt receipt) {
        return receiptService.saveReceipt(receipt);
    }
}