import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_URL } from '../../config';
import './Register.css';

const RegisterPage = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (userData.password !== userData.confirmPassword) {
            return setError('Hasła nie są identyczne');
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/register`, {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            
            navigate('/login', { state: { message: 'Konto utworzone! Zaloguj się.' } });
        } catch (err) {
            setError(err.response?.data?.message || 'Błąd rejestracji. Spróbuj inny login/email.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <div className="register-header">
                    <div style={{fontSize: '3rem', marginBottom: '10px'}}>🚀</div>
                    <h2>Stwórz konto</h2>
                    <p>Rozpocznij swoją finansową podróż</p>
                </div>

                {error && (
                    <div className="error-alert" style={{background: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center'}}>
                        {error}
                    </div>
                )}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="input-group" style={{display: 'flex', flexDirection: 'column', gap: '15px'}}>
                        <div className="field">
                            <label>Nazwa użytkownika</label>
                            <input 
                                name="username" 
                                type="text" 
                                placeholder="Twój unikalny login" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="field">
                            <label>Adres Email</label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="przyklad@email.com" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="field">
                            <label>Hasło</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Minimum 8 znaków" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="field">
                            <label>Powtórz hasło</label>
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                placeholder="Potwierdź hasło" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-btn" disabled={loading}>
                        {loading ? 'Tworzenie konta...' : 'Zarejestruj się za darmo'}
                    </button>

                    <div className="login-link">
                        Masz już konto? <Link to="/login">Zaloguj się</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;