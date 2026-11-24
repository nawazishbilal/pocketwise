import { useCallback, useEffect, useState } from "react";
import { Plus, Search, RefreshCw } from 'lucide-react';

import api from '../services/api';
import DashboardLayout from '../layouts/DashboardLayout';

import LendingsList from "../components/LendingsList";
import LendingModal from "../components/LendingModal";

import './Lendings.css'

const Lendings = () => {
    const [lendings, setLendings] = useState([]);

    const [search, setSearch] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState({
        totalLendings: 0,
        totalPages: 0
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showModal, setShowModal] = useState(false);
    const [editingLending, setEditingLending] = useState(null);

    const fetchLendings = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const response = await api.get('/lents', {
                params: {
                    search, startDate, endDate, page, limit: 10
                }
            })

            setLendings(response.data.lents);

            setPagination({
                totalLendings: response.data.totalLents,
                totalPages: response.data.totalPages
            })
        } catch (error) {
            setError(
                error.response?.data?.message ||
                'Unable to fetch lending records'
            );
        } finally {
            setLoading(false);
        }
    }, [search, startDate, endDate, page]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLendings();
        }, 300);

        return () => clearTimeout(timer);
    }, [fetchLendings]);

    const handleFilterChange = (setter) => (value) => {
        setter(value);
        setPage(1);
    };

    const handleAdd = async (data) => {
        await api.post('/lents', data);

        setShowModal(false);

        if (page !== 1) {
            setPage(1);
        } else {
            await fetchLendings();
        }
    };

    const handleUpdate = async (data) => {
        await api.put(
            `/lents/${editingLending._id}`,
            data
        );

        setEditingLending(null);
        await fetchLendings();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this record?')) return;

        try {
            await api.delete(`/lents/${id}`);

            // If the last item on a page was deleted,
            // move to the previous page if necessary.
            if (lendings.length === 1 && page > 1) {
                setPage(page - 1);
            } else {
                await fetchLendings();
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'Failed to delete record'
            );
        }
    };

    const resetFilters = () => {
        setSearch('');
        setStartDate('');
        setEndDate('');
        setPage(1);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingLending(null);
    };

    return (
        <DashboardLayout>

            <div className="header">
                <div>
                    <h1 className="header-title">Lending Records</h1>
                    <p className="header-subtitle">Manage your lending records.</p>
                </div>

                <button onClick={() => setShowModal(true)} className="add-btn"><Plus size={20} />Add Record</button>
            </div>

            <div className="filters-card">
                <div className="filters-grid">

                    <div className="search wrapper">
                        <Search size={18} className="search-icon" />
                        <input type="text" placeholder="Search records" value={search} onChange={(e) => {
                            handleFilterChange(setSearch)(e.target.value)
                        }} className="search-input" />
                    </div>

                    <button
                        type="button"
                        onClick={resetFilters}
                        className="reset-btn"
                    >
                        <RefreshCw size={17} />
                        Reset Filters
                    </button>

                    <div className="date-group">
                        <label className="date-label">
                            From
                        </label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                handleFilterChange(setStartDate)(e.target.value)
                            }
                            className="date-input"
                        />
                    </div>

                    <div className="date-group">
                        <label className="date-label">
                            To
                        </label>

                        <input
                            type="date"
                            value={endDate}
                            min={startDate || undefined}
                            onChange={(e) =>
                                handleFilterChange(setEndDate)(e.target.value)
                            }
                            className="date-input"
                        />
                    </div>
                </div>
            </div>

            <div className="results-bar">
                <p className="count">
                    {pagination.totalLendings} transactions found
                </p>
            </div>

            {error && (
                <p className="error">{error}</p>
            )}

            {loading ? (
                <div className="loading">
                    Loading records...
                </div>
            ) : (
                <LendingsList
                    lendings={lendings}
                    onEdit={setEditingLending}
                    onDelete={handleDelete}
                />
            )}

            {!loading && pagination.totalPages > 1 && (
                <div className="pagination">
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

            {showModal && (
                <LendingModal
                    onClose={closeModal}
                    onSubmit={handleAdd}
                />
            )}

            {editingLending && (
                <LendingModal
                    initialData={editingLending}
                    onClose={closeModal}
                    onSubmit={handleUpdate}
                />
            )}

        </DashboardLayout>
    )
}

export default Lendings;