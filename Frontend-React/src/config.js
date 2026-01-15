import axios from 'axios';

export const API_URL = 'http://localhost:8080/api';

// --- KONFIGURACJA GLOBALNA AXIOS ---

// 1. Interceptor ŻĄDAŃ (Request)
// Przed wysłaniem każdego zapytania sprawdź, czy mamy token i go doklej
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 2. Interceptor ODPOWIEDZI (Response)
// Jeśli serwer zwróci błąd 401 (Unauthorized), oznacza to, że token wygasł lub jest błędny
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token nieważny -> wyloguj użytkownika
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('username');
            
            // Przekieruj do logowania (jeśli nie jesteśmy już na stronie logowania)
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);