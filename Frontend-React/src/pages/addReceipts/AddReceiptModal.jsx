import React, { useState } from 'react';
import axios from 'axios';
import './AddReceipt.css';

const AddReceiptModal = ({ isOpen, onClose, onRefresh }) => {
    const [shopName, setShopName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [items, setItems] = useState([{ productName: '', price: 0 }]);

    if (!isOpen) return null;

    const handleAddItem = () => {
        setItems([...items, { productName: '', price: 0 }]);
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Pobieramy nazwę użytkownika zapisaną podczas logowania
        const userName = localStorage.getItem('username');
        
        if (!userName) {
            alert("Błąd: Nie znaleziono zalogowanego użytkownika.");
            return;
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
        const payload = { shopName, date, totalAmount, items };

        try {
            // Zmieniony URL: wysyłamy pod /api/receipts/{username}
            // Dzięki temu backend automatycznie odejmie kwotę od salda tego użytkownika
            await axios.post(`http://localhost:8080/api/receipts/${userName}`, payload);
            
            // Odświeżamy dane na dashboardzie (saldo i listę)
            onRefresh();
            
            // Resetujemy formularz i zamykamy okno
            setShopName('');
            setItems([{ productName: '', price: 0 }]);
            onClose();
        } catch (err) {
            console.error("Błąd zapisu paragonu:", err);
            alert("Wystąpił błąd podczas zapisywania paragonu.");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Nowy Paragon</h3>
                    <p className="modal-subtitle">Dodaj produkty, aby automatycznie zaktualizować saldo</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="field-auth">
                        <label>Nazwa sklepu</label>
                        <input 
                            type="text" 
                            placeholder="np. Biedronka" 
                            value={shopName} 
                            onChange={(e) => setShopName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="field-auth">
                        <label>Data zakupu</label>
                        <input 
                            type="date" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                            required 
                        />
                    </div>
                    
                    <div className="items-section">
                        <div className="items-header">
                            <h4>Produkty</h4>
                            <span className="total-preview">
                                Suma: {(items.reduce((sum, item) => sum + item.price, 0)).toFixed(2)} PLN
                            </span>
                        </div>
                        {items.map((item, index) => (
                            <div key={index} className="item-row">
                                <input 
                                    type="text" 
                                    placeholder="Nazwa produktu" 
                                    value={item.productName} 
                                    onChange={(e) => handleItemChange(index, 'productName', e.target.value)} 
                                    required 
                                />
                                <input 
                                    type="number" 
                                    step="0.01" 
                                    placeholder="Cena" 
                                    value={item.price === 0 ? '' : item.price} 
                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)} 
                                    required 
                                />
                            </div>
                        ))}
                        <button type="button" className="btn-add-item" onClick={handleAddItem}>
                            + Dodaj kolejny produkt
                        </button>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="btn-save">Zatwierdź i odejmij z salda</button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReceiptModal;