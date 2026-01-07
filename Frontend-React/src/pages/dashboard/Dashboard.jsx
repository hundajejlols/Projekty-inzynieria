import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import AddReceiptModal from '../addReceipts/AddReceiptModal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'; // Biblioteka wykresów
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const userName = localStorage.getItem('username') || 'Użytkownik';

    // Kolory do wykresu
    const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('pl-PL', {
            style: 'currency', currency: 'PLN', minimumFractionDigits: 2
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('pl-PL', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        });
    };

    const fetchData = async () => {
        try {
            const [receiptsRes, userRes] = await Promise.all([
                axios.get(`${API_URL}/receipts`),
                axios.get(`${API_URL}/user/${userName}`)
            ]);
            setTransactions(receiptsRes.data.reverse()); // Wszystkie, żeby liczyć statystyki
            setBalance(userRes.data.balance);
        } catch (err) {
            console.error("Błąd pobierania danych:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Obliczanie danych do wykresu (grupowanie po kategorii)
    const chartData = useMemo(() => {
        const grouped = {};
        transactions.forEach(t => {
            const cat = t.category || 'Inne';
            if (!grouped[cat]) grouped[cat] = 0;
            grouped[cat] += t.totalAmount;
        });
        
        return Object.keys(grouped).map(key => ({
            name: key,
            value: grouped[key]
        }));
    }, [transactions]);

    const handleAddIncome = async () => {
        const amountStr = window.prompt("Wpisz kwotę wypłaty/przychodu:");
        if (amountStr === null) return;
        const amount = parseFloat(amountStr.replace(',', '.'));

        if (!isNaN(amount) && amount > 0) {
            try {
                await axios.post(`${API_URL}/user/add-balance`, { username: userName, amount });
                fetchData();
                alert(`Dodano ${formatCurrency(amount)}`);
            } catch (err) {
                alert("Błąd");
            }
        } else {
            alert("Zła kwota");
        }
    };

    const handleLogout = () => {
        if (window.confirm("Wylogować?")) {
            localStorage.removeItem('username');
            navigate('/login');
        }
    };

    if (isLoading) return <div className="loading-screen">Ładowanie pulpitu... ⏳</div>;

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
                        <h3 className={balance < 0 ? 'balance-negative' : 'balance-positive'}>
                            {formatCurrency(balance)}
                        </h3>
                    </div>
                    <div className="stat-card">
                        <span>Wydano łącznie</span>
                        <h3 style={{color: '#ef4444'}}>
                            {formatCurrency(transactions.reduce((acc, t) => acc + t.totalAmount, 0))}
                        </h3>
                    </div>
                    <div className="stat-card">
                        <span>Liczba transakcji</span>
                        <h3 style={{color: '#2563eb'}}>{transactions.length}</h3>
                    </div>
                </div>

                <div className="dash-grid">
                    {/* LEWA KOLUMNA: Wykres i lista */}
                    <div className="left-column" style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                        
                        {/* NOWOŚĆ: Wykres */}
                        <section className="chart-section" style={{background:'white', padding:'2rem', borderRadius:'20px', boxShadow:'0 4px 6px rgba(0,0,0,0.02)'}}>
                            <h3>Struktura wydatków</h3>
                            {chartData.length > 0 ? (
                                <div style={{width:'100%', height: 300}}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%" cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <p style={{color:'#94a3b8', textAlign:'center', marginTop:'2rem'}}>Brak danych do wykresu</p>
                            )}
                        </section>

                        <section className="recent-activity">
                            <div className="section-header-flex">
                                <h3>Ostatnie 5 paragonów</h3>
                                <button className="text-btn" onClick={() => navigate('/transactions')}>Więcej</button>
                            </div>
                            <div className="t-list">
                                {transactions.slice(0, 5).map(t => (
                                    <div key={t.id} className="t-row">
                                        <div className="t-info">
                                            <strong>{t.shopName}</strong>
                                            <small>{t.category || 'Inne'} • {formatDate(t.date)}</small>
                                        </div>
                                        <strong className="amount-negative">-{formatCurrency(t.totalAmount)}</strong>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* PRAWA KOLUMNA */}
                    <section className="quick-tools">
                        <h3>Szybkie akcje</h3>
                        <button className="btn-add" onClick={() => setIsModalOpen(true)}>+ Dodaj paragon</button>
                        <button className="btn-income" onClick={handleAddIncome}>💰 Dodaj wypłatę</button>
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