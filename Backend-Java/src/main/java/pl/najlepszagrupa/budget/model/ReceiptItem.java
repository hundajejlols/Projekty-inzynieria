package pl.najlepszagrupa.budget.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class ReceiptItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String productName;
    private Double price;

    // Powiązanie z paragonem
    // JsonBackReference zatrzymuje pętlę generowania JSON
    @ManyToOne
    @JoinColumn(name = "receipt_id")
    @JsonBackReference
    private Receipt receipt;

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public Receipt getReceipt() { return receipt; }
    public void setReceipt(Receipt receipt) { this.receipt = receipt; }
}