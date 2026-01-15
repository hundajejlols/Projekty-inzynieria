package pl.najlepszagrupa.budget.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.najlepszagrupa.budget.model.Family;
import pl.najlepszagrupa.budget.model.User;
import pl.najlepszagrupa.budget.repository.FamilyRepository;
import pl.najlepszagrupa.budget.repository.UserRepository;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

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
        family.setOwner(user);
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

    public List<String> getFamilyMembers(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Family family = user.getFamily();
        if (family == null) return Collections.emptyList();

        return family.getMembers().stream()
                .map(User::getUsername)
                .collect(Collectors.toList());
    }

    @Transactional
    public void leaveFamily(String username) {
        User user = userRepository.findByUsername(username).orElseThrow();
        Family family = user.getFamily();
        if (family == null) throw new RuntimeException("Nie masz rodziny.");

        if (family.getOwner() != null && family.getOwner().equals(user)) {
            throw new RuntimeException("Właściciel nie może opuścić rodziny. Musisz ją rozwiązać.");
        }

        user.setFamily(null);
        userRepository.save(user);
    }

    @Transactional
    public void removeMember(String ownerName, String memberName) {
        User owner = userRepository.findByUsername(ownerName).orElseThrow();
        User member = userRepository.findByUsername(memberName).orElseThrow();
        Family family = owner.getFamily();

        if (family == null || !family.getOwner().equals(owner)) {
            throw new RuntimeException("Tylko właściciel może usuwać członków.");
        }
        if (!member.getFamily().equals(family)) {
            throw new RuntimeException("Ten użytkownik nie należy do Twojej rodziny.");
        }
        if (owner.equals(member)) {
            throw new RuntimeException("Nie możesz usunąć samego siebie.");
        }

        member.setFamily(null);
        userRepository.save(member);
    }

    @Transactional
    public void dissolveFamily(String ownerName) {
        User owner = userRepository.findByUsername(ownerName).orElseThrow();
        Family family = owner.getFamily();

        if (family == null || !family.getOwner().equals(owner)) {
            throw new RuntimeException("Tylko właściciel może rozwiązać rodzinę.");
        }

        List<User> members = family.getMembers();
        for (User u : members) {
            u.setFamily(null);
            userRepository.save(u);
        }

        familyRepository.delete(family);
    }
}