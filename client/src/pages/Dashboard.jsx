import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import LedgerTape from '../components/LedgerTape';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import { CategoryPie, MonthlyTrend } from '../components/ExpenseChart';
import { CATEGORIES, formatMoney } from '../constants';

export default function Dashboard() {
  const { user } = useAuth();
  const currency = user?.currency || 'INR';

  const [stats, setStats] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [filters, setFilters] = useState({ category: '', type: '', search: '' });
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadStats = useCallback(async () => {
    const { data } = await api.get('/expenses/stats');
    setStats(data);
  }, []);

  const loadExpenses = useCallback(async (page = 1) => {
    const params = { page, limit: 10 };
    if (filters.category) params.category = filters.category;
    if (filters.type) params.type = filters.type;
    if (filters.search) params.search = filters.search;
    const { data } = await api.get('/expenses', { params });
    setExpenses(data.expenses);
    setPagination(data.pagination);
  }, [filters]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadStats(), loadExpenses(1)]);
    setLoading(false);
  }, [loadStats, loadExpenses]);

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const handleCreateOrUpdate = async (form) => {
    if (editing) {
      await api.put(`/expenses/${editing._id}`, form);
    } else {
      await api.post('/expenses', form);
    }
    setEditing(null);
    await Promise.all([loadStats(), loadExpenses(pagination.page)]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this entry? This cannot be undone.')) return;
    await api.delete(`/expenses/${id}`);
    await Promise.all([loadStats(), loadExpenses(pagination.page)]);
  };

  const openEdit = (exp) => {
    setEditing(exp);
    setFormOpen(true);
  };

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {stats && <LedgerTape items={stats.recent} currency={currency} />}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl">Your ledger</h1>
            <p className="text-sm text-muted mt-1">A running record of everything in and out.</p>
          </div>
          <button onClick={openCreate} className="btn-primary">
            + Add entry
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Balance" value={formatMoney(stats.balance, currency)} accent={stats.balance >= 0 ? 'mint' : 'rust'} />
            <StatCard label="Total income" value={formatMoney(stats.totalIncome, currency)} accent="mint" />
            <StatCard label="Total expense" value={formatMoney(stats.totalExpense, currency)} accent="rust" />
            <StatCard
              label="Spent this month"
              value={formatMoney(stats.thisMonthExpense, currency)}
              accent="gold"
              hint={user?.monthlyBudget ? `of ${formatMoney(user.monthlyBudget, currency)} budget` : undefined}
            />
          </div>
        )}

        {stats && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div className="card p-5">
              <h3 className="font-display text-base mb-2">Spending by category</h3>
              <p className="text-xs text-muted mb-2">This month</p>
              <CategoryPie data={stats.byCategory} currency={currency} />
            </div>
            <div className="card p-5">
              <h3 className="font-display text-base mb-2">Trend</h3>
              <p className="text-xs text-muted mb-2">Last 12 months</p>
              <MonthlyTrend data={stats.monthlyTrend} currency={currency} />
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <input
            className="input max-w-xs"
            placeholder="Search entries…"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            className="input max-w-[160px]"
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select
            className="input max-w-[140px]"
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          >
            <option value="">All types</option>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>

        {loading ? (
          <div className="card p-10 text-center text-muted">Loading your ledger…</div>
        ) : (
          <>
            <ExpenseList expenses={expenses} currency={currency} onEdit={openEdit} onDelete={handleDelete} />

            {pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-5">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => loadExpenses(pagination.page - 1)}
                  className="btn-ghost text-sm py-1.5 px-3 disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="text-sm text-muted">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  disabled={pagination.page >= pagination.pages}
                  onClick={() => loadExpenses(pagination.page + 1)}
                  className="btn-ghost text-sm py-1.5 px-3 disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <ExpenseForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreateOrUpdate}
        initialData={editing}
      />
    </div>
  );
}
