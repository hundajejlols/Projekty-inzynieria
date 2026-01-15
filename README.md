# 💰 BudżetDomowy - Next-Gen Finance App

![Project Banner](https://via.placeholder.com/1200x400?text=Budżet+Domowy+2.0+-+Zarządzanie+Finansami)

> Nowoczesna, pełnowymiarowa aplikacja webowa (Full-Stack) do zarządzania budżetem osobistym oraz **współdzielonym budżetem rodzinnym**. Projekt wyróżnia się zaawansowanym interfejsem użytkownika (Glassmorphism, 3D), bezpieczeństwem danych i bogatą funkcjonalnością analityczną.

---

## 🌟 Kluczowe Funkcjonalności

### 🎨 Nowoczesny Interfejs (UI/UX)
* **3D Flip Card Login:** Unikalny ekran logowania i rejestracji z animacją obrotu karty 3D i żywym tłem typu "Aurora".
* **Glassmorphism Dashboard:** Pulpit nawigacyjny wykorzystujący efekty rozmycia i półprzezroczystości, zapewniający czytelność i nowoczesny wygląd.
* **Responsywność:** Aplikacja dostosowana do urządzeń mobilnych i desktopowych.
* **Powiadomienia Toast:** Eleganckie, dymkowe powiadomienia o sukcesach i błędach (zamiast systemowych alertów).

### 👨‍👩‍👧‍👦 Moduł Rodzinny (Unikalna cecha!)
* **Wspólny Portfel:** Możliwość utworzenia nowej rodziny lub dołączenia do istniejącej za pomocą unikalnego kodu (np. `A1B2-C3D4`).
* **Dwa Tryby Wydatków:** Podczas dodawania paragonu decydujesz: płacisz ze swojego konta czy z konta rodzinnego?
* **Zarządzanie Środkami:** Możliwość zasilania (przelewania) środków z konta prywatnego na wspólne konto rodzinne.

### 📊 Analiza i Zarządzanie
* **Filtrowanie Czasowe:** Przeglądanie historii transakcji i wykresów w ujęciu miesięcznym (wybierak daty).
* **Eksport do CSV:** Możliwość pobrania historii przefiltrowanych transakcji do pliku Excel/CSV jednym kliknięciem.
* **Wizualizacja:** Interaktywne wykresy kołowe (Recharts) pokazujące strukturę wydatków według kategorii.
* **Limity Budżetowe:** Paski postępu pokazujące zużycie budżetu w poszczególnych kategoriach (np. Jedzenie, Transport).

### 🛡️ Bezpieczeństwo i Backend
* **Walidacja Danych:** Zabezpieczenie przed duplikatami loginów/emaili oraz wymuszanie silnych haseł.
* **Global Exception Handling:** Centralna obsługa błędów na backendzie, zwracająca czytelne komunikaty do frontendu.
* **Architektura:** Czysty podział na warstwy (Controller, Service, Repository, Model).

---

## 🛠️ Stack Technologiczny

### Backend (Java Ecosystem)
* **Język:** Java 25 (Latest LTS/Feature release)
* **Framework:** Spring Boot 4.0.0
* **Baza Danych:** H2 Database (In-Memory, szybka i lekka)
* **ORM:** Spring Data JPA (Hibernate)
* **Bezpieczeństwo:** Spring Security (BCrypt Password Hashing)
* **Build Tool:** Gradle

### Frontend (React Ecosystem)
* **Framework:** React 19 + Vite
* **Komunikacja:** Axios (HTTP Client)
* **Wykresy:** Recharts
* **UI Components:** React-Toastify
* **Style:** Custom CSS 3 (CSS Variables, Flexbox, Grid, Animations, 3D Transforms)

---

## 🚀 Instrukcja Uruchomienia

Projekt składa się z dwóch niezależnych części: serwera API oraz klienta React. Należy uruchomić je w osobnych terminalach.

### Krok 1: Backend (Serwer)
1.  Otwórz terminal w folderze projektu.
2.  Przejdź do katalogu backendu:
    ```bash
    cd Backend-Java
    ```
3.  Uruchom aplikację za pomocą Gradle Wrapper:
    * **Windows:** `gradlew.bat bootRun`
    * **Mac/Linux:** `./gradlew bootRun`
4.  Serwer wystartuje na porcie `8080`.

### Krok 2: Frontend (Klient)
1.  Otwórz **nowe** okno terminala.
2.  Przejdź do katalogu frontendu:
    ```bash
    cd Frontend-React
    ```
3.  Zainstaluj zależności (wymagane tylko przy pierwszym uruchomieniu):
    ```bash
    npm install
    ```
4.  Uruchom serwer deweloperski:
    ```bash
    npm run dev
    ```
5.  Aplikacja będzie dostępna pod adresem: `http://localhost:5173`

---

## 🧪 Scenariusz Testowy (Dla Recenzenta)

Aby w pełni przetestować możliwości aplikacji, wykonaj poniższe kroki:

1.  **Rejestracja Rodziców:**
    * Zarejestruj użytkownika `Jan` (hasło min. 8 znaków).
    * Zarejestruj użytkownika `Anna`.
2.  **Tworzenie Rodziny (Jan):**
    * Zaloguj się jako `Jan`.
    * Dodaj przychód (np. 5000 PLN).
    * Wejdź w zakładkę **Rodzina** -> "Utwórz nową rodzinę" (np. "Kowalscy").
    * Skopiuj wygenerowany **Kod Zaproszenia**.
    * Wpłać 2000 PLN na konto rodzinne ("Zasil konto rodziny").
3.  **Dołączanie (Anna):**
    * Zaloguj się jako `Anna` (w innej karcie/przeglądarce).
    * Wejdź w zakładkę **Rodzina** -> "Dołącz kodem". Wklej kod od Jana.
    * Zauważ, że Anna widzi teraz "Budżet Rodzinny: 2000 PLN".
4.  **Wspólne Wydatki:**
    * Jako `Anna` dodaj paragon (np. "Biedronka", 200 PLN).
    * Zaznacz checkbox: **"👨‍👩‍👧‍👦 To wydatek z konta Rodziny"**.
    * Sprawdź Dashboard: Saldo rodziny spadło do 1800 PLN (zarówno u Anny, jak i u Jana).
5.  **Analiza i Eksport:**
    * Zmień miesiąc w filtrze na górze ekranu (zobaczysz brak danych dla innych miesięcy).
    * Kliknij przycisk **"📥 Eksportuj CSV"** w menu bocznym, aby pobrać raport.
