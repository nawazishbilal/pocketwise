import { Pencil, Trash2 } from "lucide-react";
import './LendingsList.css';

const LendingsList = ({ lendings, onEdit, onDelete }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    }

    console.log(lendings)

    return (
        <div className="lendings-card">

            <div className="header">
                <h2 className="title">
                    Recent Lendings
                </h2>

                <span className="subtitle">
                    Latest activity
                </span>
            </div>

            {lendings.lenth === 0 ? (
                <div className="lendings-empty">
                    No money lent or due yet.
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="lendings-table">

                        <thead className="thead">
                            <tr>
                                <th>Lent to</th>
                                <th>Date</th>
                                <th>Amount</th>
                                <th>Actions</th>
                                <th>Notes</th>
                            </tr>
                        </thead>

                        <tbody>
                            {lendings.map((lending) => {
                                return (
                                    <tr key={lending._id} className="lendings-row">
                                        <td className="cell">
                                            <div className="name">
                                                {lending.lentTo}
                                            </div>
                                        </td>

                                        <td className="cell date">
                                            {formatDate(lending.date)}
                                        </td>

                                        <td className="cell amount">
                                            ₹{lending.amount.toLocaleString('en-IN')}
                                        </td>

                                        <td className="cell">
                                            <div className="actions">
                                                <button
                                                    onClick={() => onEdit(lending)}
                                                    className="action-btn edit-btn"
                                                    title="Edit"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => onDelete(lending._id)}
                                                    className="action-btn delete-btn"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={17} />
                                                </button>
                                            </div>
                                        </td>

                                        <td className="cell amount">
                                            
                                            <input type="checkbox"  value={lending.repaid} />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default LendingsList;