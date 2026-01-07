import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import './AddIncome.css';

const AddIncomeModal = ({ isOpen, onClose, onRefresh }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userName = localStorage.getItem('username');
        const value = parseFloat(amount.replace(',', '.'));

        if (!userName) {
            toast.error("Błąd autoryzacji!");
            return;
        }

        if (isNaN(value) || value <= 0) {
            toast.warning("Podaj poprawną kwotę (większą od 0).");
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${API_URL}/user/add-balance`, {
                username: userName,
                amount: value
            });
            
            toast.success(`💰 Dodano ${value.toFixed(2)} PLN do salda!`);
            onRefresh();
            setAmount('');
            onClose();
        } catch (err) {
            console.error(err);
            toast.error("Nie udało się dodać środków.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay income-overlay">
            <div className="modal-content income-content">
                <div className="modal-header">
                    <h3>Dodaj Wpłatę</h3>
                    <p className="modal-subtitle">Zasil swój domowy budżet</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="income-input-wrapper">
                        <span className="currency-prefix">PLN</span>
                        <input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)} 
                            autoFocus
                            required 
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="submit" className="btn-save btn-income-save" disabled={loading}>
                            {loading ? 'Przetwarzanie...' : 'Zasil konto'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
                            Anuluj
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddIncomeModal;