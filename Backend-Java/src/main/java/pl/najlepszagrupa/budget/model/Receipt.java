package pl.najlepszagrupa.budget.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.time.LocalDate;
import java.util.List;

@Entity
public class Receipt {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String shopName;
    private Double totalAmount;
    private LocalDate date;
    private String category;

    private boolean isFamilyExpense = false;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    // WAŻNE: orphanRemoval = true pozwala na usuwanie sierot (produktów bez paragonu)
    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JsonManagedReference
    private List<ReceiptItem> items;

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }
    public Double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public List<ReceiptItem> getItems() { return items; }
    public void setItems(List<ReceiptItem> items) { this.items = items; }
    public boolean getIsFamilyExpense() { return isFamilyExpense; }
    public void setIsFamilyExpense(boolean familyExpense) { isFamilyExpense = familyExpense; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}