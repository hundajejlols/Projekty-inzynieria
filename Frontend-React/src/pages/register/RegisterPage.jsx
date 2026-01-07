import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
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

        // Prosta walidacja haseł
        if (userData.password !== userData.confirmPassword) {
            return setError('Hasła nie są identyczne');
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:8080/api/register', {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            
            // Po sukcesie przekieruj do logowania
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
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="brand-icon">📈</div>
                    <h2>Dołącz do nas</h2>
                    <p className="subtitle">Zacznij budować swoje oszczędności</p>

                    {error && <div className="error-alert">{error}</div>}

                    <div className="input-group">
                        <div className="field">
                            <label>Nazwa użytkownika</label>
                            <input 
                                name="username" 
                                type="text" 
                                placeholder="np. jankowalski" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="field">
                            <label>Adres Email</label>
                            <input 
                                name="email" 
                                type="email" 
                                placeholder="email@przyklad.pl" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="field">
                            <label>Hasło</label>
                            <input 
                                name="password" 
                                type="password" 
                                placeholder="Min. 8 znaków" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>

                        <div className="field">
                            <label>Powtórz hasło</label>
                            <input 
                                name="confirmPassword" 
                                type="password" 
                                placeholder="••••••••" 
                                required 
                                onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <button type="submit" className="register-btn" disabled={loading}>
                        {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
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