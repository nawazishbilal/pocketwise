import { useEffect, useMemo, useState, useCallback } from 'react';
import { Plus, CheckCircle2, RotateCcw, Pencil, Trash2 } from 'lucide-react';

import api, {
    getLendings,
    createLending,
    updateLending,
    deleteLending
} from '../services/api';

import DashboardLayout from '../layouts/DashboardLayout';
import LendingModal from '../components/LendingModal';
import LendingsList from '../components/LendingsList';

import './Lendings.css';

const Lendings = () => {
    const [lendings, setLendings] = useState([]);
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingLending, setEditingLending] = useState(null);

    const fetchLendings = async () => {
        try {
            setLoading(true);
            setError('');

            const response = typeof getLendings === 'function'
                ? await getLendings()
                : await api.get('/lendings');

            const data = response.data?.lendings ?? response.data ?? [];
            setLendings(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to fetch lending records.'
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLendings;
    }, []);

    const summary = useMemo(() => {
        const pendingLent = lendings
            .filter((item) => item.type === 'lent' && item.status !== 'settled')
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

        const pendingBorrowed = lendings
            .filter((item) => item.type === 'borrowed' && item.status !== 'settled')
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

        const settledTotal = lendings
            .filter((item) => item.status === 'settled')
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

        return {
            pendingLent,
            pendingBorrowed,
            settledTotal
        };
    }, [lendings]);

    const filteredLendings = useMemo(() => {
        return lendings.filter((item) => {
            const matchesType = filterType === 'all' || item.type === filterType;
            const currentStatus = item.status || 'pending';
            const matchesStatus = filterStatus === 'all' || currentStatus === filterStatus;
            return matchesType && matchesStatus;
        });
    }, [lendings, filterType, filterStatus]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(Number(amount || 0));

    const formatDate = (dateValue) => {
        if (!dateValue) return 'No due date';
        const parsed = new Date(dateValue);
        if (Number.isNaN(parsed.getTime())) return 'No due date';
        return parsed.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const openAddModal = () => {
        setEditingLending(null);
        setIsModalOpen(true);
    };

    const openEditModal = (lending) => {
        setEditingLending(lending);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingLending(null);
    };

    const handleSaveLending = async (lendingData) => {
        try {
            setSaving(true);
            setError('');

            if (editingLending) {
                if (typeof updateLending === 'function') {
                    await updateLending(editingLending._id, lendingData);
                } else {
                    await api.put(`/lendings/${editingLending._id}`, lendingData);
                }
            } else {
                if (typeof createLending === 'function') {
                    await createLending(lendingData);
                } else {
                    await api.post('/lendings', lendingData);
                }
            }

            closeModal();
            await fetchLendings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to save lending record.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleToggleSettle = async (record) => {
        const nextStatus = record.status === 'settled' ? 'pending' : 'settled';

        try {
            setError('');
            if (typeof updateLending === 'function') {
                await updateLending(record._id, { status: nextStatus });
            } else {
                await api.patch(`/lendings/${record._id}`, { status: nextStatus });
            }
            await fetchLendings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to update settlement status.'
            );
        }
    };

    const handleDeleteLending = async (record) => {
        const confirmed = window.confirm(
            `Delete the record for ${record.personName}?`
        );

        if (!confirmed) return;

        try {
            setError('');
            if (typeof deleteLending === 'function') {
                await deleteLending(record._id);
            } else {
                await api.delete(`/lendings/${record._id}`);
            }
            await fetchLendings();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to delete lending record.'
            );
        }
    };

    return (
        <DashboardLayout>
            <div className="lendings-page">

                {/* Page Header */}
                <div className="lendings-header">
                    <div>
                        <h1 className="lendings-title">Lendings</h1>
                        <p className="lendings-subtitle">
                            Track money you lent out or borrowed and mark settlements.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={openAddModal}
                        className="lendings-add-btn"
                    >
                        <Plus size={19} />
                        Add Record
                    </button>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="lendings-error">
                        {error}
                    </div>
                )}

                {/* Summary Cards */}
                <div className="lendings-summary-grid">
                    <div className="lending-summary-card">
                        <p className="lending-summary-label">You Will Receive (Lent)</p>
                        <h2 className="lending-summary-value lent-value">
                            {formatCurrency(summary.pendingLent)}
                        </h2>
                        <span className="lending-summary-hint">Pending repayments</span>
                    </div>

                    <div className="lending-summary-card">
                        <p className="lending-summary-label">You Owe (Borrowed)</p>
                        <h2 className="lending-summary-value borrowed-value">
                            {formatCurrency(summary.pendingBorrowed)}
                        </h2>
                        <span className="lending-summary-hint">Pending dues</span>
                    </div>

                    <div className="lending-summary-card">
                        <p className="lending-summary-label">Settled Total</p>
                        <h2 className="lending-summary-value settled-value">
                            {formatCurrency(summary.settledTotal)}
                        </h2>
                        <span className="lending-summary-hint">Cleared records</span>
                    </div>
                </div>

                {/* Filters Bar */}
                <div className="lendings-filters-bar">
                    <div className="lendings-filter-group">
                        <button
                            type="button"
                            onClick={() => setFilterType('all')}
                            className={`filter-pill ${filterType === 'all' ? 'active' : ''}`}
                        >
                            All Types
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterType('lent')}
                            className={`filter-pill ${filterType === 'lent' ? 'active' : ''}`}
                        >
                            Lent
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterType('borrowed')}
                            className={`filter-pill ${filterType === 'borrowed' ? 'active' : ''}`}
                        >
                            Borrowed
                        </button>
                    </div>

                    <div className="lendings-filter-group">
                        <button
                            type="button"
                            onClick={() => setFilterStatus('all')}
                            className={`filter-pill ${filterStatus === 'all' ? 'active' : ''}`}
                        >
                            All Status
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus('pending')}
                            className={`filter-pill ${filterStatus === 'pending' ? 'active' : ''}`}
                        >
                            Pending
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterStatus('settled')}
                            className={`filter-pill ${filterStatus === 'settled' ? 'active' : ''}`}
                        >
                            Settled
                        </button>
                    </div>
                </div>

                {/* Lending Records List */}
                {loading ? (
                    <div className="lendings-empty-card">
                        <p className="lendings-empty-text">Loading lending records...</p>
                    </div>
                ) : filteredLendings.length === 0 ? (
                    <div className="lendings-empty-card">
                        <p className="lendings-empty-text">
                            No lending records match the current filter.
                        </p>
                    </div>
                ) : (
                    <div className="lendings-list-grid">
                        {filteredLendings.map((record) => {
                            const isLent = record.type === 'lent';
                            const isSettled = record.status === 'settled';

                            return (
                                <div
                                    key={record._id}
                                    className={`lending-record-card ${isSettled ? 'is-settled' : ''}`}
                                >
                                    <div className="lending-record-top">
                                        <div>
                                            <h3 className="lending-person-name">
                                                {record.personName}
                                            </h3>
                                            <div className="lending-badges">
                                                <span className={`lending-type-badge ${isLent ? 'type-lent' : 'type-borrowed'}`}>
                                                    {isLent ? 'Lent' : 'Borrowed'}
                                                </span>
                                                <span className={`lending-status-badge ${isSettled ? 'status-settled' : 'status-pending'}`}>
                                                    {isSettled ? 'Settled' : 'Pending'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`lending-record-amount ${isLent ? 'lent-value' : 'borrowed-value'}`}>
                                            {formatCurrency(record.amount)}
                                        </div>
                                    </div>

                                    {record.notes && (
                                        <p className="lending-notes">{record.notes}</p>
                                    )}

                                    <div className="lending-record-footer">
                                        <span className="lending-due-date">
                                            Due: {formatDate(record.dueDate)}
                                        </span>

                                        <div className="lending-record-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleToggleSettle(record)}
                                                className="lending-action-btn settle-btn"
                                                title={isSettled ? 'Mark as Pending' : 'Mark as Settled'}
                                            >
                                                {isSettled ? (
                                                    <>
                                                        <RotateCcw size={15} />
                                                        Reopen
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle2 size={15} />
                                                        Settle
                                                    </>
                                                )}
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => openEditModal(record)}
                                                className="lending-icon-action edit"
                                                title="Edit record"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => handleDeleteLending(record)}
                                                className="lending-icon-action delete"
                                                title="Delete record"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Add / Edit Modal */}
                {isModalOpen && (
                    <LendingModal
                        key={editingLending?._id || 'new-lending'}
                        onClose={closeModal}
                        onSubmit={handleSaveLending}
                        initialData={editingLending}
                        loading={saving}
                    />
                )}

            </div>
        </DashboardLayout>
    );
};

export default Lendings;