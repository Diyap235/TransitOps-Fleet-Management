import React, { useState, useEffect } from 'react';
import { Droplet, Plus, Pencil, Trash2, Search, X, AlertCircle, Fuel, DollarSign, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  getAllFuelLogs, createFuelLog, updateFuelLog, deleteFuelLog,
  getAllExpenses, createExpense, updateExpense, deleteExpense,
} from '../api/fuelExpenses.api';
import { getVehicles } from '../api/vehicles.api';

const CATEGORY_OPTIONS = ['Toll', 'Maintenance', 'Insurance', 'Fine', 'Other'];
const EMPTY_FUEL_FORM = { vehicle: '', liters: '', cost: '', date: '', odometerReading: '', notes: '' };
const EMPTY_EXPENSE_FORM = { vehicle: '', category: 'Toll', amount: '', date: '', note: '' };

// ─── Modal Component ──────────────────────────────────────────────────────────

const Modal = ({ title, onClose, onSubmit, form, setForm, loading, error, type, vehicles }) => {
  const isFuel = type === 'fuel';
  
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 14, width: '100%', maxWidth: 520, boxShadow: '0 24px 64px rgba(0,0,0,0.2)', border: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid var(--border)' }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>{title}</span>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={18} /></button>
        </div>
        <form onSubmit={onSubmit} style={{ padding: 24 }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#FEE2E2', color: '#B91C1C', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />{error}
            </div>
          )}
          
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>
              Vehicle {!isFuel && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(Optional for fleet-wide)</span>}
            </label>
            <select 
              style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
              value={form.vehicle}
              onChange={e => setForm(f => ({ ...f, vehicle: e.target.value }))}
              required={isFuel}
            >
              <option value="">Select vehicle</option>
              {vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber} - {v.model}</option>
              ))}
            </select>
          </div>


          {isFuel ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Liters</label>
                  <input 
                    style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    type="number"
                    step="0.01"
                    placeholder="50.5"
                    min="0"
                    value={form.liters}
                    onChange={e => setForm(f => ({ ...f, liters: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Cost ($)</label>
                  <input 
                    style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    type="number"
                    step="0.01"
                    placeholder="75.00"
                    min="0"
                    value={form.cost}
                    onChange={e => setForm(f => ({ ...f, cost: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Date</label>
                  <input 
                    style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    type="date"
                    value={form.date}
                    onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Odometer (km)</label>
                  <input 
                    style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    type="number"
                    placeholder="15000"
                    min="0"
                    value={form.odometerReading}
                    onChange={e => setForm(f => ({ ...f, odometerReading: e.target.value }))}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Notes</label>
                <input 
                  style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  type="text"
                  placeholder="Any additional notes..."
                  value={form.notes}
                  onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Category</label>
                  <select 
                    style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                    required
                  >
                    {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Amount ($)</label>
                  <input 
                    style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                    type="number"
                    step="0.01"
                    placeholder="150.00"
                    min="0"
                    value={form.amount}
                    onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Date</label>
                <input 
                  style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  type="date"
                  value={form.date}
                  onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                  required
                />
              </div>
              
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 500, marginBottom: 6, color: 'var(--text-primary)' }}>Note</label>
                <input 
                  style={{ width: '100%', height: 40, padding: '0 12px', border: '1.5px solid var(--border)', borderRadius: 8, fontSize: 13, outline: 'none', background: 'var(--bg-card)', color: 'var(--text-primary)' }}
                  type="text"
                  placeholder="Expense details..."
                  value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                />
              </div>
            </>
          )}
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 22 }}>
            <button type="button" onClick={onClose} style={{ height: 36, padding: '0 16px', border: '1px solid var(--border)', borderRadius: 7, background: 'var(--bg-card)', fontSize: 13, fontWeight: 600, cursor: 'pointer', color: 'var(--text-primary)' }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={{ height: 36, padding: '0 16px', border: 'none', borderRadius: 7, background: 'linear-gradient(135deg, #22D3EE, #0EA5C4)', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7 }}>
              {loading && <span className="spinner" style={{ width: 13, height: 13 }} />}
              {loading ? 'Saving…' : 'Save Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const FuelExpenses = () => {
  const { hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('fuel');
  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fuelForm, setFuelForm] = useState(EMPTY_FUEL_FORM);
  const [expenseForm, setExpenseForm] = useState(EMPTY_EXPENSE_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const canWrite = hasPermission('fuelExpenses', 'write');
  const canDelete = hasPermission('fuelExpenses', 'delete');

  // Load data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [fuelRes, expenseRes, vehiclesRes] = await Promise.all([
          getAllFuelLogs(),
          getAllExpenses(),
          getVehicles(),
        ]);
        setFuelLogs(fuelRes.data.data || []);
        setExpenses(expenseRes.data.data || []);
        setVehicles(vehiclesRes.data.data || []);
      } catch (err) {
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Calculate stats
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthFuel = fuelLogs.filter(log => {
    const d = new Date(log.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const thisMonthExpenses = expenses.filter(exp => {
    const d = new Date(exp.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  
  const totalFuelCost = thisMonthFuel.reduce((sum, log) => sum + (log.cost || 0), 0);
  const totalExpenseAmount = thisMonthExpenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const totalOperationalCost = totalFuelCost + totalExpenseAmount;
  
  const avgFuelEfficiency = thisMonthFuel.length > 0
    ? (thisMonthFuel.reduce((sum, log) => sum + (log.liters || 0), 0) / thisMonthFuel.length).toFixed(1)
    : '0.0';


  // Modal handlers
  const openFuelAdd = () => {
    setEditing(null);
    setFuelForm(EMPTY_FUEL_FORM);
    setError('');
    setModalOpen(true);
  };

  const openFuelEdit = (log) => {
    setEditing({ id: log._id, type: 'fuel' });
    setFuelForm({
      vehicle: log.vehicle?._id || log.vehicle || '',
      liters: log.liters || '',
      cost: log.cost || '',
      date: log.date?.split('T')[0] || '',
      odometerReading: log.odometerReading || '',
      notes: log.notes || '',
    });
    setError('');
    setModalOpen(true);
  };

  const openExpenseAdd = () => {
    setEditing(null);
    setExpenseForm(EMPTY_EXPENSE_FORM);
    setError('');
    setModalOpen(true);
  };

  const openExpenseEdit = (exp) => {
    setEditing({ id: exp._id, type: 'expense' });
    setExpenseForm({
      vehicle: exp.vehicle?._id || exp.vehicle || '',
      category: exp.category || 'Toll',
      amount: exp.amount || '',
      date: exp.date?.split('T')[0] || '',
      note: exp.note || '',
    });
    setError('');
    setModalOpen(true);
  };

  const handleFuelSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing?.type === 'fuel') {
        await updateFuelLog(editing.id, fuelForm);
        setFuelLogs(logs => logs.map(log => log._id === editing.id ? { ...log, ...fuelForm } : log));
      } else {
        const res = await createFuelLog(fuelForm);
        setFuelLogs(logs => [res.data.data, ...logs]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save fuel log.');
    } finally {
      setSaving(false);
    }
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      if (editing?.type === 'expense') {
        await updateExpense(editing.id, expenseForm);
        setExpenses(exps => exps.map(exp => exp._id === editing.id ? { ...exp, ...expenseForm } : exp));
      } else {
        const res = await createExpense(expenseForm);
        setExpenses(exps => [res.data.data, ...exps]);
      }
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save expense.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFuel = (id) => {
    if (!window.confirm('Delete this fuel log?')) return;
    setFuelLogs(logs => logs.filter(log => log._id !== id));
    deleteFuelLog(id).catch(() => {});
  };

  const handleDeleteExpense = (id) => {
    if (!window.confirm('Delete this expense?')) return;
    setExpenses(exps => exps.filter(exp => exp._id !== id));
    deleteExpense(id).catch(() => {});
  };

  // Filter data
  const filteredFuel = fuelLogs.filter(log =>
    log.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
    log.vehicle?.model?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredExpenses = expenses.filter(exp =>
    (exp.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase())) ||
    (exp.vehicle?.model?.toLowerCase().includes(search.toLowerCase())) ||
    (exp.category?.toLowerCase().includes(search.toLowerCase())) ||
    (exp.note?.toLowerCase().includes(search.toLowerCase()))
  );

