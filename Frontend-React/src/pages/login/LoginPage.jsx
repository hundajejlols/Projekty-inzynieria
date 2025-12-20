import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        // Na potrzeby frontendu - zawsze wpuszczamy do dashboardu
        navigate('/dashboard');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="brand-logo">💰</div>
                    <h2>{isLoginMode ? 'Witaj ponownie' : 'Stwórz konto'}</h2>
                    <p className="subtitle">Zarządzaj budżetem z głową</p>
                    
                    <div className="input-group-auth">
                        {!isLoginMode && (
                            <div className="field-auth">
                                <label>Email</label>
                                <input name="email" type="email" placeholder="email@przyklad.pl" required />
                            </div>
                        )}
                        <div className="field-auth">
                            <label>Użytkownik</label>
                            <input name="username" type="text" placeholder="Twój login" required />
                        </div>
                        <div className="field-auth">
                            <label>Hasło</label>
                            <input name="password" type="password" placeholder="••••••••" required />
                        </div>
                    </div>

                    <button type="submit" className="submit-btn-auth">
                        {isLoginMode ? 'Zaloguj się' : 'Zarejestruj się'}
                    </button>

                    <div className="switch-mode">
                        {isLoginMode ? 'Pierwszy raz tutaj?' : 'Masz już konto?'} 
                        <span onClick={() => setIsLoginMode(!isLoginMode)}>
                            {isLoginMode ? ' Załóż konto' : ' Zaloguj się'}
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;