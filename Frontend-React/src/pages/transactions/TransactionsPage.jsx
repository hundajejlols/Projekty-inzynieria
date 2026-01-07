import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Transactions.css'; // Używamy tych samych stylów dla spójności

const Transactions = () => {
    const [receipts, setReceipts] = useState([]);
    const navigate = useNavigate();
    const userName = localStorage.getItem('username');

    const fetchReceipts = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/receipts');
            setReceipts(res.data);
        } catch (err) {
            console.error("Błąd ładowania transakcji");
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Czy na pewno chcesz usunąć ten paragon?")) {
            try {
                await axios.delete(`http://localhost:8080/api/receipts/${id}`);
                fetchReceipts(); // Odśwież listę po usunięciu
            } catch (err) {
                alert("Błąd podczas usuwania");
            }
        }
    };

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
                <header className="dash-header">
                    <h1>Historia Transakcji</h1>
                </header>

                <div className="t-list" style={{background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}}>
                    {receipts.map(r => (
                        <div key={r.id} className="t-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #f1f5f9'}}>
                            <div className="t-info">
                                <strong>{r.shopName}</strong>
                                <p style={{margin: 0, fontSize: '0.85rem', color: '#64748b'}}>{r.date}</p>
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                                <strong style={{color: '#e11d48'}}>-{r.totalAmount.toFixed(2)} PLN</strong>
                                <button 
                                    onClick={() => handleDelete(r.id)}
                                    style={{backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold'}}
                                >
                                    Usuń
                                </button>
                            </div>
                        </div>
                    ))}
                    {receipts.length === 0 && <p>Brak transakcji w historii.</p>}
                </div>
            </main>
        </div>
    );
};

export default Transactions;