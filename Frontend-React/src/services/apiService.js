import axios from 'axios';
import { API_URL, API_ENDPOINTS } from '../config';

/**
 * Serwis do komunikacji z API backendu
 * Zawiera wszystkie metody do komunikacji z endpointami
 */

// --- AUTENTYKACJA ---
export const authService = {
    /**
     * Logowanie użytkownika
     * @param {string} username - Nazwa użytkownika
     * @param {string} password - Hasło
     * @returns {Promise} Token JWT i nazwa użytkownika
     */
    login: async (username, password) => {
        const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
            username,
            password
        });
        return response.data;
    },

    /**
     * Rejestracja nowego użytkownika
     * @param {Object} userData - {username, email, password}
     * @returns {Promise}
     */
    register: async (userData) => {
        const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, userData);
        return response.data;
    },

    /**
     * Żądanie resetu hasła
     * @param {string} email - Email użytkownika
     * @returns {Promise}
     */
    forgotPassword: async (email) => {
        const response = await axios.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
        return response.data;
    },

    /**
     * Reset hasła z tokenem
     * @param {string} token - Token resetowania
     * @param {string} password - Nowe hasło
     * @returns {Promise}
     */
    resetPassword: async (token, password) => {
        const response = await axios.post(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
            token,
            password
        });
        return response.data;
    },
};

// --- UŻYTKOWNIK ---
export const userService = {
    /**
     * Pobierz informacje o użytkowniku
     * @param {string} username
     * @returns {Promise}
     */
    getUserInfo: async (username) => {
        const response = await axios.get(API_ENDPOINTS.USER.GET_INFO(username));
        return response.data;
    },

    /**
     * Dodaj saldo do konta użytkownika
     * @param {string} username
     * @param {number} amount - Kwota w PLN
     * @returns {Promise}
     */
    addBalance: async (username, amount) => {
        const response = await axios.post(API_ENDPOINTS.USER.ADD_BALANCE, {
            username,
            amount
        });
        return response.data;
    },

    /**
     * Aktualizuj dane użytkownika
     * @param {Object} updateData - {currentUsername, newUsername?, newPassword?, oldPassword?}
     * @returns {Promise}
     */
    updateUser: async (updateData) => {
        const response = await axios.put(API_ENDPOINTS.USER.UPDATE, updateData);
        return response.data;
    },
};

// --- PARAGONY/TRANSAKCJE ---
export const receiptService = {
    /**
     * Pobierz wszystkie paragony użytkownika
     * @param {string} username
     * @returns {Promise<Array>}
     */
    getAllReceipts: async (username) => {
        const response = await axios.get(API_ENDPOINTS.RECEIPTS.GET_ALL(username));
        return response.data;
    },

    /**
     * Dodaj nowy paragon
     * @param {string} username
     * @param {Object} receiptData - {shopName, date, category, totalAmount, items, isFamilyExpense}
     * @returns {Promise}
     */
    createReceipt: async (username, receiptData) => {
        const response = await axios.post(
            API_ENDPOINTS.RECEIPTS.CREATE(username),
            receiptData
        );
        return response.data;
    },

    /**
     * Aktualizuj paragon
     * @param {number} id - ID paragonu
     * @param {Object} receiptData - Zaktualizowane dane
     * @returns {Promise}
     */
    updateReceipt: async (id, receiptData) => {
        const response = await axios.put(
            API_ENDPOINTS.RECEIPTS.UPDATE(id),
            receiptData
        );
        return response.data;
    },

    /**
     * Usuń paragon
     * @param {number} id - ID paragonu
     * @returns {Promise}
     */
    deleteReceipt: async (id) => {
        const response = await axios.delete(API_ENDPOINTS.RECEIPTS.DELETE(id));
        return response.data;
    },
};

// --- KATEGORIE ---
export const categoryService = {
    /**
     * Pobierz wszystkie dostępne kategorie
     * @returns {Promise<Array<string>>}
     */
    getAllCategories: async () => {
        const response = await axios.get(API_ENDPOINTS.CATEGORIES.GET_ALL);
        return response.data;
    },
};

// --- LIMITY BUDŻETOWE ---
export const limitService = {
    /**
     * Pobierz limity użytkownika
     * @param {string} username
     * @returns {Promise<Object>} Obiekt z limitami per kategoria
     */
    getUserLimits: async (username) => {
        const response = await axios.get(API_ENDPOINTS.LIMITS.GET_USER_LIMITS(username));
        return response.data;
    },

    /**
     * Ustaw limit dla kategorii
     * @param {string} username
     * @param {string} category - Nazwa kategorii
     * @param {number} limit - Limit w PLN
     * @returns {Promise}
     */
    setLimit: async (username, category, limit) => {
        const response = await axios.post(API_ENDPOINTS.LIMITS.SET_LIMIT(username), {
            category,
            limit
        });
        return response.data;
    },
};

// --- USTAWIENIA ---
export const settingsService = {
    /**
     * Pobierz ustawienia użytkownika
     * @param {string} username
     * @returns {Promise<Object>} {currency, darkTheme, emailNotifications}
     */
    getSettings: async (username) => {
        const response = await axios.get(API_ENDPOINTS.SETTINGS.GET(username));
        return response.data;
    },

    /**
     * Zaktualizuj ustawienia użytkownika
     * @param {string} username
     * @param {Object} settings - {currency?, darkTheme?, emailNotifications?}
     * @returns {Promise}
     */
    updateSettings: async (username, settings) => {
        const response = await axios.post(
            API_ENDPOINTS.SETTINGS.UPDATE(username),
            settings
        );
        return response.data;
    },
};

// --- RODZINA ---
export const familyService = {
    /**
     * Utwórz nową rodzinę
     * @param {string} username - Właściciel rodziny
     * @param {string} familyName - Nazwa rodziny
     * @returns {Promise}
     */
    createFamily: async (username, familyName) => {
        const response = await axios.post(API_ENDPOINTS.FAMILY.CREATE, {
            username,
            familyName
        });
        return response.data;
    },

    /**
     * Dołącz do rodziny za pomocą kodu
     * @param {string} username
     * @param {string} code - Kod zaproszenia
     * @returns {Promise}
     */
    joinFamily: async (username, code) => {
        const response = await axios.post(API_ENDPOINTS.FAMILY.JOIN, {
            username,
            code
        });
        return response.data;
    },

    /**
     * Opuść rodzinę
     * @param {string} username
     * @returns {Promise}
     */
    leaveFamily: async (username) => {
        const response = await axios.post(API_ENDPOINTS.FAMILY.LEAVE, {
            username
        });
        return response.data;
    },

    /**
     * Rozwiąż rodzinę (tylko właściciel)
     * @param {string} username - Właściciel
     * @returns {Promise}
     */
    dissolveFamily: async (username) => {
        const response = await axios.post(API_ENDPOINTS.FAMILY.DISSOLVE, {
            username
        });
        return response.data;
    },

    /**
     * Przelej środki na konto rodzinne
     * @param {string} username
     * @param {number} amount - Kwota w PLN
     * @returns {Promise}
     */
    transferToFamily: async (username, amount) => {
        const response = await axios.post(API_ENDPOINTS.FAMILY.TRANSFER, {
            username,
            amount
        });
        return response.data;
    },

    /**
     * Usuń członka rodziny (tylko właściciel)
     * @param {string} ownerName - Właściciel rodziny
     * @param {string} memberName - Członek do usunięcia
     * @returns {Promise}
     */
    removeMember: async (ownerName, memberName) => {
        const response = await axios.post(API_ENDPOINTS.FAMILY.REMOVE_MEMBER, {
            ownerName,
            memberName
        });
        return response.data;
    },

    /**
     * Pobierz listę członków rodziny
     * @param {string} username
     * @returns {Promise<Array<string>>}
     */
    getMembers: async (username) => {
        const response = await axios.get(API_ENDPOINTS.FAMILY.GET_MEMBERS(username));
        return response.data;
    },
};

// Export wszystkich serwisów jako jeden obiekt
export default {
    auth: authService,
    user: userService,
    receipts: receiptService,
    categories: categoryService,
    limits: limitService,
    settings: settingsService,
    family: familyService,
};
