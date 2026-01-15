import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import { Users, User } from 'lucide-react'; 
import '../addReceipts/AddReceipt.css'; 

const FamilyModal = ({ isOpen, onClose, onRefresh, currentFamily }) => {
    const [mode, setMode] = useState('view');
    const [inputVal, setInputVal] = useState('');
    const [amount, setAmount] = useState('');
    const [members, setMembers] = useState([]);
    const userName = localStorage.getItem('username');

    useEffect(() => {
        if (isOpen && currentFamily && mode === 'view') {
            fetchMembers();
        }
    }, [isOpen, currentFamily, mode]);

    const fetchMembers = async () => {
        try {
            const res = await axios.get(`${API_URL}/family/members/${userName}`);
            setMembers(res.data);
        } catch (e) {
            console.error("Błąd pobierania członków", e);
        }
    };

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
            if (mode === 'create') {
                return (
                    <>
                        <h3>Stwórz Rodzinę</h3>
                        <input className="input-auth" placeholder="Nazwa rodziny (np. Kowalscy)" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0', background:'var(--bg-body)', color:'var(--text-main)', border:'1px solid var(--border-color)', borderRadius:'8px'}} />
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
                        <input className="input-auth" placeholder="Wpisz kod (np. A1B2-C3D4)" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0', background:'var(--bg-body)', color:'var(--text-main)', border:'1px solid var(--border-color)', borderRadius:'8px'}} />
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
                    <p style={{marginBottom:'20px', color:'var(--text-secondary)'}}>Jeszcze nie masz rodziny w systemie.</p>
                    <div style={{display:'flex', gap:'10px', flexDirection:'column'}}>
                        <button className="btn-save" onClick={() => setMode('create')}>🏠 Utwórz nową rodzinę</button>
                        <button className="btn-cancel" onClick={() => setMode('join')} style={{border:'2px solid var(--primary)', color:'var(--primary)'}}>🔗 Dołącz kodem</button>
                    </div>
                </>
            );
        } else {
            if (mode === 'transfer') {
                return (
                    <>
                        <h3>Zasil konto rodziny</h3>
                        <input type="number" placeholder="Kwota PLN" value={amount} onChange={e => setAmount(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0', fontSize:'1.5rem', background:'var(--bg-body)', color:'var(--text-main)', border:'1px solid var(--border-color)', borderRadius:'8px'}} />
                        <div className="modal-footer">
                            <button className="btn-save" onClick={handleTransfer}>Przelej</button>
                            <button className="btn-cancel" onClick={() => setMode('view')}>Anuluj</button>
                        </div>
                    </>
                );
            }
            return (
                <div style={{textAlign:'center'}}>
                    <h2 style={{color:'var(--primary)', display:'flex', alignItems:'center', justifyContent:'center', gap:'10px'}}>
                        <Users size={28} /> {currentFamily.name}
                    </h2>
                    <div style={{background:'var(--bg-body)', padding:'15px', borderRadius:'12px', margin:'20px 0', border:'1px solid var(--border-color)'}}>
                        <p style={{fontSize:'0.9rem', color:'var(--text-secondary)'}}>Twój kod zaproszenia:</p>
                        <strong style={{fontSize:'1.5rem', letterSpacing:'2px', color:'var(--text-main)'}}>{currentFamily.joinCode}</strong>
                    </div>

                    <div style={{textAlign:'left', marginBottom:'20px'}}>
                        <h4 style={{marginBottom:'10px', color:'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600'}}>
                            Członkowie ({members.length}):
                        </h4>
                        <ul style={{listStyle:'none', padding:0}}>
                            {members.map((member, idx) => (
                                <li key={idx} style={{padding:'8px 0', borderBottom:'1px solid var(--border-color)', display:'flex', alignItems:'center', gap:'10px', color: 'var(--text-main)'}}>
                                    <div style={{background:'var(--primary-light)', padding:'6px', borderRadius:'50%', color:'var(--primary)', display: 'flex'}}>
                                        <User size={16} />
                                    </div>
                                    <span style={{fontWeight: member === userName ? '700' : '400'}}>
                                        {member} {member === userName && '(Ty)'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="btn-save" onClick={() => setMode('transfer')} style={{width:'100%'}}>💰 Przelej środki do rodziny</button>
                </div>
            );
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{maxWidth:'400px', background:'var(--bg-card)', color:'var(--text-main)'}}>
                {renderContent()}
                {mode === 'view' && <button className="btn-cancel" onClick={onClose} style={{marginTop:'15px', width:'100%'}}>Zamknij</button>}
            </div>
        </div>
    );
};

export default FamilyModal;