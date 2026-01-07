import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import './AddReceipt.css';

const AddReceiptModal = ({ isOpen, onClose, onRefresh }) => {
    const [shopName, setShopName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('Zakupy');
    const [items, setItems] = useState([{ productName: '', price: 0 }]);

    if (!isOpen) return null;

    const categories = ['Zakupy', 'Jedzenie', 'Transport', 'Rozrywka', 'Dom', 'Zdrowie', 'Inne'];

    const handleAddItem = () => {
        setItems([...items, { productName: '', price: 0 }]);
    };

    // POPRAWIONA LINIJKA (było constHZ, jest const)
    const handleItemChange = (index, field, value) => {
        const newItems = [...items];
        newItems[index][field] = field === 'price' ? parseFloat(value) || 0 : value;
        setItems(newItems);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userName = localStorage.getItem('username');
        
        if (!userName) {
            alert("Błąd: Nie znaleziono zalogowanego użytkownika.");
            return;
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
        const payload = { shopName, date, category, totalAmount, items };

        try {
            await axios.post(`${API_URL}/receipts/${userName}`, payload);
            onRefresh();
            
            // Reset formularza
            setShopName('');
            setCategory('Zakupy');
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
                    <p className="modal-subtitle">Uzupełnij szczegóły wydatku</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="field-auth">
                        <label>Nazwa sklepu / Miejsca</label>
                        <input 
                            type="text" 
                            placeholder="np. Biedronka" 
                            value={shopName} 
                            onChange={(e) => setShopName(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="form-row" style={{display:'flex', gap:'15px'}}>
                        <div className="field-auth" style={{flex:1}}>
                            <label>Data</label>
                            <input 
                                type="date" 
                                value={date} 
                                onChange={(e) => setDate(e.target.value)} 
                                required 
                            />
                        </div>
                        <div className="field-auth" style={{flex:1}}>
                            <label>Kategoria</label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                style={{width:'100%', padding:'0.8rem', borderRadius:'12px', border:'1px solid #e2e8f0'}}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
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
                        <button type="submit" className="btn-save">Zatwierdź</button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReceiptModal;