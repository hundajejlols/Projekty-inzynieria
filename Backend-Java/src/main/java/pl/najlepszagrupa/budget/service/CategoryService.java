package pl.najlepszagrupa.budget.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.najlepszagrupa.budget.model.Category;
import pl.najlepszagrupa.budget.repository.CategoryRepository;

import java.util.List;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByIsActiveTrue();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Kategoria nie znaleziona"));
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Kategoria o tej nazwie już istnieje");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);
        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());
        category.setIcon(categoryDetails.getIcon());
        category.setColor(categoryDetails.getColor());
        category.setIsActive(categoryDetails.getIsActive());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        category.setIsActive(false);
        categoryRepository.save(category);
    }

    public void initializeDefaultCategories() {
        if (categoryRepository.count() == 0) {
            List<String> defaultCategories = List.of(
                    "Zakupy", "Jedzenie", "Transport", "Rozrywka",
                    "Dom", "Zdrowie", "Inne", "Edukacja", "Prezenty"
            );

            for (String name : defaultCategories) {
                Category category = new Category();
                category.setName(name);
                category.setIsActive(true);
                categoryRepository.save(category);
            }
        }
    }
}
