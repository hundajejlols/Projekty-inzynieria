import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import { Users, User, Trash2, LogOut, XCircle } from 'lucide-react'; 
import '../addReceipts/AddReceipt.css'; 

const FamilyModal = ({ isOpen, onClose, onRefresh, currentFamily }) => {
    const [mode, setMode] = useState('view');
    const [inputVal, setInputVal] = useState('');
    const [amount, setAmount] = useState('');
    const [members, setMembers] = useState([]);
    const userName = localStorage.getItem('username');

    const isOwner = currentFamily?.ownerName === userName;

    useEffect(() => {
        if (isOpen && currentFamily && mode === 'view') {
            fetchMembers();
        }
    }, [isOpen, currentFamily, mode]);

    const fetchMembers = async () => {
        try {
            const res = await axios.get(`${API_URL}/family/members/${userName}`);
            setMembers(res.data);
        } catch (e) { console.error(e); }
    };

    if (!isOpen) return null;

    const handleCreate = async () => {
        try { await axios.post(`${API_URL}/family/create`, { username: userName, familyName: inputVal }); toast.success("Utworzono!"); onRefresh(); onClose(); } catch (e) { toast.error("Błąd"); }
    };
    const handleJoin = async () => {
        try { await axios.post(`${API_URL}/family/join`, { username: userName, code: inputVal }); toast.success("Dołączono!"); onRefresh(); onClose(); } catch (e) { toast.error("Błąd"); }
    };
    const handleTransfer = async () => {
        try { await axios.post(`${API_URL}/family/transfer`, { username: userName, amount: parseFloat(amount) }); toast.success("Przelano!"); onRefresh(); onClose(); } catch (e) { toast.error("Błąd"); }
    };

    const handleLeave = async () => {
        if(!window.confirm("Czy na pewno chcesz opuścić rodzinę?")) return;
        try {
            await axios.post(`${API_URL}/family/leave`, { username: userName });
            toast.success("Opuszczono rodzinę.");
            onRefresh(); onClose();
        } catch (e) { toast.error(e.response?.data?.message || "Błąd"); }
    };

    const handleDissolve = async () => {
        if(!window.confirm("UWAGA: To usunie rodzinę i historię. Kontynuować?")) return;
        try {
            await axios.post(`${API_URL}/family/dissolve`, { username: userName });
            toast.success("Rodzina rozwiązana.");
            onRefresh(); onClose();
        } catch (e) { toast.error("Błąd"); }
    };

    const handleRemoveMember = async (memberToRemove) => {
        if(!window.confirm(`Usunąć użytkownika ${memberToRemove}?`)) return;
        try {
            await axios.post(`${API_URL}/family/remove`, { ownerName: userName, memberName: memberToRemove });
            toast.success("Użytkownik usunięty.");
            fetchMembers();
        } catch (e) { toast.error("Błąd"); }
    };

    const renderContent = () => {
        if (!currentFamily) {
             if (mode === 'create') {
                return (
                    <>
                        <h3>Stwórz Rodzinę</h3>
                        <input className="input-auth" placeholder="Nazwa" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0', background:'var(--bg-body)', color:'var(--text-main)', border:'1px solid var(--border-color)', borderRadius:'8px'}} />
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
                        <input className="input-auth" placeholder="Kod (np. A1B2)" value={inputVal} onChange={e => setInputVal(e.target.value)} style={{width:'100%', padding:'10px', margin:'10px 0', background:'var(--bg-body)', color:'var(--text-main)', border:'1px solid var(--border-color)', borderRadius:'8px'}} />
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
                    <p style={{marginBottom:'20px', color:'var(--text-secondary)'}}>Nie należysz do żadnej rodziny.</p>
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
                        <p style={{fontSize:'0.9rem', color:'var(--text-secondary)'}}>Kod zaproszenia:</p>
                        <strong style={{fontSize:'1.5rem', letterSpacing:'2px', color:'var(--text-main)'}}>{currentFamily.joinCode}</strong>
                    </div>

                    <div style={{textAlign:'left', marginBottom:'20px'}}>
                        <h4 style={{marginBottom:'10px', color:'var(--text-secondary)', fontSize: '0.9rem', fontWeight: '600'}}>
                            Członkowie:
                        </h4>
                        <ul style={{listStyle:'none', padding:0}}>
                            {members.map((member, idx) => (
                                <li key={idx} style={{padding:'8px 0', borderBottom:'1px solid var(--border-color)', display:'flex', alignItems:'center', justifyContent:'space-between', color: 'var(--text-main)'}}>
                                    <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                        <div style={{background:'var(--primary-light)', padding:'6px', borderRadius:'50%', color:'var(--primary)', display:'flex'}}>
                                            <User size={16} />
                                        </div>
                                        <span style={{fontWeight: member === userName ? '700' : '400'}}>
                                            {member} {member === currentFamily.ownerName && '👑'}
                                        </span>
                                    </div>
                                    {isOwner && member !== userName && (
                                        <button onClick={() => handleRemoveMember(member)} style={{background:'none', border:'none', color:'var(--danger)', cursor:'pointer'}}>
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button className="btn-save" onClick={() => setMode('transfer')} style={{width:'100%', marginBottom:'10px'}}>💰 Zasil konto</button>
                    
                    {isOwner ? (
                        <button className="btn-cancel" onClick={handleDissolve} style={{width:'100%', color:'var(--danger)', borderColor:'var(--danger)'}}>
                            <XCircle size={16} style={{marginRight:'5px'}}/> Rozwiąż rodzinę
                        </button>
                    ) : (
                        <button className="btn-cancel" onClick={handleLeave} style={{width:'100%', color:'var(--danger)', borderColor:'var(--danger)'}}>
                            <LogOut size={16} style={{marginRight:'5px'}}/> Opuść rodzinę
                        </button>
                    )}
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