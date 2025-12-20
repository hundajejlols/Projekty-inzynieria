package pl.najlepszagrupa.budget.controller;

import pl.najlepszagrupa.budget.model.Receipt;
import pl.najlepszagrupa.budget.service.ReceiptService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/receipts")
@CrossOrigin(origins = "http://localhost:5173")
public class ReceiptController {

    @Autowired
    private ReceiptService receiptService;

    @GetMapping
    public List<Receipt> getAll() {
        return receiptService.getAllReceipts();
    }

    @PostMapping
    public Receipt addReceipt(@RequestBody Receipt receipt) {
        return receiptService.saveReceipt(receipt);
    }

    @DeleteMapping("/{id}")
    public void deleteReceipt(@PathVariable Long id) {
        receiptService.deleteReceipt(id);
    }
}