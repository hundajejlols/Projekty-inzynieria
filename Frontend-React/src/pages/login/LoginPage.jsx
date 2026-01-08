import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify'; // Importujemy toasty
import './Login.css';

const LoginPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [credentials, setCredentials] = useState({ 
        username: '', 
        password: '', 
        email: '' 
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username: credentials.username,
                password: credentials.password
            });
            const user = response.data.username || credentials.username;
            localStorage.setItem('username', user);
            
            toast.success(`Witaj ponownie, ${user}! 👋`); // Powitanie po zalogowaniu
            navigate('/dashboard');
        } catch (err) {
            // Toast błędu zamiast tekstu w divie (opcjonalnie, ale wygląda lepiej)
            toast.error(err.response?.data?.error || 'Błędny login lub hasło');
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (credentials.password.length < 8) {
            toast.warn('Hasło musi mieć min. 8 znaków 🔒');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/register`, {
                username: credentials.username,
                password: credentials.password,
                email: credentials.email
            });
            
            // --- ZMIANA TUTAJ: Zamiast brzydkiego alert() ---
            toast.success('Sukces! Konto utworzone. Zaloguj się teraz. 🚀');
            
            setIsLoginView(true);
            setCredentials({ ...credentials, password: '' });
            setLoading(false);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Błąd rejestracji.');
            setLoading(false);
        }
    };

    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
        setCredentials({ username: '', password: '', email: '' });
    };

    return (
        <div className="auth-container">
            <div className="floating-shape shape-1">💎</div>
            <div className="floating-shape shape-2">🚀</div>

            <div className="flip-container">
                <div className={`flipper ${!isLoginView ? 'flipped' : ''}`}>
                    
                    {/* PRZÓD - LOGOWANIE */}
                    <div className="card-front">
                        <h1 className="brand-title">BudżetDomowy</h1>
                        <p className="subtitle">Witaj ponownie! 👋</p>

                        <form onSubmit={handleLogin}>
                            <div className="field-auth">
                                {/* Ikona jest teraz częścią etykiety - nie najedzie na input */}
                                <label className="input-label">
                                    <span className="label-icon">👤</span> Użytkownik
                                </label>
                                <input 
                                    name="username" 
                                    type="text" 
                                    placeholder="Wpisz swój login" 
                                    value={credentials.username}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="field-auth">
                                <label className="input-label">
                                    <span className="label-icon">🔒</span> Hasło
                                </label>
                                <input 
                                    name="password" 
                                    type="password" 
                                    placeholder="Wpisz hasło" 
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <button type="submit" className="submit-btn-glow" disabled={loading}>
                                {loading ? 'Logowanie...' : 'Zaloguj się'}
                            </button>
                        </form>

                        <div className="switch-text">
                            Nie masz konta? 
                            <button className="switch-btn" onClick={toggleView}>Zarejestruj się</button>
                        </div>
                    </div>

                    {/* TYŁ - REJESTRACJA */}
                    <div className="card-back">
                        <h1 className="brand-title">Dołącz do nas</h1>
                        <p className="subtitle">Zacznij oszczędzać już dziś 🚀</p>

                        <form onSubmit={handleRegister}>
                            <div className="field-auth">
                                <label className="input-label">
                                    <span className="label-icon">✉️</span> Email
                                </label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="twoj@email.com" 
                                    value={credentials.email}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="field-auth">
                                <label className="input-label">
                                    <span className="label-icon">👤</span> Login
                                </label>
                                <input 
                                    name="username" 
                                    type="text" 
                                    placeholder="Wybierz unikalny login" 
                                    value={credentials.username}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="field-auth">
                                <label className="input-label">
                                    <span className="label-icon">🔑</span> Hasło
                                </label>
                                <input 
                                    name="password" 
                                    type="password" 
                                    placeholder="Minimum 8 znaków" 
                                    value={credentials.password}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <button type="submit" className="submit-btn-glow" style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'}} disabled={loading}>
                                {loading ? 'Tworzenie...' : 'Stwórz konto'}
                            </button>
                        </form>

                        <div className="switch-text">
                            Masz już konto? 
                            <button className="switch-btn" onClick={toggleView} style={{color:'#10b981', borderColor:'#10b981'}}>Zaloguj się</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LoginPage;