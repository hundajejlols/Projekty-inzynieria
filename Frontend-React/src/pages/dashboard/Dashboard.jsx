import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import AddReceiptModal from '../addReceipts/AddReceiptModal';
import AddIncomeModal from '../addIncome/AddIncomeModal'; // Import nowego modala
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'react-toastify'; // Import toastów
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false); // Stan dla modala wpłaty
    const [isLoading, setIsLoading] = useState(true);
    const userName = localStorage.getItem('username') || 'Użytkownik';

    const defaultLimits = {
        'Zakupy': 1000, 'Jedzenie': 1200, 'Transport': 500,
        'Rozrywka': 300, 'Dom': 600, 'Zdrowie': 200, 'Inne': 150
    };

    const [limits, setLimits] = useState(() => {
        const saved = localStorage.getItem(`budgetLimits_${userName}`);
        return saved ? JSON.parse(saved) : defaultLimits;
    });

    const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#64748b'];

    const formatCurrency = (amount) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(amount);
    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString('pl-PL') : '-';

    const fetchData = async () => {
        try {
            const [receiptsRes, userRes] = await Promise.all([
                axios.get(`${API_URL}/receipts`),
                axios.get(`${API_URL}/user/${userName}`)
            ]);
            setTransactions(receiptsRes.data.reverse());
            setBalance(userRes.data.balance);
        } catch (err) {
            console.error("Błąd:", err);
            // Nie spamujemy toastami przy każdym odświeżeniu, tylko w konsoli
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const spendingByCategory = useMemo(() => {
        const stats = {};
        transactions.forEach(t => {
            const cat = t.category || 'Inne';
            stats[cat] = (stats[cat] || 0) + t.totalAmount;
        });
        return stats;
    }, [transactions]);

    const chartData = useMemo(() => {
        return Object.keys(spendingByCategory).map(key => ({ name: key, value: spendingByCategory[key] }));
    }, [spendingByCategory]);

    const handleEditLimit = (category) => {
        // Tu zostawiamy prompt, bo robienie modala do edycji każdego limitu to overkill na teraz, 
        // ale można to też zmienić w przyszłości.
        const currentLimit = limits[category];
        const newLimit = prompt(`Nowy limit dla: ${category}`, currentLimit);
        
        if (newLimit !== null && !isNaN(newLimit) && Number(newLimit) > 0) {
            const updatedLimits = { ...limits, [category]: parseFloat(newLimit) };
            setLimits(updatedLimits);
            localStorage.setItem(`budgetLimits_${userName}`, JSON.stringify(updatedLimits));
            toast.info(`Zaktualizowano limit dla ${category}`);
        }
    };

    const getProgressBarColor = (spent, limit) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return '#ef4444'; 
        if (percentage >= 80) return '#f59e0b';  
        return '#10b981';                         
    };

    const handleLogout = () => {
        // Zastępujemy window.confirm własnym UI albo zostawiamy systemowy, 
        // ale toasty tutaj nie pasują (bo to pytanie przed akcją).
        // Dla uproszczenia zostawmy confirm, bo jest bezpieczny.
        if (window.confirm("Wylogować?")) {
            localStorage.removeItem('username');
            navigate('/login');
            toast.info("Wylogowano pomyślnie 👋");
        }
    };

    if (isLoading) {
        // SKELETON LOADING (Mały bonus wizualny)
        return (
            <div className="dashboard-wrapper loading-wrapper">
                <div className="skeleton-sidebar"></div>
                <div className="skeleton-main">
                    <div className="skeleton-header"></div>
                    <div className="skeleton-cards"></div>
                </div>
            </div>
        );
    }

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
                        <span>Transakcje</span>
                        <h3 style={{color: '#2563eb'}}>{transactions.length}</h3>
                    </div>
                </div>

                <div className="dash-grid">
                    <div className="left-column" style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                        <section className="chart-section" style={{background:'white', padding:'2rem', borderRadius:'20px', boxShadow:'0 4px 6px rgba(0,0,0,0.02)', border:'1px solid #f1f5f9'}}>
                            <h3>Struktura wydatków</h3>
                            {chartData.length > 0 ? (
                                <div style={{width:'100%', height: 300}}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={chartData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : <p style={{color:'#94a3b8', textAlign:'center', marginTop:'2rem'}}>Brak danych do wykresu 📊</p>}
                        </section>

                        <section className="recent-activity">
                            <div className="section-header-flex">
                                <h3>Ostatnie aktywności</h3>
                                <button className="text-btn" onClick={() => navigate('/transactions')}>Pełna historia</button>
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

                    <div className="right-column" style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                        <section className="quick-tools">
                            <h3>Szybkie akcje</h3>
                            <button className="btn-add" onClick={() => setIsReceiptModalOpen(true)}>+ Dodaj paragon</button>
                            <button className="btn-income" onClick={() => setIsIncomeModalOpen(true)}>💰 Dodaj wypłatę</button>
                        </section>

                        <section className="budget-limits-section">
                            <h3>Realizacja Budżetu</h3>
                            <div className="limits-list">
                                {Object.keys(limits).map(cat => {
                                    const spent = spendingByCategory[cat] || 0;
                                    const limit = limits[cat];
                                    const percentage = Math.min((spent / limit) * 100, 100);
                                    const color = getProgressBarColor(spent, limit);

                                    return (
                                        <div key={cat} className="limit-item">
                                            <div className="limit-header">
                                                <span className="limit-name">{cat}</span>
                                                <span className="limit-values" onClick={() => handleEditLimit(cat)} title="Edytuj limit">
                                                    {formatCurrency(spent)} / {formatCurrency(limit)} ✏️
                                                </span>
                                            </div>
                                            <div className="progress-bar-bg">
                                                <div className="progress-bar-fill" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* Modale */}
            <AddReceiptModal 
                isOpen={isReceiptModalOpen} 
                onClose={() => setIsReceiptModalOpen(false)} 
                onRefresh={fetchData} 
            />
            
            <AddIncomeModal 
                isOpen={isIncomeModalOpen}
                onClose={() => setIsIncomeModalOpen(false)}
                onRefresh={fetchData}
            />
        </div>
    );
};

export default Dashboard;