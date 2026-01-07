import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const LoginPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [credentials, setCredentials] = useState({ 
        username: '', 
        password: '', 
        email: '' 
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({
            ...credentials,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            if (isLoginMode) {
                // Logika Logowania
                const response = await axios.post('http://localhost:8080/api/login', {
                    username: credentials.username,
                    password: credentials.password
                });

                // Zapisujemy username z odpowiedzi backendu do localStorage
                if (response.data.username) {
                    localStorage.setItem('username', response.data.username);
                } else {
                    // Rezerwowo, jeśli backend nie przysłał pola username
                    localStorage.setItem('username', credentials.username);
                }
                
                navigate('/dashboard');
            } else {
                // Logika Rejestracji
                await axios.post('http://localhost:8080/api/register', {
                    username: credentials.username,
                    password: credentials.password,
                    email: credentials.email
                });
                
                alert('Konto założone! Teraz możesz się zalogować.');
                setIsLoginMode(true);
            }
        } catch (err) {
            console.error("Błąd autoryzacji:", err);
            setError(err.response?.data?.error || 'Wystąpił błąd. Spróbuj ponownie.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="brand-logo">💰</div>
                    <h2>{isLoginMode ? 'Witaj ponownie' : 'Stwórz konto'}</h2>
                    <p className="subtitle">Zarządzaj budżetem z głową</p>
                    
                    {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem'}}>{error}</div>}

                    <div className="input-group-auth">
                        {!isLoginMode && (
                            <div className="field-auth">
                                <label>Email</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="email@przyklad.pl" 
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        )}
                        <div className="field-auth">
                            <label>Użytkownik</label>
                            <input 
                                name="username" 
                                type="text" 
                                placeholder="Twój login" 
                                value={credentials.username}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        <div className="field-auth">
                            <label>Hasło</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••••" 
                                value={credentials.password}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn-auth">
                        {isLoginMode ? 'Zaloguj się' : 'Zarejestruj się'}
                    </button>

                    <div className="switch-mode">
                        {isLoginMode ? 'Pierwszy raz tutaj?' : 'Masz już konto?'} 
                        <span onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setError('');
                        }}>
                            {isLoginMode ? ' Załóż konto' : ' Zaloguj się'}
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;