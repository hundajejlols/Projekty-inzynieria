import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/api/login', credentials);
            console.log("Sukces:", response.data);
            navigate('/dashboard'); // Przekierowanie po sukcesie
        } catch (err) {
            setError('Nieudane logowanie. Spróbuj: admin / password');
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>Logowanie</h2>
                {error && <p style={{color: 'red'}}>{error}</p>}
                <input name="username" type="text" placeholder="Login" 
                       onChange={(e) => setCredentials({...credentials, username: e.target.value})} />
                <input name="password" type="password" placeholder="Hasło" 
                       onChange={(e) => setCredentials({...credentials, password: e.target.value})} />
                <button type="submit">Zaloguj</button>
            </form>
        </div>
    );
};

export default LoginPage;