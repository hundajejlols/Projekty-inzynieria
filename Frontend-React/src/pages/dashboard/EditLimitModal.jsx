import React, { useState, useEffect } from 'react';
import '../addReceipts/AddReceipt.css'; // Używamy tych samych stylów co reszta

const EditLimitModal = ({ isOpen, onClose, onSave, category, currentLimit }) => {
    const [limit, setLimit] = useState('');

    // Ustawiamy aktualną wartość przy otwarciu
    useEffect(() => {
        if (isOpen) setLimit(currentLimit);
    }, [isOpen, currentLimit]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        const val = parseFloat(limit);
        if (val > 0) {
            onSave(category, val);
            onClose();
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '400px' }}>
                <div className="modal-header">
                    <h3>Edytuj limit 🎯</h3>
                    <p className="modal-subtitle">Kategoria: <strong>{category}</strong></p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="field-auth">
                        <label>Nowy limit (PLN)</label>
                        <input 
                            type="number" 
                            step="10"
                            value={limit} 
                            onChange={(e) => setLimit(e.target.value)} 
                            autoFocus
                            required 
                        />
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

export default EditLimitModal;