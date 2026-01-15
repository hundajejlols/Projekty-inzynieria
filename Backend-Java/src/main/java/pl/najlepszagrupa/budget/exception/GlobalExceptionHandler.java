package pl.najlepszagrupa.budget.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Obsługa ogólnych wyjątków RuntimeException (np. walidacja w UserService)
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException e) {
        // Zwracamy kod 400 (Bad Request) i treść błędu jako JSON
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage(), "message", e.getMessage()));
    }

    // Możesz tu dodać więcej handlerów dla specyficznych wyjątków
}