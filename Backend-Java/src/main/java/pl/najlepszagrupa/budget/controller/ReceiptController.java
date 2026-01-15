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

    @GetMapping("/{username}")
    public List<Receipt> getUserReceipts(@PathVariable String username) {
        return receiptService.getReceiptsForUser(username);
    }

    @PostMapping("/{username}")
    public Receipt addReceipt(@RequestBody Receipt receipt, @PathVariable String username) {
        return receiptService.saveReceipt(receipt, username);
    }

    @PutMapping("/{id}")
    public Receipt updateReceipt(@PathVariable Long id, @RequestBody Receipt receipt) {
        return receiptService.updateReceipt(id, receipt);
    }

    @DeleteMapping("/{id}")
    public void deleteReceipt(@PathVariable Long id) {
        receiptService.deleteReceipt(id);
    }
}