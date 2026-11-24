import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:5000/api/',
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export const getBudgets = (month) =>
    api.get(`/budgets?month=${month}`);

export const createBudget = (budgetData) =>
    api.post('/budgets', budgetData);

export const updateBudget = (id, budgetData) =>
    api.put(`/budgets/${id}`, budgetData);

export const deleteBudget = (id) =>
    api.delete(`/budgets/${id}`);

export const getLendings = () =>
    api.get('/lents');

export const createLending = (lendingData) =>
    api.post('/lents', lendingData);

export const updateLending = (id, lendingData) =>
    api.put(`/lents/${id}`, lendingData);

export const deleteLending = (id) =>
    api.delete(`/lents/${id}`);

export default api;