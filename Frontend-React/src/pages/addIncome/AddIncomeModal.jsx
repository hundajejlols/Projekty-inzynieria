import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import { EXCHANGE_RATES } from '../../utils/constants';
import './AddIncome.css';

const AddIncomeModal = ({ isOpen, onClose, onRefresh }) => {
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Pobieramy walutę
    const userCurrency = localStorage.getItem('currency') || 'PLN';
    const rate = EXCHANGE_RATES[userCurrency] || 1.0;

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userName = localStorage.getItem('username');
        const inputVal = parseFloat(amount.replace(',', '.'));

        if (!userName) {
            toast.error("Błąd autoryzacji!");
            return;
        }

        if (isNaN(inputVal) || inputVal <= 0) {
            toast.warning("Podaj poprawną kwotę.");
            return;
        }

        // 2. Przeliczamy na bazowe PLN
        const valueInPLN = inputVal * rate;

        setLoading(true);
        try {
            await axios.post(`${API_URL}/user/add-balance`, {
                username: userName,
                amount: valueInPLN // Wysyłamy PLN
            });
            
            if (userCurrency !== 'PLN') {
                toast.success(`💰 Dodano ${inputVal} ${userCurrency} (zapisano jako ${valueInPLN.toFixed(2)} PLN)!`);
            } else {
                toast.success(`💰 Dodano ${inputVal.toFixed(2)} PLN do salda!`);
            }
            
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
                    {/* Dynamiczny nagłówek */}
                    <h3>Dodaj Wpłatę ({userCurrency})</h3>
                    <p className="modal-subtitle">Zasil swój domowy budżet</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="income-input-wrapper">
                        {/* Dynamiczny prefiks waluty */}
                        <span className="currency-prefix">{userCurrency}</span>
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