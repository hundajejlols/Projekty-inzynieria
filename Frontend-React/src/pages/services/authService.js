import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

export const login = (username, password) => {
    // Basic Auth zgodnie z Twoją konfiguracją .httpBasic(withDefaults())
    return axios.post(`${API_URL}/login`, {}, {
        auth: { username, password }
    });
};