import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../register/register.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Resetowanie komunikatu

        try {
            // [1] Wysyłamy dane na adres zgodny z Twoim SecurityConfig i UserController
            const response = await axios.post('http://localhost:8080/api/register', formData);
            
            console.log("Rejestracja udana:", response.data);
            setMessage('Konto zostało utworzone! Przekierowanie do logowania...');
            
            // [2] Po krótkiej chwili przekierowujemy użytkownika do strony logowania
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error("Błąd rejestracji:", error);
            // Wyświetlamy błąd z backendu lub ogólny komunikat
            const errorMsg = error.response?.data?.error || 'Wystąpił błąd podczas rejestracji.';
            setMessage(errorMsg);
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Rejestracja</h2>
                
                {/* Miejsce na komunikaty o błędach lub sukcesie */}
                {message && <p className="auth-message">{message}</p>}
                
                <input 
                    name="username" 
                    placeholder="Użytkownik" 
                    required
                    onChange={(e) => setFormData({...formData, username: e.target.value})} 
                />
                <input 
                    name="email" 
                    type="email" 
                    placeholder="Email" 
                    required
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Hasło" 
                    required
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                />
                <button type="submit">Stwórz konto</button>
                <p>Masz już konto? <a href="/login">Zaloguj się</a></p>
            </form>
        </div>
    );
};

export default RegisterPage;