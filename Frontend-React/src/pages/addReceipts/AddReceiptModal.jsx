import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import { EXCHANGE_RATES } from '../../utils/constants';
import { X } from 'lucide-react'; // Import ikonki X
import './AddReceipt.css';

const AddReceiptModal = ({ isOpen, onClose, onRefresh, initialData = null }) => {
    const [shopName, setShopName] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [category, setCategory] = useState('');
    const [items, setItems] = useState([{ productName: '', price: 0 }]);
    const [isFamilyExpense, setIsFamilyExpense] = useState(false);

    const userName = localStorage.getItem('username');
    const userCurrency = localStorage.getItem('currency') || 'PLN';
    const rate = EXCHANGE_RATES[userCurrency] || 1.0;

    useEffect(() => {
        if (isOpen) {
            axios.get(`${API_URL}/categories`)
                .then(res => {
                    setCategoriesList(res.data);
                    if(res.data.length > 0 && !initialData) setCategory(res.data[0]);
                })
                .catch(() => {
                    setCategoriesList(['Inne']);
                    setCategory('Inne');
                });

            if (initialData) {
                setShopName(initialData.shopName);
                setDate(initialData.date);
                setCategory(initialData.category);
                setIsFamilyExpense(initialData.isFamilyExpense);
                
                if (initialData.items) {
                    const itemsInUserCurrency = initialData.items.map(i => ({
                        ...i,
                        price: i.price / rate 
                    }));
                    setItems(itemsInUserCurrency);
                }
            } else {
                setShopName('');
                setItems([{ productName: '', price: 0 }]);
                setIsFamilyExpense(false);
            }
        }
    }, [isOpen, initialData]);

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
        
        const totalInUserCurrency = items.reduce((sum, item) => sum + item.price, 0);
        const totalInBaseCurrency = totalInUserCurrency * rate;
        const itemsInBaseCurrency = items.map(item => ({...item, price: item.price * rate}));

        const payload = { shopName, date, category, totalAmount: totalInBaseCurrency, items: itemsInBaseCurrency, isFamilyExpense };

        try {
            if (initialData) {
                await axios.put(`${API_URL}/receipts/${initialData.id}`, payload);
                toast.success("Transakcja zaktualizowana!");
            } else {
                await axios.post(`${API_URL}/receipts/${userName}`, payload);
                toast.success("Dodano!");
            }
            // Najpierw odświeżamy listę, potem zamykamy
            await onRefresh(); 
            onClose();
        } catch (err) { toast.error("Błąd zapisu"); }
    };
    
    return (
        <div className="modal-overlay">
             <div className="modal-content" style={{maxWidth: '500px'}}>
                {/* Header z przyciskiem X */}
                <div className="modal-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'start'}}>
                    <div>
                        <h3>{initialData ? '✏️ Edytuj Paragon' : '🧾 Nowy Paragon'} ({userCurrency})</h3>
                        <p className="modal-subtitle">Uzupełnij szczegóły wydatku</p>
                    </div>
                    <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer', color:'var(--text-secondary)'}}>
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{marginBottom:'20px', padding:'12px', background: isFamilyExpense ? '#dcfce7' : 'var(--bg-body)', borderRadius:'10px', border:'1px solid var(--border-color)', transition: 'background 0.3s'}}>
                        <label style={{display:'flex', alignItems:'center', gap:'10px', cursor:'pointer', fontWeight:'bold', color: isFamilyExpense ? '#166534' : 'var(--text-main)'}}>
                            <input 
                                type="checkbox" 
                                checked={isFamilyExpense} 
                                onChange={(e) => setIsFamilyExpense(e.target.checked)}
                                style={{width:'20px', height:'20px'}}
                                disabled={!!initialData}
                            />
                            👨‍👩‍👧‍👦 To wydatek z konta Rodziny
                        </label>
                    </div>

                    <div className="field-auth">
                        <label>Nazwa sklepu / Miejsca</label>
                        <input type="text" placeholder="np. Biedronka" value={shopName} onChange={(e) => setShopName(e.target.value)} required />
                    </div>

                    <div className="form-row" style={{display:'flex', gap:'15px'}}>
                        <div className="field-auth" style={{flex:1}}>
                            <label>Data</label>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                        </div>
                        <div className="field-auth" style={{flex:1}}>
                            <label>Kategoria</label>
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                {categoriesList.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <div className="items-section">
                        <div className="items-header">
                            <h4>Produkty (Waluta: {userCurrency})</h4>
                            <span className="total-preview">Suma: {(items.reduce((sum, item) => sum + item.price, 0)).toFixed(2)} {userCurrency}</span>
                        </div>
                        <div style={{maxHeight: '200px', overflowY: 'auto', marginBottom: '10px', paddingRight:'5px'}}>
                            {items.map((item, index) => (
                                <div key={index} className="item-row">
                                    <input type="text" placeholder="Nazwa" value={item.productName} onChange={(e) => handleItemChange(index, 'productName', e.target.value)} required />
                                    <input type="number" step="0.01" placeholder="Cena" value={item.price === 0 ? '' : item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} required />
                                </div>
                            ))}
                        </div>
                        <button type="button" className="btn-add-item" onClick={handleAddItem}>+ Dodaj produkt</button>
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="btn-save">{initialData ? 'Zapisz zmiany' : 'Dodaj'}</button>
                        <button type="button" className="btn-cancel" onClick={onClose}>Anuluj</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddReceiptModal;