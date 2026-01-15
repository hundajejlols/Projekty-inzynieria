package pl.najlepszagrupa.budget.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    // W prawdziwym projekcie ten klucz trzymaj w application.properties!
    // Klucz musi mieć min. 256 bitów (32 znaki)
    private static final String SECRET_KEY = "JwtToken";
    private static final long EXPIRATION_TIME = 86400000; // 24 godziny (w milisekundach)

    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // Generowanie tokena dla użytkownika
    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    // Wyciąganie nazwy użytkownika z tokena
    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // Walidacja tokena
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            // Token nieprawidłowy lub wygasł
            return false;
        }
    }
}