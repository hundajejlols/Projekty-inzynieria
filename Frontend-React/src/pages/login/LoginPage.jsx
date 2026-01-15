import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify'; 
import './Login.css';

const LoginPage = () => {
    const [isLoginView, setIsLoginView] = useState(true);
    const [credentials, setCredentials] = useState({ username: '', password: '', email: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setCredentials({ ...credentials, [e.target.name]: e.target.value });

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                username: credentials.username,
                password: credentials.password
            });
            const { token, username } = response.data;
            if (token) {
                localStorage.setItem('jwtToken', token);
                localStorage.setItem('username', username);
                toast.success(`Witaj, ${username}!`);
                navigate('/dashboard');
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Błąd logowania');
        } finally { setLoading(false); }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (credentials.password.length < 8) {
            toast.warn('Hasło min. 8 znaków'); return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_URL}/register`, credentials);
            toast.success('Konto utworzone. Zaloguj się.');
            setIsLoginView(true);
            setCredentials({ ...credentials, password: '' });
        } catch (err) {
            toast.error('Błąd rejestracji. Login/email zajęty.');
        } finally { setLoading(false); }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card">
                <div className="login-header">
                    <div className="logo-icon">💰</div>
                    <h1>BudżetDomowy</h1>
                    <p>{isLoginView ? 'Zaloguj się do panelu' : 'Załóż nowe konto'}</p>
                </div>

                <form onSubmit={isLoginView ? handleLogin : handleRegister}>
                    {!isLoginView && (
                        <div className="form-group">
                            <label>Email</label>
                            <input name="email" type="email" placeholder="jan@kowalski.pl" onChange={handleChange} required />
                        </div>
                    )}
                    
                    <div className="form-group">
                        <label>Użytkownik</label>
                        <input name="username" type="text" placeholder="Login" onChange={handleChange} required />
                    </div>
                    
                    <div className="form-group">
                        <label>Hasło</label>
                        <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Przetwarzanie...' : (isLoginView ? 'Zaloguj się' : 'Zarejestruj się')}
                    </button>
                </form>

                <div className="login-footer">
                    {isLoginView ? 'Nie masz konta? ' : 'Masz już konto? '}
                    <span onClick={() => setIsLoginView(!isLoginView)}>
                        {isLoginView ? 'Załóż je tutaj' : 'Zaloguj się'}
                    </span>
                </div>
            </div>
            
            <div className="login-footer-text">
                © 2026 BudżetDomowy Enterprise. Bezpieczeństwo i kontrola.
            </div>
        </div>
    );
};

export default LoginPage;