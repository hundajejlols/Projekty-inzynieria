import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import '../addReceipts/AddReceipt.css'; // Używamy stylów z modala paragonów

const FamilyModal = ({ isOpen, onClose, onRefresh, currentFamily }) => {
    const [mode, setMode] = useState('view'); // view, create, join, transfer
    const [inputVal, setInputVal] = useState('');
    const [amount, setAmount] = useState('');
    const userName = localStorage.getItem('username');

    if (!isOpen) return null;

    const handleCreate = async () => {
        try {
            await axios.post(`${API_URL}/family/create`, { username: userName, familyName: inputVal });
            toast.success("Rodzina utworzona!");
            onRefresh();
            onClose();
        } catch (e) { toast.error("Błąd tworzenia rodziny"); }
    };

    const handleJoin = async () => {
        try {
            await axios.post(`${API_URL}/family/join`, { username: userName, code: inputVal });
            toast.success("Dołączono do rodziny!");
            onRefresh();
            onClose();
        } catch (e) { toast.error("Błędny kod lub błąd serwera"); }
    };

    const handleTransfer = async () => {
        try {
            await axios.post(`${API_URL}/family/transfer`, { username: userName, amount: parseFloat(amount) });
            toast.success("Przelano środki!");
            onRefresh();
            onClose();
        } catch (e) { toast.error("Brak środków lub błąd"); }
    };

    const renderContent = () => {
        if (!currentFamily) {
            // Nie ma rodziny - wybór: Stwórz lub Dołącz
            if (mode === 'create') {
                return (
                    <>
                        <h3>Stwórz Rodzinę</h3>
                        <input className="input-auth" placeholder="Nazwa rodziny (np. Kowalscy)" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0'}} />
                        <div className="modal-footer">
                            <button className="btn-save" onClick={handleCreate}>Utwórz</button>
                            <button className="btn-cancel" onClick={() => setMode('view')}>Wróć</button>
                        </div>
                    </>
                );
            }
            if (mode === 'join') {
                return (
                    <>
                        <h3>Dołącz do Rodziny</h3>
                        <input className="input-auth" placeholder="Wpisz kod (np. A1B2-C3D4)" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0'}} />
                        <div className="modal-footer">
                            <button className="btn-save" onClick={handleJoin}>Dołącz</button>
                            <button className="btn-cancel" onClick={() => setMode('view')}>Wróć</button>
                        </div>
                    </>
                );
            }
            return (
                <>
                    <h3>Wspólny Budżet</h3>
                    <p style={{marginBottom:'20px'}}>Jeszcze nie masz rodziny w systemie.</p>
                    <div style={{display:'flex', gap:'10px', flexDirection:'column'}}>
                        <button className="btn-save" onClick={() => setMode('create')}>🏠 Utwórz nową rodzinę</button>
                        <button className="btn-cancel" onClick={() => setMode('join')} style={{border:'2px solid #2563eb', color:'#2563eb'}}>🔗 Dołącz kodem</button>
                    </div>
                </>
            );
        } else {
            // Ma rodzinę - widok zarządzania
            if (mode === 'transfer') {
                return (
                    <>
                        <h3>Zasil konto rodziny</h3>
                        <input type="number" placeholder="Kwota PLN" value={amount} onChange={e => setAmount(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0', fontSize:'1.5rem'}} />
                        <div className="modal-footer">
                            <button className="btn-save" onClick={handleTransfer}>Przelej</button>
                            <button className="btn-cancel" onClick={() => setMode('view')}>Anuluj</button>
                        </div>
                    </>
                );
            }
            return (
                <div style={{textAlign:'center'}}>
                    <h2 style={{color:'#2563eb'}}>Rodzina: {currentFamily.name}</h2>
                    <div style={{background:'#eff6ff', padding:'15px', borderRadius:'12px', margin:'20px 0'}}>
                        <p style={{fontSize:'0.9rem', color:'#64748b'}}>Twój kod zaproszenia:</p>
                        <strong style={{fontSize:'1.5rem', letterSpacing:'2px'}}>{currentFamily.joinCode}</strong>
                    </div>
                    <button className="btn-save" onClick={() => setMode('transfer')} style={{width:'100%'}}>💰 Przelej środki do rodziny</button>
                </div>
            );
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth:'400px'}}>
                {renderContent()}
                {mode === 'view' && <button className="btn-cancel" onClick={onClose} style={{marginTop:'15px', width:'100%'}}>Zamknij</button>}
            </div>
        </div>
    );
};

export default FamilyModal;