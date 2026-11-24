import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import './TransactionList.css';

const TransactionList = ({
    transactions,
    onEdit,
    onDelete
}) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="transaction-card">

            <div className="transaction-header">
                <h2 className="transaction-title">
                    Recent Transactions
                </h2>

                <span className="transaction-subtitle">
                    Latest activity
                </span>
            </div>

            {transactions.length === 0 ? (
                <div className="transaction-empty">
                    No transactions yet. Add your first transaction!
                </div>
            ) : (
                <div className="transaction-table-wrapper">
                    <table className="transaction-table">

                        <thead className="transaction-thead">
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {transactions.map((transaction) => {
                                const isIncome = transaction.type === 'Income';

                                return (
                                    <tr key={transaction._id} className="transaction-row">
                                        <td className="transaction-cell">
                                            <div className="transaction-desc-container">
                                                <div className={`transaction-icon-box ${isIncome ? 'income-bg' : 'expense-bg'}`}>
                                                    {isIncome ? (
                                                        <ArrowDownLeft className="income-icon" size={18} />
                                                    ) : (
                                                        <ArrowUpRight className="expense-icon" size={18} />
                                                    )}
                                                </div>

                                                <span className="transaction-desc-text">
                                                    {transaction.description}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="transaction-cell category-text">
                                            {transaction.category}
                                        </td>

                                        <td className="transaction-cell date-text">
                                            {formatDate(transaction.date)}
                                        </td>

                                        <td className={`transaction-cell amount-cell ${isIncome ? 'income-text' : 'expense-text'}`}>
                                            {isIncome ? '+' : '-'}
                                            ₹{transaction.amount.toLocaleString('en-IN')}
                                        </td>

                                        <td className="transaction-cell">
                                            <div className="transaction-actions">
                                                <button
                                                    onClick={() => onEdit(transaction)}
                                                    className="action-btn edit-btn"
                                                    title="Edit"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete(transaction._id)}
                                                    className="action-btn delete-btn"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            )}

        </div>
    );
};

export default TransactionList;