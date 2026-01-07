import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import './Transactions.css';
import { toast } from 'react-toastify';

const Transactions = () => {
    const [receipts, setReceipts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    // Mapowanie kategorii na ikony
    const categoryIcons = {
        'Zakupy': '🛒',
        'Jedzenie': '🍔',
        'Transport': '🚗',
        'Rozrywka': '🎬',
        'Dom': '🏠',
        'Zdrowie': '💊',
        'Inne': '📦'
    };

    const fetchReceipts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/receipts`);
            setReceipts(res.data.reverse());
        } catch (err) {
            console.error("Błąd:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchReceipts(); }, []);

    const handleDelete = async (id) => {
    if (window.confirm("Usunąć paragon?")) {
        try {
            await axios.delete(`${API_URL}/receipts/${id}`);
            setReceipts(curr => curr.filter(r => r.id !== id));
            toast.success("Usunięto transakcję"); // Toast zamiast ciszy
        } catch (err) { 
            toast.error("Błąd podczas usuwania");
        }
    }
};

    const toggleDetails = (id) => setExpandedId(expandedId === id ? null : id);

    const formatCurrency = (amount) => new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(amount);
    const formatDate = (d) => d ? new Date(d).toLocaleDateString('pl-PL') : '-';

    const filteredReceipts = useMemo(() => {
        return receipts.filter(r => r.shopName.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [receipts, searchTerm]);

    const totalVisibleSum = useMemo(() => filteredReceipts.reduce((sum, r) => sum + r.totalAmount, 0), [filteredReceipts]);

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar-container">
                <div className="sidebar-header" onClick={() => navigate('/dashboard')} style={{cursor:'pointer'}}>💰 BudżetDomowy</div>
                <nav className="sidebar-links">
                    <div className="s-link" onClick={() => navigate('/dashboard')}>📊 Pulpit</div>
                    <div className="s-link active">💸 Transakcje</div>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="dash-header"><h1>Historia Transakcji</h1></header>

                <div className="transactions-toolbar">
                    <input 
                        type="text" 
                        placeholder="🔍 Szukaj..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                    <div className="summary-badge">Suma: <span>{formatCurrency(totalVisibleSum)}</span></div>
                </div>

                <div className="t-list" style={{background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                    {isLoading ? (
                        <div className="loading-state"><span className="spinner">⏳</span> Pobieranie...</div>
                    ) : (
                        <>
                            {filteredReceipts.length > 0 ? (
                                filteredReceipts.map(r => (
                                    <div key={r.id} className="transaction-container">
                                        <div className={`t-row ${expandedId === r.id ? 'expanded' : ''}`}>
                                            <div className="t-info-group">
                                                <button onClick={() => toggleDetails(r.id)} className="btn-expand">
                                                    <span style={{display: 'inline-block', transform: expandedId === r.id ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s'}}>▶</span>
                                                </button>
                                                
                                                {/* Ikona kategorii */}
                                                <div style={{fontSize: '1.5rem', marginRight: '10px'}}>
                                                    {categoryIcons[r.category] || '📦'}
                                                </div>

                                                <div className="t-text">
                                                    <strong>{r.shopName}</strong>
                                                    <small>{r.category || 'Brak kategorii'} • {formatDate(r.date)}</small>
                                                </div>
                                            </div>

                                            <div className="t-actions-group">
                                                <strong className="amount-negative">-{formatCurrency(r.totalAmount)}</strong>
                                                <button onClick={() => handleDelete(r.id)} className="btn-delete-small">🗑️</button>
                                            </div>
                                        </div>

                                        {expandedId === r.id && (
                                            <div className="receipt-details">
                                                <div className="details-header">Produkty:</div>
                                                <ul className="details-list">
                                                    {r.items && r.items.length > 0 ? (
                                                        r.items.map((item, index) => (
                                                            <li key={index} className="detail-item">
                                                                <span>{item.productName}</span>
                                                                <span>{formatCurrency(item.price)}</span>
                                                            </li>
                                                        ))
                                                    ) : <li className="no-items-info">Brak produktów</li>}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : <p className="no-data">Brak transakcji.</p>}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
};

export default Transactions;