import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import AddReceiptModal from '../addReceipts/AddReceiptModal';
import AddIncomeModal from '../addIncome/AddIncomeModal';
import FamilyModal from '../family/FamilyModal';
import EditLimitModal from './EditLimitModal';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { toast } from 'react-toastify';
import { CATEGORY_ICONS_QB } from '../../utils/constants';
import { Moon, Sun } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [balance, setBalance] = useState(0);
    const [familyData, setFamilyData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
    const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
    const [isEditLimitOpen, setIsEditLimitOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState({ name: '', limit: 0 });
    const [isBudgetExpanded, setIsBudgetExpanded] = useState(true); 

    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
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
                axios.get(`${API_URL}/receipts/${userName}`),
                axios.get(`${API_URL}/user/${userName}`)
            ]);
            setTransactions(receiptsRes.data.reverse());
            setBalance(userRes.data.balance);
            if(userRes.data.family) setFamilyData(userRes.data.family);
            else setFamilyData(null);
        } catch (err) {
            console.error("Błąd:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [isDark]);

    const toggleTheme = () => {
        setIsDark(prev => !prev);
    };

    const filteredTransactions = useMemo(() => {
        return transactions.filter(t => t.date.startsWith(selectedMonth));
    }, [transactions, selectedMonth]);

    const spendingByCategory = useMemo(() => {
        const stats = {};
        filteredTransactions.forEach(t => {
            const cat = t.category || 'Inne';
            stats[cat] = (stats[cat] || 0) + t.totalAmount;
        });
        return stats;
    }, [filteredTransactions]);

    const chartData = useMemo(() => {
        return Object.keys(spendingByCategory).map(key => ({ name: key, value: spendingByCategory[key] }));
    }, [spendingByCategory]);

    const monthlySpent = useMemo(() => filteredTransactions.reduce((acc, t) => acc + t.totalAmount, 0), [filteredTransactions]);

    const openEditLimit = (category) => {
        setEditingCategory({ name: category, limit: limits[category] });
        setIsEditLimitOpen(true);
    };

    const saveLimit = (category, newLimit) => {
        const updatedLimits = { ...limits, [category]: newLimit };
        setLimits(updatedLimits);
        localStorage.setItem(`budgetLimits_${userName}`, JSON.stringify(updatedLimits));
        toast.success(`Zaktualizowano limit dla: ${category}`);
    };

    const getProgressBarColor = (spent, limit) => {
        const percentage = (spent / limit) * 100;
        if (percentage >= 100) return '#ef4444'; 
        if (percentage >= 80) return '#f59e0b';  
        return '#10b981';                         
    };

    const handleExportCSV = () => {
        if (filteredTransactions.length === 0) {
            toast.warn("Brak danych do eksportu w tym miesiącu.");
            return;
        }
        const headers = ["Data", "Sklep", "Kategoria", "Kwota (PLN)", "Typ"];
        const rows = filteredTransactions.map(t => [
            t.date, `"${t.shopName}"`, t.category, t.totalAmount.toFixed(2), t.isFamilyExpense ? "Rodzinny" : "Osobisty"
        ]);
        const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `wydatki_${selectedMonth}_${userName}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Pobrano plik CSV 📥");
    };

    const handleLogout = () => {
        if (window.confirm("Wylogować?")) {
            localStorage.removeItem('username');
            localStorage.removeItem('jwtToken');
            navigate('/login');
            toast.info("Wylogowano pomyślnie 👋");
        }
    };

    if (isLoading) return <div className="dashboard-wrapper loading-wrapper">Loading...</div>;

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar-container">
                <div className="sidebar-header" onClick={() => navigate('/dashboard')} style={{cursor:'pointer'}}>💰 BudżetDomowy</div>
                <nav className="sidebar-links">
                    <div className="s-link active">📊 Pulpit</div>
                    <div className="s-link" onClick={() => navigate('/transactions')}>💸 Transakcje</div>
                    <div className="s-link" onClick={() => setIsFamilyModalOpen(true)}>👨‍👩‍👧‍👦 Rodzina</div>
                </nav>
                <div style={{marginTop: 'auto', paddingBottom: '10px'}}>
                    <button className="s-export" onClick={handleExportCSV}>📥 Eksportuj CSV</button>
                    <div style={{display:'flex', justifyContent:'center', marginTop: '10px'}}>
                        <button onClick={toggleTheme} className="theme-toggle" style={{background:'transparent', border:'none', cursor:'pointer', color:'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px'}}>
                            {isDark ? <Sun size={20} /> : <Moon size={20} />} <span>Tryb {isDark ? 'jasny' : 'ciemny'}</span>
                        </button>
                    </div>
                </div>
                <button className="s-logout" onClick={handleLogout}>Wyloguj</button>
            </aside>

            <main className="dashboard-main">
                <header className="dash-header">
                    <div>
                        <h1>Cześć, {userName}! 👋</h1>
                        <p>Twoje finanse pod kontrolą.</p>
                    </div>
                    <div className="month-selector">
                        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="modern-date-input"/>
                    </div>
                </header>

                <div className="stat-cards">
                    <div className="stat-card">
                        <span>Dostępne Saldo</span>
                        <h3 className={balance < 0 ? 'balance-negative' : 'balance-positive'}>{formatCurrency(balance)}</h3>
                    </div>
                    <div className="stat-card">
                        <span>Wydatki ({selectedMonth})</span>
                        <h3 style={{color: 'var(--danger)'}}>{formatCurrency(monthlySpent)}</h3>
                    </div>
                    <div className="stat-card" style={{borderColor: familyData ? 'var(--primary)' : 'var(--border-color)'}}>
                        <span>Budżet Rodzinny</span>
                        {familyData ? <h3 style={{color: 'var(--primary)'}}>{formatCurrency(familyData.familyBalance)}</h3> 
                        : <div style={{marginTop:'10px', color:'var(--text-secondary)', fontSize:'0.9rem', cursor:'pointer'}} onClick={() => setIsFamilyModalOpen(true)}>+ Utwórz / Dołącz</div>}
                    </div>
                </div>

                <div className="dash-grid">
                    <div className="left-column" style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                        <section className="chart-section">
                            <h3>Struktura wydatków ({selectedMonth})</h3>
                            {chartData.length > 0 ? (
                                <div style={{width:'100%', height: 300}}>
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie 
                                                data={chartData} 
                                                cx="50%" 
                                                cy="50%" 
                                                innerRadius={60} 
                                                outerRadius={100} 
                                                paddingAngle={5} 
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                            </Pie>
                                            <Tooltip formatter={(value) => formatCurrency(value)} />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : <p style={{color:'var(--text-secondary)', textAlign:'center', marginTop:'2rem'}}>Brak wydatków w wybranym miesiącu 📅</p>}
                        </section>

                        <section className="recent-activity">
                            <div className="section-header-flex" style={{display:'flex', justifyContent:'space-between', marginBottom:'1.5rem'}}>
                                <h3>Ostatnie transakcje</h3>
                                <button className="text-btn" onClick={() => navigate('/transactions')}>Pełna historia →</button>
                            </div>
                            <div className="t-list">
                                {filteredTransactions.slice(0, 5).map(t => {
                                    const IconComponent = CATEGORY_ICONS_QB[t.category] || CATEGORY_ICONS_QB['Inne'];
                                    return (
                                        <div key={t.id} className="t-row">
                                            <div className="t-info" style={{display:'flex', gap:'10px', alignItems:'center'}}>
                                                <div style={{color:'var(--primary)', background:'var(--primary-light)', padding:'8px', borderRadius:'10px'}}>
                                                    <IconComponent size={20} />
                                                </div>
                                                <div>
                                                    <strong>{t.shopName}</strong>
                                                    <small>{t.category || 'Inne'} • {formatDate(t.date)}</small>
                                                </div>
                                            </div>
                                            <strong className="amount-negative">-{formatCurrency(t.totalAmount)}</strong>
                                        </div>
                                    );
                                })}
                                {filteredTransactions.length === 0 && <p style={{padding:'10px', color:'var(--text-secondary)'}}>Brak transakcji.</p>}
                            </div>
                        </section>
                    </div>

                    <div className="right-column" style={{display:'flex', flexDirection:'column', gap:'2rem'}}>
                        <section className="quick-tools">
                            <h3>Szybkie akcje</h3>
                            <button className="btn-add" onClick={() => setIsReceiptModalOpen(true)}>+ Dodaj paragon</button>
                            <button className="btn-income" onClick={() => setIsIncomeModalOpen(true)}>💰 Dodaj wypłatę</button>
                            {familyData && <button className="btn-income" style={{background:'var(--primary)'}} onClick={() => setIsFamilyModalOpen(true)}>👨‍👩‍👧‍👦 Zarządzaj rodziną</button>}
                        </section>

                        <section className="budget-limits-section">
                            <div 
                                className="section-header-flex" 
                                onClick={() => setIsBudgetExpanded(!isBudgetExpanded)}
                                style={{display:'flex', justifyContent:'space-between', cursor:'pointer', alignItems:'center'}}
                            >
                                <h3>Cele budżetowe 🎯</h3>
                                <span style={{fontSize:'1.2rem', color:'var(--text-secondary)'}}>
                                    {isBudgetExpanded ? '▲' : '▼'}
                                </span>
                            </div>
                            
                            {isBudgetExpanded && (
                                <div className="limits-list" style={{marginTop:'1.5rem', animation: 'fadeIn 0.3s'}}>
                                    {Object.keys(limits).map(cat => {
                                        const spent = spendingByCategory[cat] || 0;
                                        const limit = limits[cat];
                                        const percentage = Math.min((spent / limit) * 100, 100);
                                        const color = getProgressBarColor(spent, limit);

                                        return (
                                            <div key={cat} className="limit-item">
                                                <div className="limit-header">
                                                    <span className="limit-name">{cat}</span>
                                                    <span className="limit-values" onClick={() => openEditLimit(cat)} title="Kliknij, aby edytować">
                                                        {formatCurrency(spent)} / <strong>{formatCurrency(limit)}</strong> ✏️
                                                    </span>
                                                </div>
                                                <div className="progress-bar-bg">
                                                    <div className="progress-bar-fill" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>

            <AddReceiptModal isOpen={isReceiptModalOpen} onClose={() => setIsReceiptModalOpen(false)} onRefresh={fetchData} />
            <AddIncomeModal isOpen={isIncomeModalOpen} onClose={() => setIsIncomeModalOpen(false)} onRefresh={fetchData} />
            <FamilyModal isOpen={isFamilyModalOpen} onClose={() => setIsFamilyModalOpen(false)} onRefresh={fetchData} currentFamily={familyData} />
            
            <EditLimitModal 
                isOpen={isEditLimitOpen} 
                onClose={() => setIsEditLimitOpen(false)} 
                onSave={saveLimit}
                category={editingCategory.name}
                currentLimit={editingCategory.limit}
            />
        </div>
    );
};

export default Dashboard;