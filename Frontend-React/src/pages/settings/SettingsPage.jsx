import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../dashboard/Dashboard.css';

const SettingsPage = () => {
    const navigate = useNavigate();
    const userName = localStorage.getItem('username');
    
    // Ustawienia wizualne
    const [settings, setSettings] = useState({
        currency: 'PLN',
        darkTheme: false,
        emailNotifications: true
    });

    // Ustawienia konta
    const [accountData, setAccountData] = useState({
        newUsername: userName,
        oldPassword: '',
        newPassword: ''
    });

    useEffect(() => {
        if (!userName) return;
        axios.get(`${API_URL}/settings/${userName}`)
            .then(res => setSettings(res.data))
            .catch(err => console.error(err));
    }, [userName]);

    const handleSaveVisuals = async () => {
        try {
            await axios.post(`${API_URL}/settings/${userName}`, settings);
            localStorage.setItem('currency', settings.currency);
            const theme = settings.darkTheme ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
            toast.success("Ustawienia wizualne zapisane!");
        } catch (e) { toast.error("Błąd zapisu"); }
    };

    const handleUpdateAccount = async () => {
        // Walidacja: jeśli wpisano nowe hasło, musi być też stare
        if (accountData.newPassword && !accountData.oldPassword) {
            toast.warn("Aby zmienić hasło, podaj stare hasło!");
            return;
        }

        try {
            await axios.put(`${API_URL}/user/update`, {
                currentUsername: userName,
                newUsername: accountData.newUsername,
                newPassword: accountData.newPassword,
                oldPassword: accountData.oldPassword
            });
            
            toast.success("Dane konta zaktualizowane!");
            
            if (accountData.newUsername !== userName) {
                localStorage.clear();
                toast.info("Zmieniono login - nastąpi wylogowanie...");
                setTimeout(() => {
                    window.location.href = '/login'; 
                }, 1500);
            } else {
                setAccountData({...accountData, newPassword: '', oldPassword: ''});
                if(accountData.newPassword) toast.info("Hasło zostało zmienione.");
            }
        } catch (e) {
            toast.error(e.response?.data?.error || "Błąd aktualizacji (sprawdź stare hasło)");
        }
    };

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar-container">
                <div className="sidebar-header" onClick={() => navigate('/dashboard')} style={{cursor:'pointer'}}>💰 BudżetDomowy</div>
                <nav className="sidebar-links">
                    <div className="s-link" onClick={() => navigate('/dashboard')}>📊 Pulpit</div>
                    <div className="s-link" onClick={() => navigate('/transactions')}>💸 Transakcje</div>
                    <div className="s-link active">⚙️ Ustawienia</div>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="dash-header"><h1>Ustawienia</h1></header>
                
                <div style={{display:'grid', gap:'2rem', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))'}}>
                    
                    {/* Wygląd */}
                    <div className="login-card" style={{margin:0, width:'100%', maxWidth:'100%'}}>
        <h3>Wygląd i Działanie</h3>
        <div className="form-group" style={{marginTop:'1rem'}}>
            <label>Waluta</label>
            <select 
                value={settings.currency}
                onChange={e => setSettings({...settings, currency: e.target.value})}
                style={{width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-body)', color: 'var(--text-main)'}}
            >
                <option value="PLN">PLN</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
            </select>
        </div>

        {/* ZMIANA TUTAJ: Lepszy przełącznik motywu */}
        <div className="form-group" style={{display: 'flex', alignItems: 'center', gap: '15px', marginTop: '15px', cursor:'pointer'}} onClick={() => setSettings({...settings, darkTheme: !settings.darkTheme})}>
            <div style={{
                width: '50px', 
                height: '26px', 
                background: settings.darkTheme ? 'var(--primary)' : '#cbd5e1', 
                borderRadius: '50px', 
                position: 'relative', 
                transition: 'background 0.3s'
            }}>
                <div style={{
                    width: '20px', 
                    height: '20px', 
                    background: 'white', 
                    borderRadius: '50%', 
                    position: 'absolute', 
                    top: '3px', 
                    left: settings.darkTheme ? '27px' : '3px', 
                    transition: 'left 0.3s',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }} />
            </div>
            <label style={{margin:0, cursor:'pointer', fontWeight:'600'}}>
                {settings.darkTheme ? 'Aktywny Tryb Ciemny 🌙' : 'Aktywny Tryb Jasny ☀️'}
            </label>
        </div>

        <button className="btn-primary" onClick={handleSaveVisuals} style={{marginTop: '20px'}}>Zapisz Wygląd</button>
    </div>

                    {/* Konto */}
                    <div className="login-card" style={{margin:0, width:'100%', maxWidth:'100%'}}>
                        <h3>Bezpieczeństwo Konta</h3>
                        <div className="form-group" style={{marginTop:'1rem'}}>
                            <label>Zmień Nazwę Użytkownika</label>
                            <input 
                                type="text" 
                                className="input-auth"
                                value={accountData.newUsername}
                                onChange={e => setAccountData({...accountData, newUsername: e.target.value})}
                                style={{width:'100%', padding:'10px', background:'var(--bg-body)', color:'var(--text-main)', border:'1px solid var(--border-color)'}}
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Stare Hasło (wymagane do zmiany)</label>
                            <input 
                                type="password" 
                                className="input-auth"
                                placeholder="Aktualne hasło"
                                value={accountData.oldPassword}
                                onChange={e => setAccountData({...accountData, oldPassword: e.target.value})}
                                style={{width:'100%', padding:'10px', background:'var(--bg-body)', color:'var(--text-main)', border:'1px solid var(--border-color)'}}
                            />
                        </div>

                        <div className="form-group">
                            <label>Nowe Hasło</label>
                            <input 
                                type="password" 
                                className="input-auth"
                                placeholder="Nowe hasło (min. 8 znaków)"
                                value={accountData.newPassword}
                                onChange={e => setAccountData({...accountData, newPassword: e.target.value})}
                                style={{width:'100%', padding:'10px', background:'var(--bg-body)', color:'var(--text-main)', border:'1px solid var(--border-color)'}}
                            />
                        </div>
                        {/* ZMIANA: Usunięto override background color, teraz używa domyślnego primary (niebieskiego) */}
                        <button className="btn-primary" onClick={handleUpdateAccount} style={{marginTop: '20px'}}>Aktualizuj Konto</button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;