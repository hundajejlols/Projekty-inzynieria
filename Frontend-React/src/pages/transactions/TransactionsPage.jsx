import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Transactions.css';

const TransactionsPage = () => {
    const [receipts, setReceipts] = useState([]);
    const [expandedId, setExpandedId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Pobieranie danych z backendu
    const fetchReceipts = () => {
        setLoading(true);
        axios.get('http://localhost:8080/api/receipts')
            .then(res => {
                setReceipts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Błąd pobierania transakcji:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // Funkcja usuwania transakcji
    const handleDelete = async (id, e) => {
        e.stopPropagation(); // Zapobiega rozwijaniu wiersza przy kliknięciu w przycisk usuń
        if (window.confirm("Czy na pewno chcesz usunąć ten paragon?")) {
            try {
                await axios.delete(`http://localhost:8080/api/receipts/${id}`);
                // Aktualizujemy stan lokalny po udanym usunięciu
                setReceipts(receipts.filter(receipt => receipt.id !== id));
            } catch (err) {
                console.error("Błąd podczas usuwania:", err);
                alert("Nie udało się usunąć paragonu.");
            }
        }
    };

    if (loading) return <div className="transactions-container">Ładowanie paragonów...</div>;

    return (
        <div className="transactions-container">
            <div className="header-flex">
                <h2>Historia zakupów</h2>
                <button className="refresh-btn" onClick={fetchReceipts}>Odśwież</button>
            </div>

            <div className="receipts-list">
                {receipts.length > 0 ? receipts.map(receipt => (
                    <div key={receipt.id} className={`receipt-item ${expandedId === receipt.id ? 'active' : ''}`}>
                        <div className="receipt-header" onClick={() => toggleExpand(receipt.id)}>
                            <div className="receipt-main-info">
                                <strong>{receipt.shopName}</strong>
                                <small>{receipt.date}</small>
                            </div>
                            <div className="receipt-summary-info">
                                <span className="receipt-amount">{receipt.totalAmount} PLN</span>
                                <button 
                                    className="btn-delete-small" 
                                    onClick={(e) => handleDelete(receipt.id, e)}
                                    title="Usuń paragon"
                                >
                                    🗑️
                                </button>
                                <span className="arrow">{expandedId === receipt.id ? '▲' : '▼'}</span>
                            </div>
                        </div>

                        {expandedId === receipt.id && (
                            <div className="receipt-details">
                                <div className="details-header">Lista produktów:</div>
                                <ul>
                                    {receipt.items && receipt.items.map((item, idx) => (
                                        <li key={idx}>
                                            <span className="product-name">{item.productName}</span>
                                            <span className="product-price">{item.price.toFixed(2)} PLN</span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="receipt-footer-total">
                                    <strong>Suma: {receipt.totalAmount.toFixed(2)} PLN</strong>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="no-data">
                        <p>Brak paragonów w bazie danych.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;