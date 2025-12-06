package pl.najlepszagrupa.budget;

public class items {
    private Expances expancesId;
    private Product productId;
    private int number;

    public items(Expances expancesId, Product productId, int number) {
        this.expancesId = expancesId;
        this.productId = productId;
        this.number = number;
    }
}
