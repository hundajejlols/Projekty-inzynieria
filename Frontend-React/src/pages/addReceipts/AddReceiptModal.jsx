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
        const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
        const payload = { shopName, date, totalAmount, items };

        try {
            await axios.post('http://localhost:8080/api/receipts', payload);
            onRefresh();
            onClose();
            setShopName('');
            setItems([{ productName: '', price: 0 }]);
        } catch (err) {
            console.error("Błąd zapisu:", err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Nowy Paragon</h3>
                <form onSubmit={handleSubmit}>
                    <div className="field-auth">
                        <label>Sklep</label>
                        <input type="text" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
                    </div>
                    <div className="field-auth">
                        <label>Data</label>
                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    
                    <div className="items-section">
                        <h4>Produkty:</h4>
                        {items.map((item, index) => (
                            <div key={index} className="item-row">
                                <input type="text" placeholder="Nazwa" value={item.productName} 
                                    onChange={(e) => handleItemChange(index, 'productName', e.target.value)} required />
                                <input type="number" step="0.01" placeholder="Cena" value={item.price} 
                                    onChange={(e) => handleItemChange(index, 'price', e.target.value)} required />
                            </div>
                        ))}
                        <button type="button" className="btn-add-item" onClick={handleAddItem}>+ Dodaj produkt</button>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="btn-save">Zapisz</button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReceiptModal;