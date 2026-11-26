import { useState } from 'react';
import './LendingModal.css';

const LendingModal = ({
    onClose,
    onSubmit,
    initialData,
    loading
}) => {
    const isEditing = Boolean(initialData);

    const [personName, setPersonName] = useState(initialData?.lentTo || '');
    const [amount, setAmount] = useState(initialData?.amount?.toString() || '');
    const [type, setType] = useState(initialData?.type || 'lent');
    const [date, setDate] = useState(
        initialData?.date
            ? new Date(initialData.date).toLocaleDateString('en-CA')
            : ''
    );
    const [notes, setNotes] = useState(initialData?.notes || '');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!personName.trim() || Number(amount) <= 0) {
            return;
        }

        onSubmit({
            lentTo: personName.trim(),
            amount: Number(amount),
            type,
            date: date || null,
            notes: notes.trim()
        });
    };

    return (
        <div className="lending-modal-backdrop">
            <div className="lending-modal-container">

                <div className="lending-modal-header">
                    <h2 className="lending-modal-title">
                        {isEditing ? 'Edit Lending Record' : 'Add Lending Record'}
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="lending-modal-close-btn"
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="lending-modal-form">

                    <div className="lending-form-group">
                        <label className="lending-form-label">
                            Lent To
                        </label>

                        <input
                            type="text"
                            value={personName}
                            onChange={(e) => setPersonName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            required
                            className="lending-form-input"
                        />
                    </div>

                    <div className="lending-form-row">
                        <div className="lending-form-group">
                            <label className="lending-form-label">
                                Amount (₹)
                            </label>

                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="0.01"
                                step="0.01"
                                required
                                placeholder="Enter amount"
                                className="lending-form-input"
                            />
                        </div>

                        <div className="lending-form-group">
                            <label className="lending-form-label">
                                Type
                            </label>

                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="lending-form-input"
                            >
                                <option value="lent">Lent</option>
                                <option value="repaid">Repaid</option>
                            </select>
                        </div>
                    </div>

                    <div className="lending-form-group">
                        <label className="lending-form-label">
                            Date
                        </label>

                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="lending-form-input"
                        />
                    </div>

                    <div className="lending-form-group">
                        <label className="lending-form-label">
                            Notes (Optional)
                        </label>

                        <input
                            type="text"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="e.g. Dinner split or emergency loan"
                            className="lending-form-input"
                        />
                    </div>

                    <div className="lending-modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="lending-btn-cancel"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={loading}
                            className="lending-btn-submit"
                        >
                            {loading
                                ? 'Saving...'
                                : isEditing
                                ? 'Update Record'
                                : 'Save Record'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default LendingModal;