import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddReceiptModal from '../addReceipts/AddReceiptModal';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userName = localStorage.getItem('username') || 'Użytkownik';

    const fetchData = async () => {
        try {
            // Pobieramy paragony
            const receiptsRes = await axios.get('http://localhost:8080/api/receipts');
            setTransactions(receiptsRes.data.slice(0, 5));
            
            // Pobieramy aktualne saldo użytkownika
            const userRes = await axios.get(`http://localhost:8080/api/user/${userName}`);
            setBalance(userRes.data.balance);
        } catch (err) {
            console.error("Błąd pobierania danych:", err);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleAddIncome = async () => {
        const amount = prompt("Wpisz kwotę wypłaty/przychodu:");
        if (amount && !isNaN(amount)) {
            try {
                await axios.post('http://localhost:8080/api/user/add-balance', {
                    username: userName,
                    amount: parseFloat(amount)
                });
                fetchData(); // Odświeżamy dane (saldo)
            } catch (err) {
                alert("Błąd podczas dodawania środków");
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/login');
    };

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar-container">
                <div className="sidebar-header">💰 BudżetDomowy</div>
                <nav className="sidebar-links">
                    <div className="s-link active">📊 Pulpit</div>
                    <div className="s-link" onClick={() => navigate('/transactions')}>💸 Transakcje</div>
                </nav>
                <button className="s-logout" onClick={handleLogout}>Wyloguj</button>
            </aside>

            <main className="dashboard-main">
                <header className="dash-header">
                    <h1>Cześć, {userName}! 👋</h1>
                    <p>Twoje finanse pod kontrolą.</p>
                </header>

                <div className="stat-cards">
                    <div className="stat-card">
                        <span>Aktualne Saldo</span>
                        <h3>{balance.toFixed(2)} PLN</h3>
                    </div>
                    {/* Reszta kart... */}
                </div>

                <div className="dash-grid">
                    <section className="recent-activity">
                        <div className="section-header-flex">
                            <h3>Ostatnie paragony</h3>
                            <button className="text-btn" onClick={() => navigate('/transactions')}>Zobacz wszystkie</button>
                        </div>
                        <div className="t-list">
                            {transactions.map(t => (
                                <div key={t.id} className="t-row">
                                    <div className="t-info">
                                        <strong>{t.shopName}</strong>
                                        <small>{t.date}</small>
                                    </div>
                                    <strong>-{t.totalAmount.toFixed(2)} PLN</strong>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="quick-tools">
                        <h3>Szybkie akcje</h3>
                        <button className="btn-add" onClick={() => setIsModalOpen(true)}>+ Dodaj paragon</button>
                        <button className="btn-income" onClick={handleAddIncome} style={{backgroundColor: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', marginTop: '10px', width: '100%'}}>
                            💰 Dodaj wypłatę
                        </button>
                    </section>
                </div>
            </main>

            <AddReceiptModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onRefresh={fetchData} 
            />
        </div>
    );
};

export default Dashboard;