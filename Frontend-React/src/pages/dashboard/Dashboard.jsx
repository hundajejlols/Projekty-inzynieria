import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddReceiptModal from '../addReceipts/AddReceiptModal'; // Import Twojego nowego modala
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    // Pobieramy imię z localStorage, jeśli go nie ma, używamy domyślnego "Użytkownik"
    const [userName, setUserName] = useState(localStorage.getItem('username') || 'Użytkownik');

    const fetchReceipts = () => {
        axios.get('http://localhost:8080/api/receipts')
            .then(response => {
                setTransactions(response.data.slice(0, 5));
            })
            .catch(err => console.error("Błąd pobierania danych:", err));
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('username'); // Usuwamy imię przy wylogowaniu
        navigate('/login');
    };

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar-container">
                <div className="sidebar-header">💰 BudżetDomowy</div>
                <nav className="sidebar-links">
                    <div className="s-link active">📊 Pulpit</div>
                    <div className="s-link" onClick={() => navigate('/transactions')}>💸 Transakcje</div>
                    <div className="s-link">🎯 Cele</div>
                </nav>
                <button className="s-logout" onClick={handleLogout}>Wyloguj</button>
            </aside>

            <main className="dashboard-main">
                <header className="dash-header">
                    {/* Tutaj imię jest już dynamiczne */}
                    <h1>Cześć, {userName}! 👋</h1>
                    <p>Oto Twój aktualny stan finansów.</p>
                </header>

                <div className="stat-cards">
                    {/* Karty statystyk pozostają bez zmian */}
                    <div className="stat-card"><span>Saldo</span><h3>12,450 PLN</h3></div>
                    <div className="stat-card exp"><span>Wydatki</span><h3>3,200 PLN</h3></div>
                    <div className="stat-card sav"><span>Oszczędności</span><h3>5,000 PLN</h3></div>
                </div>

                <div className="dash-grid">
                    <section className="recent-activity">
                        <div className="section-header-flex">
                            <h3>Ostatnie paragony</h3>
                            <button className="text-btn" onClick={() => navigate('/transactions')}>Szczegóły</button>
                        </div>
                        <div className="t-list">
                            {transactions.map(t => (
                                <div key={t.id} className="t-row">
                                    <div className="t-info">
                                        <strong>{t.shopName}</strong>
                                        <small>{t.date}</small>
                                    </div>
                                    <strong>{t.totalAmount} PLN</strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="quick-tools">
                        <h3>Szybkie akcje</h3>
                        {/* NAPRAWIONY GUZIK: teraz otwiera modal */}
                        <button className="btn-add" onClick={() => setIsModalOpen(true)}>
                            + Dodaj paragon
                        </button>
                        <button className="btn-rem">Eksportuj PDF</button>
                    </section>
                </div>
            </main>

            {/* Dołączamy Modal do kodu */}
            <AddReceiptModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchReceipts} 
            />
        </div>
    );
};

export default Dashboard;