import './TransactionDetailsModal.css';

const TransactionDetailsModal = ({
    isOpen,
    onClose,
    transaction
}) => {
    if (!isOpen || !transaction) return null;

    const isIncome = transaction.type === 'Income';
    const toneClass = isIncome ? 'tone-income' : 'tone-expense';

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 2
        }).format(Number(amount || 0));

    const formatDate = (date) => {
        if (!date) return '—';
        const parsed = new Date(date);
        if (Number.isNaN(parsed.getTime())) return '—';
        return parsed.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div
            className="tx-details-backdrop"
            onClick={onClose}
        >
            <div
                className="tx-details-modal"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="tx-details-header">
                    <h2 className="tx-details-title">
                        Transaction Details
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="tx-details-close-btn"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Transaction Amount */}
                <div className="tx-details-hero">
                    <div className={`tx-details-badge ${toneClass}`}>
                        <span className="tx-details-sign">
                            {isIncome ? '+' : '-'}
                        </span>
                    </div>

                    <div className='tx-details-main'>
                        <p className="tx-details-kind">
                            {isIncome ? 'Income' : 'Expense'}
                        </p>

                        <h3 className={`tx-details-amount ${toneClass}`}>
                            {formatCurrency(transaction.amount)}
                        </h3>

                        {transaction.description && (
                            <p className="tx-details-description">
                                {transaction.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="tx-details-body">
                    <div className="tx-details-grid">

                        <div className="tx-detail-item">
                            <p className="tx-detail-label">
                                Transaction Type
                            </p>
                            <p className={`tx-detail-value tx-detail-capitalize ${toneClass}`}>
                                {transaction.type || '—'}
                            </p>
                        </div>

                        <div className="tx-detail-item">
                            <p className="tx-detail-label">
                                Category
                            </p>
                            <p className="tx-detail-value">
                                {transaction.category || '—'}
                            </p>
                        </div>

                        <div className="tx-detail-item">
                            <p className="tx-detail-label">
                                Category 2
                            </p>
                            <p className="tx-detail-value">
                                {transaction.category2 || '—'}
                            </p>
                        </div>

                        <div className="tx-detail-item">
                            <p className="tx-detail-label">
                                Remarks
                            </p>
                            <p className="tx-detail-value">
                                {transaction.remarks || '—'}
                            </p>
                        </div>

                        <div className="tx-detail-item">
                            <p className="tx-detail-label">
                                Transaction Date
                            </p>
                            <p className="tx-detail-value">
                                {formatDate(transaction.date)}
                            </p>
                        </div>

                        <div className="tx-detail-item">
                            <p className="tx-detail-label">
                                Transaction ID
                            </p>
                            <p className="tx-detail-value tx-detail-id">
                                {transaction._id || '—'}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="tx-details-footer">
                    <button
                        type="button"
                        onClick={onClose}
                        className="tx-details-close-action"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetailsModal;