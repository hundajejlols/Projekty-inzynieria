<div align="center">
  # 💰 BudżetDomowy 2.0
  
  **Nowoczesna platforma Full-Stack do zarządzania finansami osobistymi i rodzinnymi.**
  
  <p>
    <a href="#-kluczowe-funkcjonalności">Funkcjonalności</a> •
    <a href="#-stack-technologiczny">Technologie</a> •
    <a href="#-uruchomienie">Instalacja</a> •
    <a href="#-zrzuty-ekranu">Galeria</a>
  </p>

  ![Java](https://img.shields.io/badge/Java-25-orange?style=for-the-badge&logo=openjdk)
  ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.0-green?style=for-the-badge&logo=springboot)
  ![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
  ![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=for-the-badge&logo=vite)
  ![Status](https://img.shields.io/badge/Status-Active_Dev-lightgreen?style=for-the-badge)

</div>

---

## 📖 O Projekcie

**BudżetDomowy** to nie tylko kalkulator wydatków. To zaawansowany system finansowy, który wprowadza pojęcie **"Budżetu Rodzinnego"**. Aplikacja pozwala użytkownikom łączyć się w grupy (rodziny), wspólnie zarządzać środkami i śledzić wydatki w czasie rzeczywistym, zachowując przy tym możliwość prowadzenia prywatnego portfela.

Interfejs użytkownika został zaprojektowany w stylu **Glassmorphism**, oferując nowoczesne doświadczenie z pełnym wsparciem dla trybu ciemnego (Dark Mode).

---

## 🌟 Kluczowe Funkcjonalności

### 💸 Zarządzanie Finansami
* **Inteligentne Paragony**: Dodawanie transakcji z podziałem na kategorie i konkretne produkty.
* **Limity Budżetowe**: Wizualne paski postępu (progress bars) dla każdej kategorii wydatków (Jedzenie, Dom, Rozrywka).
* **Wielowalutowość**: Automatyczne przeliczanie walut (PLN, USD, EUR).

### 👨‍👩‍👧‍👦 Moduł Rodzinny (Unikalna Cecha)
* **Współdzielenie**: Tworzenie rodzin i zapraszanie członków unikalnym kodem (np. `A1B2`).
* **Tryb Płatności**: Decyduj przy każdym paragonie: *"Płacę z mojego konta"* czy *"Z konta wspólnego"*.
* **Transfery**: Błyskawiczne zasilanie budżetu domowego z konta prywatnego.

### 📊 Analiza i Dane
* **Dashboard**: Interaktywne wykresy kołowe (Recharts) analizujące strukturę wydatków.
* **Filtrowanie Czasowe**: Przegląd historii transakcji z podziałem na miesiące.
* **Eksport CSV**: Pobieranie raportów finansowych jednym kliknięciem.

---

## 🛠️ Stack Technologiczny

<div align="center">

| Backend (Java Ecosystem) | Frontend (React Ecosystem) |
| :--- | :--- |
| **Java 25** (Preview Features) | **React 19** & **Vite** |
| **Spring Boot 4.0.0** | **Recharts** (Wykresy) |
| **H2 Database** (In-Memory) | **Axios** (API Client) |
| **Spring Security** + **JWT** | **React Toastify** (Notifications) |
| **Gradle** | **CSS Modules** & Variables |

</div>

---

## 🚀 Uruchomienie

Projekt składa się z dwóch niezależnych części. Uruchom je w osobnych terminalach.

### Wymagania
* **Java JDK 25**
* **Node.js v18+**

### 1️⃣ Backend (Serwer)
cd Backend-Java
# Windows
gradlew.bat bootRun
# Mac/Linux
./gradlew bootRun
Serwer wystartuje na http://localhost:8080. Baza danych H2 tworzona jest automatycznie w pamięci.

2️⃣ Frontend (Klient)
cd Frontend-React
npm install
npm run dev
Aplikacja dostępna pod adresem http://localhost:5173.

🧪 Scenariusz Testowy (Dla Recenzenta)
Rejestracja: Załóż konto (hasło min. 8 znaków).

Tworzenie Rodziny:

W menu wybierz "Rodzina" -> "Utwórz nową rodzinę".

Skopiuj wygenerowany Kod Zaproszenia.

Dołączanie:

Zaloguj się jako inny użytkownik (np. w trybie Incognito).

Wybierz "Rodzina" -> "Dołącz kodem" i wklej kod.

Wspólne Wydatki:

Dodaj paragon i zaznacz opcję: 👨‍👩‍👧‍👦 To wydatek z konta Rodziny.

Sprawdź, czy saldo rodziny zmniejszyło się u obu użytkowników.

🔐 Konfiguracja
Główne ustawienia (baza danych, tokeny JWT) znajdują się w pliku: Backend-Java/src/main/resources/application.properties

Properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.h2.console.enabled=true
app.jwtSecret=ToJestBardzoTajnyKluczDoPodpisuJWT1234567890
<div align="center"> <sub>Projekt inżynierski © 2026. Stworzony z pasją do czystego kodu.</sub> </div>
