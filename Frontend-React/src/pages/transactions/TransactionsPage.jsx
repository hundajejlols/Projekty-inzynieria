import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const TransactionsPage = () => {
    const [receipts, setReceipts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:8080/api/receipts')
            .then(res => {
                setReceipts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Błąd pobierania transakcji:", err);
                setLoading(false);
            });
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (loading) return <div className="transactions-container">Ładowanie paragonów...</div>;

    return (
        <div className="transactions-container">
            <h2>Historia zakupów</h2>
            <div className="receipts-list">
                {receipts.length > 0 ? receipts.map(receipt => (
                    <div key={receipt.id} className="receipt-item">
                        <div className="receipt-header" onClick={() => toggleExpand(receipt.id)}>
                            <div>
                                <strong>{receipt.shopName}</strong>
                                <small>{receipt.date}</small>
                            </div>
                            <span>
                                {receipt.totalAmount} PLN 
                                <span className="arrow">{expandedId === receipt.id ? '▲' : '▼'}</span>
                            </span>
                        </div>

                        {expandedId === receipt.id && (
                            <div className="receipt-details">
                                <ul>
                                    {receipt.items && receipt.items.map((item, idx) => (
                                        <li key={idx}>
                                            {item.productName} <span>{item.price} PLN</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )) : <p>Brak paragonów w bazie danych.</p>}
            </div>
        </div>
    );
};

export default TransactionsPage;