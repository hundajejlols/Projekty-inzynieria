package pl.najlepszagrupa.budget.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import pl.najlepszagrupa.budget.model.Receipt;
import java.util.List;

@Repository
public interface ReceiptRepository extends JpaRepository<Receipt, Long> {

    // To zapytanie wybiera paragony, które:
    // 1. Należą bezpośrednio do użytkownika (r.user.username = :username)
    //    LUB
    // 2. Są wydatkiem rodzinnym (r.isFamilyExpense = true) I należą do rodziny użytkownika (r.user.family.id = :familyId)
    @Query("SELECT r FROM Receipt r WHERE r.user.username = :username OR (r.user.family.id = :familyId AND r.isFamilyExpense = true)")
    List<Receipt> findByUsernameOrFamily(@Param("username") String username, @Param("familyId") Long familyId);

    // Wersja dla użytkownika bez rodziny (tylko jego paragony)
    List<Receipt> findByUser_Username(String username);
}