# Aplikacja Budżetowa (Inżynieria Oprogramowania)

Prosta aplikacja webowa typu Full-Stack do zarządzania budżetem domowym, dodawania paragonów i śledzenia transakcji. Projekt składa się z backendu napisanego w Javie (Spring Boot) oraz frontendu opartego na React (Vite).

## 🚀 Technologie

**Backend:**
* **Język:** Java
* **Framework:** Spring Boot 3
* **Baza danych:** H2 (baza in-memory, dane są resetowane po restarcie aplikacji)
* **Budowanie:** Gradle

**Frontend:**
* **Biblioteka:** React
* **Build tool:** Vite
* **Style:** CSS Modules / Standard CSS
* **Komunikacja:** Fetch API / Axios (zależnie od implementacji w `authService.js`)

---

## 🛠️ Wymagania wstępne

Aby uruchomić projekt, upewnij się, że masz zainstalowane na komputerze:
1.  **Java JDK** (wersja 17 lub nowsza).
2.  **Node.js** (wersja LTS) oraz menedżer pakietów **npm**.
3.  **Git** (opcjonalnie, do pobierania kodu).

---

## ⚙️ Instrukcja uruchomienia

Aplikacja składa się z dwóch niezależnych serwerów. Należy uruchomić je jednocześnie w dwóch osobnych oknach terminala.

### Krok 1: Uruchomienie Backendu (Java)

Serwer backendowy odpowiada za logikę biznesową i bazę danych. Domyślnie działa na porcie `8080`.

1.  Otwórz terminal.
2.  Przejdź do katalogu backendu:
    ```bash
    cd Backend-Java
    ```
3.  Uruchom aplikację używając Gradle Wrapper:
    * **Windows:**
        ```bash
        gradlew.bat bootRun
        ```
    * **Linux / macOS:**
        ```bash
        chmod +x gradlew  # (tylko jeśli brakuje uprawnień)
        ./gradlew bootRun
        ```
4.  Poczekaj na komunikat `Started BudgetApplication in ... seconds`.

### Krok 2: Uruchomienie Frontendu (React)

Interfejs użytkownika, który łączy się z backendem. Domyślnie działa na porcie `5173`.

1.  Otwórz **nowe** okno terminala.
2.  Przejdź do katalogu frontendu:
    ```bash
    cd Frontend-React
    ```
3.  Zainstaluj zależności (tylko przy pierwszym uruchomieniu):
    ```bash
    npm install
    ```
4.  Uruchom serwer deweloperski:
    ```bash
    npm run dev
    ```
5.  Kliknij w link widoczny w terminalu (zazwyczaj `http://localhost:5173`), aby otworzyć aplikację w przeglądarce.

---

## 🌟 Funkcjonalności

* **Rejestracja i Logowanie:** Zabezpieczony dostęp do aplikacji.
* **Dashboard:** Podgląd ogólnego stanu budżetu.
* **Dodawanie Paragonów:** Formularz (`AddReceiptModal`) umożliwiający wprowadzanie nowych wydatków.
* **Lista Transakcji:** Przeglądanie historii wydatków (`TransactionsPage`).

---

## 🐛 Rozwiązywanie problemów

**1. Port 8080 jest zajęty:**
Jeśli backend nie chce wystartować z błędem "Address already in use", musisz zwolnić port 8080 lub zmienić go w pliku `Backend-Java/src/main/resources/application.properties`:
```properties
server.port=8081
