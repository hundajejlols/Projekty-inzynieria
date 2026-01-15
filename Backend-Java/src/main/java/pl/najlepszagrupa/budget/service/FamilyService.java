package pl.najlepszagrupa.budget.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.najlepszagrupa.budget.model.Family;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.FamilyRepository;
import pl.najlepszagrupa.budget.repository.UserRepository;

@Service
public class FamilyService {

    private final FamilyRepository familyRepository;
    private final UserRepository userRepository;

    public FamilyService(FamilyRepository familyRepository, UserRepository userRepository) {
        this.familyRepository = familyRepository;
        this.userRepository = userRepository;
    }

    public Family createFamily(String username, String familyName) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Family family = new Family();
        family.setName(familyName);
        familyRepository.save(family);

        user.setFamily(family);
        userRepository.save(user);
        return family;
    }

    public Family joinFamily(String username, String joinCode) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Family family = familyRepository.findByJoinCode(joinCode)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono rodziny o podanym kodzie"));

        user.setFamily(family);
        userRepository.save(user);
        return family;
    }

    @Transactional
    public void transferToFamily(String username, Double amount) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Family family = user.getFamily();

        if (family == null) throw new RuntimeException("Nie masz rodziny!");
        if (user.getBalance() < amount) throw new RuntimeException("Za mało środków na koncie!");

        user.setBalance(user.getBalance() - amount);
        family.setFamilyBalance(family.getFamilyBalance() + amount);

        userRepository.save(user);
        familyRepository.save(family);
    }
}