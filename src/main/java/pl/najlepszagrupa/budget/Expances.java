package pl.najlepszagrupa.budget;

import java.time.Instant;

public class Expances {
    private int expancesId;
    private Client client;
    private Instant date;

    public Expances(int expancesId, Client client, Instant date) {
        this.expancesId = expancesId;
        this.client = client;
        this.date = date;
    }
}
