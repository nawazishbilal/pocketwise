import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import './AddTransactionModal.css';

const AddTransactionModal = ({
    onClose,
    onSubmit,
    initialData
}) => {
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toLocaleDateString('en-CA')
    });

    const [error, setError] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData({
                description: initialData.description,
                amount: initialData.amount,
                type: initialData.type,
                category: initialData.category,
                date: new Date(initialData.date).toLocaleDateString('en-CA')
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (Number(formData.amount) <= 0) {
            setError('Amount must be greater than zero.');
            return;
        }

        setSaving(true);

        try {
            await onSubmit({
                ...formData,
                amount: Number(formData.amount)
            });
        } catch (err) {
            setError(err.message || 'Something went wrong.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-container">

                <div className="modal-header">
                    <h2 className="modal-title">
                        {initialData ? 'Edit Transaction' : 'Add Transaction'}
                    </h2>
                    <button onClick={onClose} className="modal-close-btn">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">

                    <div className="form-group">
                        <label className="form-label">
                            Description
                        </label>
                        <input
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Grocery shopping"
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Amount (₹)
                        </label>
                        <input
                            name="amount"
                            type="number"
                            min="0.01"
                            step="0.01"
                            value={formData.amount}
                            onChange={handleChange}
                            required
                            placeholder="Enter amount"
                            className="form-input"
                        />
                    </div>

                    <div className="form-grid-2">
                        <div className="form-group">
                            <label className="form-label">
                                Type
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option value="expense">Expense</option>
                                <option value="income">Income</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="form-input"
                            >
                                <option>Food</option>
                                <option>Shopping</option>
                                <option>Transport</option>
                                <option>Entertainment</option>
                                <option>Healthcare</option>
                                <option>Education</option>
                                <option>Bills</option>
                                <option>Salary</option>
                                <option>Freelance</option>
                                <option>Investment</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">
                            Date
                        </label>
                        <input
                            name="date"
                            type="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {error && (
                        <p className="form-error">{error}</p>
                    )}

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn-cancel"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={saving}
                            className="btn-submit"
                        >
                            {saving ? 'Saving...' : initialData ? 'Update' : 'Add Transaction'}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default AddTransactionModal;