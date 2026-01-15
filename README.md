💰 BudżetDomowy - System Zarządzania Finansami
BudżetDomowy to nowoczesna aplikacja typu Full-Stack służąca do kompleksowego zarządzania finansami osobistymi oraz współdzielonym budżetem rodzinnym. Projekt wyróżnia się nowoczesnym interfejsem (React + Vite), zaawansowanym backendem (Spring Boot + Java 25) oraz unikalnymi funkcjami społecznościowymi (rodziny).

🌟 Kluczowe Funkcjonalności
💸 Zarządzanie Wydatkami
Dodawanie Paragonów: Rejestrowanie wydatków z podziałem na pozycje (produkty) i kategorie.

Kategorie: Predefiniowane kategorie (Jedzenie, Transport, Dom, Zdrowie, Rozrywka, itp.).

Limity Budżetowe: Definiowanie miesięcznych limitów dla każdej kategorii z wizualizacją postępu (paski zużycia).

Historia: Pełna lista transakcji z możliwością filtrowania, edycji i usuwania.

👨‍👩‍👧‍👦 Moduł Rodzinny (Unikalna cecha!)
Wspólny Portfel: Możliwość utworzenia Rodziny lub dołączenia do istniejącej za pomocą Kodu Zaproszenia.

Współdzielenie Kosztów: Podczas dodawania paragonu decydujesz, czy płacisz z konta prywatnego, czy ze środków rodziny.

Transfery: Błyskawiczne zasilanie konta rodzinnego z konta prywatnego.

Zarządzanie: Właściciel rodziny może usuwać członków lub rozwiązać grupę.

📊 Analiza i Dashboard
Wykresy: Interaktywny wykres kołowy (Recharts) pokazujący strukturę wydatków w wybranym miesiącu.

Filtrowanie Czasowe: Przeglądanie danych historycznych za pomocą wygodnego selektora daty.

Eksport Danych: Możliwość pobrania historii transakcji do pliku CSV.

⚙️ Personalizacja i Bezpieczeństwo
Motywy: Pełne wsparcie dla Trybu Ciemnego (Dark Mode) i Jasnego.

Waluty: Obsługa wielu walut (PLN, USD, EUR) z automatycznym przeliczaniem w interfejsie.

Bezpieczeństwo: Rejestracja, logowanie (JWT Token), hashowanie haseł (BCrypt) oraz mechanizm resetowania hasła.

🛠️ Stack Technologiczny
Backend (Java Ecosystem)
Język: Java 25 (Latest Features)

Framework: Spring Boot 4.0.0

Baza Danych: H2 Database (In-Memory, tryb deweloperski)

ORM: Spring Data JPA (Hibernate)

Security: Spring Security + JWT Authentication

Testy: JUnit 5, Mockito

Frontend (React Ecosystem)
Framework: React 19 + Vite

Biblioteki UI: Lucide React (ikony), React Toastify (powiadomienia)

Wykresy: Recharts

Komunikacja: Axios (z interceptorami do obsługi tokenów)

Style: Custom CSS z wykorzystaniem zmiennych CSS (dla łatwej obsługi motywów)

🚀 Instrukcja Uruchomienia
Projekt składa się z dwóch części: serwera (Backend-Java) oraz klienta (Frontend-React).

Wymagania wstępne
Java JDK 25 (Wymagane ze względu na konfigurację Gradle)

Node.js (v18 lub nowszy)

1. Uruchomienie Backendu
Przejdź do katalogu backendu:

cd Backend-Java
Uruchom aplikację (baza danych zostanie utworzona automatycznie w pamięci):

Windows:
gradlew.bat bootRun

Linux/Mac:
./gradlew bootRun
Serwer wystartuje na porcie 8080.

Konsola H2 dostępna pod: http://localhost:8080/h2-console (User: sa, Password: password)

2. Uruchomienie Frontendu
Otwórz nowy terminal i przejdź do katalogu frontendu:


cd Frontend-React
Zainstaluj zależności:


npm install
Uruchom serwer deweloperski:


npm run dev
Aplikacja będzie dostępna pod adresem: http://localhost:5173

🧪 Przykładowy Scenariusz Użycia
Rejestracja: Załóż konto (hasło min. 8 znaków).

Dodanie środków: Na Dashboardzie kliknij "Dodaj wypłatę", aby zasilić swoje konto.

Tworzenie Rodziny:

Wejdź w zakładkę "Rodzina" i utwórz nową grupę.

Skopiuj Kod Zaproszenia i przekaż go innemu użytkownikowi.

Wspólne Wydatki:

Dodaj paragon klikając "+ Dodaj paragon".

Zaznacz opcję "To wydatek z konta Rodziny".

Zobaczysz, że saldo rodziny zmalało, a transakcja oznaczona jest jako rodzinna.

Reset Hasła:

Na ekranie logowania wybierz "Zapomniałeś hasła?".

Token resetujący pojawi się w konsoli serwera Backend (symulacja wysyłki e-mail).

📂 Struktura Projektu
projekty-inzynieria/
├── Backend-Java/           # Serwer Spring Boot
│   ├── src/main/java/      # Kod źródłowy Java (Controllers, Services, Models)
│   └── src/main/resources/ # Konfiguracja (application.properties)
│
└── Frontend-React/         # Klient React
    ├── src/components/     # Komponenty globalne (np. ProtectedRoute)
    ├── src/pages/          # Widoki (Dashboard, Login, Transactions, Family)
    └── src/utils/          # Stałe i pomocnicze funkcje
🔐 Konfiguracja
Domyślne ustawienia znajdują się w pliku Backend-Java/src/main/resources/application.properties. Możesz tam zmienić:

Dane do bazy H2.

Sekretny klucz JWT (app.jwtSecret).

Autor: Mateusz Janusz,Arkadiusz Matuszewski,Łukasz Malarczuk,Jan Dołżycki Licencja: MIT
