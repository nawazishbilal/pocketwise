import { useEffect, useMemo, useState, useCallback } from 'react';
import { Wallet, TrendingUp, TrendingDown, Plus, RefreshCw } from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import "./Dashboard.css"

import DashboardLayout from '../layouts/DashboardLayout';

import StatCard from '../components/dashboard/StatCard';
import MonthlyChart from '../components/dashboard/MonthlyChart';
import CategoryChart from '../components/dashboard/CategoryChart';
import TransactionList from '../components/dashboard/TransactionList';
import AddTransactionModal from '../components/dashboard/AddTransactionModal';

export default function Dashboard() {
    const { user } = useAuth();

    const [transactions, setTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch transactions
    const fetchTransactions = useCallback(async () => {
        try {
            setError('');
            const response = await api.get('/transactions');
            setTransactions(response.data.transactions);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Unable to fetch transactions'
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTransactions();
    }, [fetchTransactions]);

    // Calculate financial summaries
    const summary = useMemo(() => {
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            income,
            expense,
            balance: income - expense
        };
    }, [transactions]);

    // Generate monthly chart data
    const monthlyData = useMemo(() => {
        const now = new Date();

        const months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - 5 + i,
                1
            );

            return {
                key: `${date.getFullYear()}-${date.getMonth()}`,
                month: date.toLocaleDateString('en-IN', {
                    month: 'short'
                }),
                income: 0,
                expense: 0
            };
        });

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);
            const key = `${date.getFullYear()}-${date.getMonth()}`;
            const month = months.find(m => m.key === key);

            if (month) {
                month[transaction.type] += transaction.amount;
            }
        });

        return months;
    }, [transactions]);

    // Generate category breakdown for current month
    const categoryData = useMemo(() => {
        const now = new Date();
        const categoryTotals = {};

        transactions.forEach(transaction => {
            const date = new Date(transaction.date);

            const isCurrentMonth =
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear();

            if (
                transaction.type === 'expense' &&
                isCurrentMonth
            ) {
                categoryTotals[transaction.category] =
                    (categoryTotals[transaction.category] || 0) +
                    transaction.amount;
            }
        });

        return Object.entries(categoryTotals).map(
            ([category, amount]) => ({
                category,
                amount
            })
        );
    }, [transactions]);

    // Add transaction
    const handleAddTransaction = async (data) => {
        await api.post('/transactions', data);
        setShowModal(false);
        await fetchTransactions();
    };

    // Update transaction
    const handleUpdateTransaction = async (data) => {
        await api.put(
            `/transactions/${editingTransaction._id}`,
            data
        );
        setEditingTransaction(null);
        await fetchTransactions();
    };

    // Delete transaction
    const handleDeleteTransaction = async (id) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this transaction?'
        );

        if (!confirmed) return;

        try {
            await api.delete(`/transactions/${id}`);
            await fetchTransactions();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to delete transaction'
            );
        }
    };

    const openEditModal = (transaction) => {
        setEditingTransaction(transaction);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingTransaction(null);
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                Loading SmartSpend...
            </div>
        );
    }

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="dashboard-header-container">
                <div>
                    <h1 className="dashboard-title">
                        Dashboard
                    </h1>
                    <p className="dashboard-subtitle">
                        Welcome back, {user?.name}!
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="btn-add-transaction"
                >
                    <Plus size={20} />
                    Add Transaction
                </button>
            </div>

            {/* Error Banner */}
            {error && (
                <div className="dashboard-error-banner">
                    <p>{error}</p>
                    <button onClick={fetchTransactions} className="btn-refresh">
                        <RefreshCw size={18} />
                    </button>
                </div>
            )}

            {/* Summary Cards */}
            <div className="dashboard-stats-grid">
                <StatCard
                    title="Net Balance"
                    amount={summary.balance}
                    icon={Wallet}
                    color="stats-blue"
                    subtitle="Total income minus expenses"
                />

                <StatCard
                    title="Total Income"
                    amount={summary.income}
                    icon={TrendingUp}
                    color="stats-emerald"
                    subtitle="All recorded income"
                />

                <StatCard
                    title="Total Expenses"
                    amount={summary.expense}
                    icon={TrendingDown}
                    color="stats-red"
                    subtitle="All recorded expenses"
                />
            </div>

            {/* Charts */}
            <div className="dashboard-charts-grid">
                <div className="chart-main-wrapper">
                    <MonthlyChart data={monthlyData} />
                </div>
                <CategoryChart data={categoryData} />
            </div>

            {/* Transactions */}
            <TransactionList
                transactions={transactions.slice(0, 10)}
                onEdit={openEditModal}
                onDelete={handleDeleteTransaction}
            />

            {/* Add Modal */}
            {showModal && (
                <AddTransactionModal
                    onClose={closeModal}
                    onSubmit={handleAddTransaction}
                />
            )}

            {/* Edit Modal */}
            {editingTransaction && (
                <AddTransactionModal
                    initialData={editingTransaction}
                    onClose={closeModal}
                    onSubmit={handleUpdateTransaction}
                />
            )}

        </DashboardLayout>
    );
};