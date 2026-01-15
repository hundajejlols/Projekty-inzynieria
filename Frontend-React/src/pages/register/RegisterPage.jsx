import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import '../login/Login.css';
import './Register.css';

const RegisterPage = () => {
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            toast.warn('Hasła nie są identyczne');
            return;
        }
        setLoading(true);
        try {
            await axios.post(`${API_URL}/register`, {
                username: userData.username,
                email: userData.email,
                password: userData.password
            });
            toast.success('Konto utworzone! Zaloguj się.');
            navigate('/login');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Błąd rejestracji.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-wrapper">
            <div className="login-card" style={{ maxWidth: '450px' }}>
                <div className="login-header">
                    <div className="logo-icon">💰</div>
                    <h1>Stwórz konto</h1>
                    <p>Dołącz do BudżetDomowy</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Nazwa użytkownika</label>
                        <input name="username" type="text" placeholder="Login" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input name="email" type="email" placeholder="Email" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Hasło (min. 8 znaków)</label>
                        <input name="password" type="password" placeholder="••••••••" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Powtórz hasło</label>
                        <input name="confirmPassword" type="password" placeholder="••••••••" required onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Tworzenie konta...' : 'Zarejestruj się'}
                    </button>
                </form>
                <div className="login-footer">
                    Masz już konto? <span onClick={() => navigate('/login')}>Zaloguj się</span>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;