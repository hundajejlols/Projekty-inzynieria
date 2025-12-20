import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);

    // Pobieranie danych z backendu Spring Boot przy starcie komponentu
    useEffect(() => {
        axios.get('http://localhost:8080/api/receipts')
            .then(response => {
                // Wyświetlamy tylko 5 ostatnich na dashboardzie
                setTransactions(response.data.slice(0, 5));
            })
            .catch(err => console.error("Błąd podczas pobierania danych:", err));
    }, []);

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar-container">
                <div className="sidebar-header">💰 BudżetDomowy</div>
                <nav className="sidebar-links">
                    <div className="s-link active">📊 Pulpit</div>
                    <div className="s-link" onClick={() => navigate('/transactions')}>💸 Transakcje</div>
                    <div className="s-link">🎯 Cele</div>
                </nav>
                <button className="s-logout" onClick={() => navigate('/login')}>Wyloguj</button>
            </aside>

            <main className="dashboard-main">
                <header className="dash-header">
                    <h1>Cześć, Jan! 👋</h1>
                    <p>Oto Twój aktualny stan finansów pobrany z bazy H2.</p>
                </header>

                <div className="stat-cards">
                    <div className="stat-card">
                        <span>Saldo całkowite</span>
                        <h3>12,450 PLN</h3>
                    </div>
                    <div className="stat-card exp">
                        <span>Wydatki (miesiąc)</span>
                        <h3>3,200 PLN</h3>
                    </div>
                    <div className="stat-card sav">
                        <span>Oszczędności</span>
                        <h3>5,000 PLN</h3>
                    </div>
                </div>

                <div className="dash-grid">
                    <section className="recent-activity">
                        <div className="section-header-flex">
                            <h3>Ostatnie paragony</h3>
                            <button className="text-btn" onClick={() => navigate('/transactions')}>
                                Zobacz szczegóły
                            </button>
                        </div>
                        <div className="t-list">
                            {transactions.length > 0 ? transactions.map(t => (
                                <div key={t.id} className="t-row">
                                    <div className="t-info">
                                        <strong>{t.shopName}</strong>
                                        <small>{t.date}</small>
                                    </div>
                                    <strong className={t.totalAmount > 0 ? "plus" : ""}>
                                        {t.totalAmount} PLN
                                    </strong>
                                </div>
                            )) : <p>Brak transakcji w bazie.</p>}
                        </div>
                    </section>

                    <section className="quick-tools">
                        <h3>Szybkie akcje</h3>
                        <button className="btn-add">+ Dodaj paragon</button>
                        <button className="btn-rem">Eksportuj PDF</button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;