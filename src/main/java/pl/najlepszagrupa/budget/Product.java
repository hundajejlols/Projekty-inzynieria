package pl.najlepszagrupa.budget;

public class Product {
    private int productId;
    private String name;
    private Category category;
    private float price;

    public Product(int productId, String name, Category category, float price) {
        this.productId = productId;
        this.name = name;
        this.category = category;
        this.price = price;
    }
}
