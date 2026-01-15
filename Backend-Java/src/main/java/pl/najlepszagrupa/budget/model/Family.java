package pl.najlepszagrupa.budget.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import java.util.UUID;

@Entity
public class Family {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private Double familyBalance = 0.0;
    private String joinCode;

    @OneToOne
    @JoinColumn(name = "owner_id")
    @JsonIgnore
    private User owner;

    @OneToMany(mappedBy = "family", fetch = FetchType.EAGER)
    @JsonIgnore
    private List<User> members;

    public Family() {
        this.joinCode = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getFamilyBalance() { return familyBalance; }
    public void setFamilyBalance(Double familyBalance) { this.familyBalance = familyBalance; }
    public String getJoinCode() { return joinCode; }
    public void setJoinCode(String joinCode) { this.joinCode = joinCode; }
    public List<User> getMembers() { return members; }
    public void setMembers(List<User> members) { this.members = members; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }

    public String getOwnerName() {
        return owner != null ? owner.getUsername() : "";
    }
}