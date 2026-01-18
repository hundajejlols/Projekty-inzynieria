# 💰 BudżetDomowy - Frontend (React + Vite)

Aplikacja webowa do zarządzania finansami osobistymi i rodzinnymi.

## 🚀 Szybki Start

```bash
# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev

# Otwórz http://localhost:5173
```

⚠️ **WAŻNE:** Przed uruchomieniem frontendu musisz skonfigurować i uruchomić backend!

📖 **Szczegółowa instrukcja:** [README_QUICK_START.md](./README_QUICK_START.md)

## 📚 Dokumentacja

- **[README_QUICK_START.md](./README_QUICK_START.md)** - Szybki przewodnik startowy
- **[POLACZENIE_BACKEND.md](./POLACZENIE_BACKEND.md)** - Pełna instrukcja połączenia z backendem
- **[../Backend-Java/KONFIGURACJA_CORS.md](../Backend-Java/KONFIGURACJA_CORS.md)** - Konfiguracja CORS w backendzie

## 🛠️ Stack Technologiczny

- **Framework:** React 19.2
- **Build Tool:** Vite 7.2
- **Routing:** React Router DOM 7.11
- **HTTP Client:** Axios 1.13
- **Charts:** Recharts 3.6
- **Notifications:** React Toastify 11.0
- **Icons:** Lucide React 0.562

## 📁 Struktura Projektu

```
src/
├── components/          # Komponenty współdzielone
│   ├── App.jsx         # Główny komponent z routingiem
│   └── ProtectedRoute.jsx
├── pages/              # Strony aplikacji
│   ├── dashboard/      # Panel główny
│   ├── transactions/   # Historia transakcji
│   ├── login/          # Logowanie
│   ├── register/       # Rejestracja
│   ├── settings/       # Ustawienia
│   ├── family/         # Budżet rodzinny
│   ├── addReceipts/    # Dodawanie paragonów
│   └── addIncome/      # Dodawanie wpłat
├── services/           # Warstwa API
│   └── apiService.js   # Wszystkie endpointy
├── utils/              # Pomocnicze funkcje
│   └── constants.js    # Stałe (ikony, waluty)
└── config.js           # Konfiguracja API i interceptory
```

## 🎯 Główne funkcjonalności

### 💳 Zarządzanie finansami
- Dodawanie wpłat i wydatków
- Kategoryzacja transakcji
- Limity budżetowe per kategoria
- Wizualizacje wydatków (wykresy kołowe)
- Export danych do CSV
- Multi-waluta (PLN, EUR, USD)

### 👨‍👩‍👧‍👦 Budżet rodzinny
- Tworzenie wspólnego konta rodzinnego
- System zaproszeń (kod dostępu)
- Przelew środków między kontami
- Zarządzanie członkami (właściciel)

### 🔐 Bezpieczeństwo
- Autentykacja JWT
- Automatyczne odświeżanie sesji
- Reset hasła
- Protected routes

### 🎨 Personalizacja
- Tryb ciemny/jasny
- Wybór waluty (PLN, EUR, USD)
- Responsywny design

## 🔧 Konfiguracja API

Konfiguracja znajduje się w [src/config.js](./src/config.js):

```javascript
export const API_URL = 'http://localhost:8080/api';
```

### Dostępne endpointy

Pełna lista w `API_ENDPOINTS`:
- **Auth:** Login, Register, Reset hasła
- **User:** Dane użytkownika, Dodaj saldo
- **Receipts:** CRUD paragonów
- **Categories:** Lista kategorii
- **Limits:** Limity budżetowe
- **Settings:** Ustawienia użytkownika
- **Family:** Operacje na rodzinie

## 📦 Skrypty NPM

```bash
# Uruchomienie dev servera
npm run dev

# Build produkcyjny
npm run build

# Preview buildu
npm run preview

# Linting
npm run lint
```

## 🌐 Proxy API

Vite proxy jest skonfigurowane w [vite.config.js](./vite.config.js):

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    }
  }
}
```

## 🔌 Użycie API Service

Zamiast bezpośredniego użycia axios, używaj `apiService`:

```javascript
import apiService from './services/apiService';

// Przykłady
const { token } = await apiService.auth.login(username, password);
const receipts = await apiService.receipts.getAllReceipts(username);
await apiService.user.addBalance(username, 1000);
```

**Korzyści:**
- ✅ Typowane metody
- ✅ Automatyczne dodawanie tokenu
- ✅ Obsługa błędów
- ✅ Łatwe w testowaniu

## 🧪 Testowanie połączenia

1. **Uruchom backend:** `http://localhost:8080`
2. **Uruchom frontend:** `npm run dev`
3. **Otwórz DevTools** (F12) → Console
4. **Sprawdź:** Nie powinno być błędów CORS
5. **Zarejestruj się** i przetestuj funkcje

## ⚠️ Wymagania

- Node.js 18+ (LTS)
- Backend uruchomiony na `http://localhost:8080`
- CORS skonfigurowany w backendzie (WYMAGANE!)

## 🐛 Rozwiązywanie problemów

### Błąd CORS
```
Access to XMLHttpRequest blocked by CORS policy
```
➡️ Dodaj konfigurację CORS w `SecurityConfig.java` (zobacz [KONFIGURACJA_CORS.md](../Backend-Java/KONFIGURACJA_CORS.md))

### Backend nie odpowiada
```
Network Error
```
➡️ Sprawdź czy backend działa: `http://localhost:8080/api/categories`

### 401 Unauthorized
➡️ Wyloguj się i zaloguj ponownie

## 📄 Licencja

Projekt edukacyjny - Politechnika

---

**Więcej informacji:** [README_QUICK_START.md](./README_QUICK_START.md)

