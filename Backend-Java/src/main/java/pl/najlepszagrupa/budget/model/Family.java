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

    @OneToMany(mappedBy = "family", fetch = FetchType.EAGER)
    @JsonIgnore // Zapobiega pętli w JSON
    private List<User> members;

    public Family() {
        // Generuje losowy kod np. "A1B2-C3D4"
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
}