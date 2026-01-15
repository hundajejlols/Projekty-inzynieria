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
    
    // --- RESET HASŁA ---
    const [isForgotOpen, setIsForgotOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetToken, setResetToken] = useState('');
    const [newPass, setNewPass] = useState('');
    const [resetStep, setResetStep] = useState(1);
    // -------------------

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

    // --- ZMIENIONA FUNKCJA ---
    const handleForgotRequest = async () => {
        if (!resetEmail) {
            toast.warn("Podaj email!");
            return;
        }
        try {
            // Backend wygeneruje token w konsoli
            await axios.post(`${API_URL}/auth/forgot-password`, { email: resetEmail });
            
            // Komunikat dla użytkownika (Dev Mode)
            toast.info("Sukces! Sprawdź konsolę serwera Backend, aby skopiować token.");
            setResetStep(2); // Przechodzimy do wpisywania tokenu
        } catch (e) { 
            toast.error("Błąd: " + (e.response?.data?.error || "Nie znaleziono takiego emaila")); 
        }
    };

    const handleResetConfirm = async () => {
        if (!resetToken || !newPass) {
            toast.warn("Wypełnij wszystkie pola!");
            return;
        }
        try {
            await axios.post(`${API_URL}/auth/reset-password`, { token: resetToken, password: newPass });
            toast.success("Hasło zostało zmienione! Zaloguj się.");
            setIsForgotOpen(false);
            setResetStep(1);
            setResetEmail('');
            setResetToken('');
            setNewPass('');
        } catch (e) { toast.error("Błąd: " + (e.response?.data?.error || "Zły token")); }
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

                {isLoginView && (
                    <div style={{textAlign: 'right', marginTop: '10px'}}>
                        <span onClick={() => setIsForgotOpen(true)} style={{fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer'}}>Zapomniałeś hasła?</span>
                    </div>
                )}

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

            {/* MODAL RESETOWANIA HASŁA */}
            {isForgotOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <div className="login-card" style={{maxWidth: '400px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'}}>
                        <h3 style={{marginBottom: '1rem', color: 'var(--text-main)'}}>
                            Reset Hasła {resetStep === 1 ? '📧' : '🔑'}
                        </h3>
                        
                        {resetStep === 1 ? (
                            <>
                                <p style={{fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}}>
                                    Podaj email powiązany z kontem. Token zostanie wygenerowany w logach serwera.
                                </p>
                                <input 
                                    className="input-auth" // Używamy klasy z CSS jeśli jest, lub inline
                                    style={{width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'8px', border:'1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-main)'}} 
                                    placeholder="Twój email" 
                                    value={resetEmail}
                                    onChange={e => setResetEmail(e.target.value)} 
                                />
                                <button className="btn-primary" onClick={handleForgotRequest}>Generuj Token</button>
                            </>
                        ) : (
                            <>
                                <p style={{fontSize: '0.9rem', marginBottom: '15px', color: 'var(--text-secondary)'}}>
                                    Skopiuj token z konsoli Backend (IntelliJ/Terminal).
                                </p>
                                <input 
                                    style={{width:'100%', padding:'10px', marginBottom:'10px', borderRadius:'8px', border:'1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-main)'}} 
                                    placeholder="Wklej Token" 
                                    value={resetToken}
                                    onChange={e => setResetToken(e.target.value)} 
                                />
                                <input 
                                    style={{width:'100%', padding:'10px', marginBottom:'15px', borderRadius:'8px', border:'1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-main)'}} 
                                    type="password" 
                                    placeholder="Nowe hasło" 
                                    value={newPass}
                                    onChange={e => setNewPass(e.target.value)} 
                                />
                                <button className="btn-primary" onClick={handleResetConfirm}>Zmień hasło</button>
                            </>
                        )}
                        
                        <button style={{
                            marginTop: '10px', width: '100%', padding: '10px', background: 'transparent', 
                            border: '1px solid var(--border-color)', borderRadius: '8px', cursor: 'pointer', color: 'var(--text-secondary)'
                        }} onClick={() => { setIsForgotOpen(false); setResetStep(1); }}>Anuluj</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginPage;