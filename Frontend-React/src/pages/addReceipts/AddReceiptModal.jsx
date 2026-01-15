import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import './AddReceipt.css';

const AddReceiptModal = ({ isOpen, onClose, onRefresh }) => {
    const [shopName, setShopName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    // ZMIANA: Kategorie pobierane z API
    const [categoriesList, setCategoriesList] = useState([]);
    const [category, setCategory] = useState('');
    
    const [items, setItems] = useState([{ productName: '', price: 0 }]);
    const [isFamilyExpense, setIsFamilyExpense] = useState(false);

    useEffect(() => {
        if (isOpen) {
            axios.get(`${API_URL}/categories`)
                .then(res => {
                    setCategoriesList(res.data);
                    if(res.data.length > 0) setCategory(res.data[0]);
                })
                .catch(() => {
                    const fallback = ['Inne'];
                    setCategoriesList(fallback);
                    setCategory('Inne');
                });
        }
    }, [isOpen]);

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
        const userName = localStorage.getItem('username');
        
        if (!userName) {
            toast.error("Błąd: Brak użytkownika!");
            return;
        }

        const totalAmount = items.reduce((sum, item) => sum + item.price, 0);
        const payload = { shopName, date, category, totalAmount, items, isFamilyExpense };

        try {
            await axios.post(`${API_URL}/receipts/${userName}`, payload);
            toast.success("🧾 Paragon dodany pomyślnie!");
            onRefresh();
            
            setShopName('');
            if(categoriesList.length > 0) setCategory(categoriesList[0]);
            setItems([{ productName: '', price: 0 }]);
            setIsFamilyExpense(false);
            onClose();
        } catch (err) {
            console.error("Błąd zapisu:", err);
            const msg = err.response?.data?.error || "Wystąpił błąd przy zapisie.";
            toast.error(msg);
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
                    <div style={{marginBottom:'20px', padding:'10px', background: isFamilyExpense ? '#dcfce7' : 'var(--bg-body)', borderRadius:'10px', border:'1px solid var(--border-color)'}}>
                        <label style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontWeight:'bold', color: isFamilyExpense ? '#166534' : 'var(--text-main)'}}>
                            <input 
                                type="checkbox" 
                                checked={isFamilyExpense} 
                                onChange={(e) => setIsFamilyExpense(e.target.checked)}
                                style={{width:'20px', height:'20px'}}
                            />
                            👨‍👩‍👧‍👦 To wydatek z konta Rodziny
                        </label>
                    </div>

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
                            >
                                {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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