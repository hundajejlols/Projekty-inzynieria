import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        const endpoint = isLoginMode ? '/api/login' : '/api/register';
        
        try {
            // W prawdziwej aplikacji upewnij się, że URL pochodzi z .env
            const response = await axios.post(`http://localhost:8080${endpoint}`, credentials);
            
            if (isLoginMode) {
                console.log("Zalogowano pomyślnie");
                // Tutaj zazwyczaj zapisujesz token: localStorage.setItem('token', response.data.token);
                navigate('/dashboard');
            } else {
                setMessage('Konto utworzone! Możesz się teraz zalogować.');
                setIsLoginMode(true);
                setCredentials({ username: '', password: '', email: '' });
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Coś poszło nie tak. Spróbuj ponownie.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="brand-logo">💰</div>
                    <h2>{isLoginMode ? 'Witaj ponownie' : 'Stwórz konto'}</h2>
                    <p className="subtitle">
                        {isLoginMode ? 'Zarządzaj swoim budżetem z głową' : 'Zacznij kontrolować swoje wydatki'}
                    </p>
                    
                    {error && <div className="error-msg">{error}</div>}
                    {message && <div className="success-msg">{message}</div>}

                    <div className="input-group">
                        {!isLoginMode && (
                            <div className="input-field">
                                <label>Email</label>
                                <input 
                                    name="email" 
                                    type="email" 
                                    placeholder="np. jan@kowalski.pl" 
                                    required 
                                    value={credentials.email}
                                    onChange={handleChange} 
                                />
                            </div>
                        )}

                        <div className="input-field">
                            <label>Użytkownik</label>
                            <input 
                                name="username" 
                                type="text" 
                                placeholder="Twój login" 
                                required 
                                value={credentials.username}
                                onChange={handleChange} 
                            />
                        </div>
                        
                        <div className="input-field">
                            <label>Hasło</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                value={credentials.password}
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn">
                        {isLoginMode ? 'Zaloguj się' : 'Zarejestruj się'}
                    </button>

                    <div className="switch-mode">
                        {isLoginMode ? 'Pierwszy raz tutaj?' : 'Masz już konto?'} 
                        <span onClick={() => {
                            setIsLoginMode(!isLoginMode);
                            setError('');
                            setMessage('');
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