import { useCallback, useEffect, useState } from 'react';
import { Plus, Search, RefreshCw } from 'lucide-react';

import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

import TransactionList from '../components/dashboard/TransactionList';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';

import './Transactions.css';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    const [search, setSearch] = useState('');
    const [type, setType] = useState('');
    const [category, setCategory] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalTransactions: 0,
        totalPages: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    // Fetch transactions from backend
    const fetchTransactions = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/transactions', {
                params: {
                    search,
                    type,
                    category,
                    startDate,
                    endDate,
                    page,
                    limit: 10
                }
            });

            setTransactions(response.data.transactions);

            setPagination({
                totalTransactions: response.data.totalTransactions,
                totalPages: response.data.totalPages
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to fetch transactions'
            );
        } finally {
            setLoading(false);
        }
    }, [search, type, category, startDate, endDate, page]);

    // Debounce search and fetch transactions
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchTransactions();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchTransactions]);

    // Reset pagination when filters change
    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    // Add transaction
    const handleAdd = async (data) => {
        await api.post('/transactions', data);

        setShowModal(false);

        if (page !== 1) {
            setPage(1);
        } else {
            await fetchTransactions();
        }
    };

    // Update transaction
    const handleUpdate = async (data) => {
        await api.put(
            `/transactions/${editingTransaction._id}`,
            data
        );

        setEditingTransaction(null);
        await fetchTransactions();
    };

    // Delete transaction
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this transaction?')) return;

        try {
            await api.delete(`/transactions/${id}`);

            // If the last item on a page was deleted,
            // move to the previous page if necessary.
            if (transactions.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                await fetchTransactions();
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to delete transaction'
            );
        }
    };

    const resetFilters = () => {
        setSearch('');
        setType('');
        setCategory('');
        setStartDate('');
        setEndDate('');
        setPage(1);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTransaction(null);
    };

    return (
        <DashboardLayout>

            {/* Page header */}
            <div className="transactions-header">
                <div>
                    <h1 className="transactions-title">
                        Transactions
                    </h1>

                    <p className="transactions-subtitle">
                        Manage your income and expenses.
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="transactions-add-btn"
                >
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Search and filters */}
            <div className="transactions-filters-card">
                <div className="transactions-filters-grid">

                    {/* Search */}
                    <div className="transactions-search-wrapper">
                        <Search
                            size={18}
                            className="transactions-search-icon"
                        />

                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={search}
                            onChange={(e) =>
                                handleFilterChange(setSearch)(e.target.value)
                            }
                            className="transactions-search-input"
                        />
                    </div>

                    {/* Type */}
                    <select
                        value={type}
                        onChange={(e) =>
                            handleFilterChange(setType)(e.target.value)
                        }
                        className="transactions-select"
                    >
                        <option value="">All Types</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>

                    {/* Category */}
                    <select
                        value={category}
                        onChange={(e) =>
                            handleFilterChange(setCategory)(e.target.value)
                        }
                        className="transactions-select"
                    >
                        <option value="">All Categories</option>
                        <option value="Food">Food</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Transport">Transport</option>
                        <option value="Entertainment">Entertainment</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Education">Education</option>
                        <option value="Bills">Bills</option>
                        <option value="Salary">Salary</option>
                        <option value="Freelance">Freelance</option>
                        <option value="Investment">Investment</option>
                        <option value="Other">Other</option>
                    </select>

                    {/* Start date */}
                    <div className="transactions-date-group">
                        <label className="transactions-date-label">
                            From
                        </label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                handleFilterChange(setStartDate)(e.target.value)
                            }
                            className="transactions-date-input"
                        />
                    </div>

                    {/* End date */}
                    <div className="transactions-date-group">
                        <label className="transactions-date-label">
                            To
                        </label>

                        <input
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
                            onChange={(e) =>
                                handleFilterChange(setEndDate)(e.target.value)
                            }
                            className="transactions-date-input"
                        />
                    </div>

                    {/* Reset */}
                    <button
                        type="button"
                        onClick={resetFilters}
                        className="transactions-reset-btn"
                    >
                        <RefreshCw size={17} />
                        Reset Filters
                    </button>

                </div>
            </div>

            {/* Results */}
            <div className="transactions-results-bar">
                <p className="transactions-count">
                    {pagination.totalTransactions} transactions found
                </p>
            </div>

            {error && (
                <p className="transactions-error">{error}</p>
            )}

            {loading ? (
                <div className="transactions-loading">
                    Loading transactions...
                </div>
            ) : (
                <TransactionList
                    transactions={transactions}
                    onEdit={setEditingTransaction}
                    onDelete={handleDelete}
                />
            )}

            {/* Pagination */}
            {!loading && pagination.totalPages > 1 && (
                <div className="transactions-pagination">
                    <button
                        type="button"
                        disabled={page === 1}
                        onClick={() => setPage((prev) => prev - 1)}
                        className="pagination-btn"
                    >
                        Previous
                    </button>

                    <span className="pagination-info">
                        Page {page} of {pagination.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={page >= pagination.totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                        className="pagination-btn"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Add modal */}
            {showModal && (
                <AddTransactionModal
                    onClose={closeModal}
                    onSubmit={handleAdd}
                />
            )}

            {/* Edit modal */}
            {editingTransaction && (
                <AddTransactionModal
                    initialData={editingTransaction}
                    onClose={closeModal}
                    onSubmit={handleUpdate}
                />
            )}

        </DashboardLayout>
    );
};

export default Transactions;