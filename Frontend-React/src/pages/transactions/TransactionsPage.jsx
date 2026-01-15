import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';
import { CATEGORY_ICONS_QB, EXCHANGE_RATES } from '../../utils/constants'; 
import './Transactions.css';
import { toast } from 'react-toastify';
import { Edit2 } from 'lucide-react';
import AddReceiptModal from '../addReceipts/AddReceiptModal';

const Transactions = () => {
    const [receipts, setReceipts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all'); 
    const navigate = useNavigate();
    const userName = localStorage.getItem('username');

    // State dla edycji
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [receiptToEdit, setReceiptToEdit] = useState(null);

    const fetchReceipts = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get(`${API_URL}/receipts/${userName}`);
            setReceipts(res.data.reverse());
        } catch (err) {
            console.error("Błąd:", err);
            toast.error("Nie udało się pobrać transakcji");
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
                toast.success("Usunięto transakcję");
            } catch (err) { 
                toast.error("Błąd podczas usuwania");
            }
        }
    };

    const handleEdit = (receipt) => {
        setReceiptToEdit(receipt);
        setIsEditModalOpen(true);
    };

    const toggleDetails = (id) => setExpandedId(expandedId === id ? null : id);

    const userCurrency = localStorage.getItem('currency') || 'PLN';
    const rate = EXCHANGE_RATES[userCurrency] || 1.0;

    const formatCurrency = (amountInPLN) => {
        if (amountInPLN === null || amountInPLN === undefined) return '-';
        const convertedAmount = amountInPLN / rate;
        return new Intl.NumberFormat('pl-PL', { 
            style: 'currency', 
            currency: userCurrency 
        }).format(convertedAmount);
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('pl-PL') : '-';

    const filteredReceipts = useMemo(() => {
        return receipts.filter(r => {
            const matchesSearch = r.shopName.toLowerCase().includes(searchTerm.toLowerCase());
            let matchesType = true;
            if (filterType === 'personal') matchesType = !r.isFamilyExpense;
            if (filterType === 'family') matchesType = r.isFamilyExpense;
            return matchesSearch && matchesType;
        });
    }, [receipts, searchTerm, filterType]);

    const totalVisibleSum = useMemo(() => filteredReceipts.reduce((sum, r) => sum + r.totalAmount, 0), [filteredReceipts]);

    return (
        <div className="dashboard-wrapper">
            <aside className="sidebar-container">
                <div className="sidebar-header" onClick={() => navigate('/dashboard')} style={{cursor:'pointer'}}>💰 BudżetDomowy</div>
                <nav className="sidebar-links">
                    <div className="s-link" onClick={() => navigate('/dashboard')}>📊 Pulpit</div>
                    <div className="s-link active">💸 Transakcje</div>
                    <div className="s-link" onClick={() => navigate('/settings')}>⚙️ Ustawienia</div>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="dash-header"><h1>Historia Transakcji</h1></header>

                <div className="transactions-toolbar-wrapper">
                    <div className="filters-container">
                        <button className={`filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>Wszystkie</button>
                        <button className={`filter-btn ${filterType === 'personal' ? 'active' : ''}`} onClick={() => setFilterType('personal')}>👤 Osobiste</button>
                        <button className={`filter-btn ${filterType === 'family' ? 'active' : ''}`} onClick={() => setFilterType('family')}>👨‍👩‍👧‍👦 Rodzinne</button>
                    </div>

                    <div className="transactions-toolbar">
                        <input 
                            type="text" 
                            placeholder="🔍 Szukaj sklepu..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                        <div className="summary-badge">Suma: <span>{formatCurrency(totalVisibleSum)}</span></div>
                    </div>
                </div>

                <div className="t-list" style={{background: 'var(--bg-card)', padding: '20px', borderRadius: '12px', boxShadow: 'var(--shadow-sm)'}}>
                    {isLoading ? (
                        <div className="loading-state"><span className="spinner">⏳</span> Pobieranie...</div>
                    ) : (
                        <>
                            {filteredReceipts.length > 0 ? (
                                filteredReceipts.map(r => {
                                    const IconComponent = CATEGORY_ICONS_QB[r.category] || CATEGORY_ICONS_QB['Inne'];

                                    return (
                                        <div key={r.id} className="transaction-container">
                                            <div className={`t-row ${expandedId === r.id ? 'expanded' : ''}`}>
                                                <div className="t-info-group">
                                                    <button onClick={() => toggleDetails(r.id)} className="btn-expand">
                                                        <span style={{display: 'inline-block', transform: expandedId === r.id ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s'}}>▶</span>
                                                    </button>
                                                    
                                                    <div style={{fontSize: '1.5rem', marginRight: '10px', color: 'var(--primary)', display: 'flex', alignItems: 'center'}}>
                                                        <IconComponent size={24} />
                                                    </div>

                                                    <div className="t-text">
                                                        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                                                            <strong>{r.shopName}</strong>
                                                            {r.isFamilyExpense ? <span className="badge-family">Rodzina</span> : <span className="badge-personal">Osobiste</span>}
                                                        </div>
                                                        <small>{r.category || 'Brak kategorii'} • {formatDate(r.date)}</small>
                                                    </div>
                                                </div>

                                                <div className="t-actions-group">
                                                    <strong className="amount-negative">-{formatCurrency(r.totalAmount)}</strong>
                                                    
                                                    <button onClick={() => handleEdit(r)} className="btn-delete-small" style={{color:'var(--primary)', borderColor:'var(--primary-light)', background:'var(--primary-light)', marginRight:'5px'}}>
                                                        <Edit2 size={16} />
                                                    </button>
                                                    
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
                                    );
                                })
                            ) : <p className="no-data">Brak transakcji pasujących do filtrów.</p>}
                        </>
                    )}
                </div>
            </main>

            {isEditModalOpen && (
                <AddReceiptModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => { setIsEditModalOpen(false); setReceiptToEdit(null); }} 
                    onRefresh={fetchReceipts}
                    initialData={receiptToEdit}
                />
            )}
        </div>
    );
};

export default Transactions;