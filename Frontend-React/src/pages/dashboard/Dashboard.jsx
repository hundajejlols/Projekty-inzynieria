import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar-container">
                <div className="sidebar-header">💰 BudżetDomowy</div>
                <nav className="sidebar-links">
                    <div className="s-link active">📊 Pulpit</div>
                    <div className="s-link">💸 Transakcje</div>
                    <div className="s-link">🎯 Cele</div>
                </nav>
                <button className="s-logout" onClick={() => navigate('/login')}>Wyloguj</button>
            </aside>

            <main className="dashboard-main">
                <header className="dash-header">
                    <h1>Cześć, Jan! 👋</h1>
                    <p>Oto Twój aktualny stan finansów.</p>
                </header>

                <div className="stat-cards">
                    <div className="stat-card"><span>Saldo</span><h3>12,450 PLN</h3></div>
                    <div className="stat-card exp"><span>Wydatki</span><h3>3,200 PLN</h3></div>
                    <div className="stat-card sav"><span>Oszczędności</span><h3>5,000 PLN</h3></div>
                </div>

                <div className="dash-grid">
                    <section className="recent-activity">
                        <h3>Ostatnie transakcje</h3>
                        <div className="t-row"><span>🛒 Zakupy</span><strong>-150 PLN</strong></div>
                        <div className="t-row"><span>💼 Praca</span><strong className="plus">+8000 PLN</strong></div>
                    </section>

                    <section className="quick-tools">
                        <h3>Szybkie akcje</h3>
                        <button className="btn-add">+ Dodaj przychód</button>
                        <button className="btn-rem">- Dodaj wydatek</button>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;