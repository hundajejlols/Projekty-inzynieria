import axios from 'axios';

// --- KONFIGURACJA API ---
export const API_URL = 'http://localhost:8080/api';

// Konfiguracja bazowa dla axios
axios.defaults.baseURL = API_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

// --- INTERCEPTOR ŻĄDAŃ (Request) ---
// Przed wysłaniem każdego zapytania sprawdź, czy mamy token i go dołącz
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('jwtToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// --- INTERCEPTOR ODPOWIEDZI (Response) ---
// Jeśli serwer zwróci błąd 401 (Unauthorized), oznacza to, że token wygasł lub jest błędny
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const { status } = error.response;
            
            // Token nieważny lub wygasł
            if (status === 401) {
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('username');
                
                // Przekieruj do logowania (jeśli nie jesteśmy już na stronie logowania)
                if (!window.location.pathname.includes('/login') && 
                    !window.location.pathname.includes('/register')) {
                    window.location.href = '/login';
                }
            }
            
            // Obsługa innych błędów
            if (status === 403) {
                console.error('Brak uprawnień do wykonania tej operacji');
            }
            
            if (status === 500) {
                console.error('Błąd serwera:', error.response.data);
            }
        } else if (error.request) {
            // Żądanie zostało wysłane, ale nie otrzymano odpowiedzi
            console.error('Brak odpowiedzi z serwera. Czy backend działa na http://localhost:8080?');
        }
        
        return Promise.reject(error);
    }
);

// --- MAPOWANIE ENDPOINTÓW API ---
// Dokumentacja dostępnych endpointów backendu
export const API_ENDPOINTS = {
    // Autentykacja
    AUTH: {
        LOGIN: '/login',
        REGISTER: '/register',
        FORGOT_PASSWORD: '/auth/forgot-password',
        RESET_PASSWORD: '/auth/reset-password',
    },
    
    // Użytkownik
    USER: {
        GET_INFO: (username) => `/user/${username}`,
        ADD_BALANCE: '/user/add-balance',
        UPDATE: '/user/update',
    },
    
    // Paragony/Transakcje
    RECEIPTS: {
        GET_ALL: (username) => `/receipts/${username}`,
        CREATE: (username) => `/receipts/${username}`,
        UPDATE: (id) => `/receipts/${id}`,
        DELETE: (id) => `/receipts/${id}`,
    },
    
    // Kategorie
    CATEGORIES: {
        GET_ALL: '/categories',
    },
    
    // Limity budżetowe
    LIMITS: {
        GET_USER_LIMITS: (username) => `/limits/${username}`,
        SET_LIMIT: (username) => `/limits/${username}`,
    },
    
    // Ustawienia
    SETTINGS: {
        GET: (username) => `/settings/${username}`,
        UPDATE: (username) => `/settings/${username}`,
    },
    
    // Rodzina
    FAMILY: {
        CREATE: '/family/create',
        JOIN: '/family/join',
        LEAVE: '/family/leave',
        DISSOLVE: '/family/dissolve',
        TRANSFER: '/family/transfer',
        REMOVE_MEMBER: '/family/remove',
        GET_MEMBERS: (username) => `/family/members/${username}`,
    }
};