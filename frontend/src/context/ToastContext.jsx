import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

const ICONS = {
  success: <CheckCircle2 size={16} strokeWidth={2} />,
  warning: <AlertTriangle size={16} strokeWidth={2} />,
  error:   <XCircle      size={16} strokeWidth={2} />,
  info:    <Info         size={16} strokeWidth={2} />,
};

let _uid = 0;

// ── ToastContainer — rendered once inside Layout ─────────────────
export const ToastContainer = () => {
  const { toasts, dismiss } = useToast();

  return (
    <div className="toast-stack" role="region" aria-label="Notifications">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`toast${t.leaving ? ' leaving' : ''}`}
          data-type={t.type}
          role="alert"
        >
          <span className="toast-icon">{ICONS[t.type] ?? ICONS.info}</span>
          <div className="toast-body">
            <div className="toast-title">{t.title}</div>
            {t.sub && <div className="toast-sub">{t.sub}</div>}
          </div>
          <button className="toast-close" onClick={() => dismiss(t.id)} aria-label="Dismiss">
            <X size={14} strokeWidth={2} />
          </button>
        </div>
      ))}
    </div>
  );
};

// ── Provider ─────────────────────────────────────────────────────
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timers = useRef({});

  const dismiss = useCallback((id) => {
    // mark as leaving so animation plays, then remove
    setToasts(ts => ts.map(t => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => {
      setToasts(ts => ts.filter(t => t.id !== id));
      delete timers.current[id];
    }, 260);
  }, []);

  const toast = useCallback(({ type = 'info', title, sub, duration = 3200 }) => {
    const id = ++_uid;
    setToasts(ts => [...ts, { id, type, title, sub, leaving: false }]);
    timers.current[id] = setTimeout(() => dismiss(id), duration);
    return id;
  }, [dismiss]);

  // Convenience aliases
  const success = useCallback((title, sub) => toast({ type: 'success', title, sub }), [toast]);
  const warning = useCallback((title, sub) => toast({ type: 'warning', title, sub }), [toast]);
  const error   = useCallback((title, sub) => toast({ type: 'error',   title, sub }), [toast]);
  const info    = useCallback((title, sub) => toast({ type: 'info',    title, sub }), [toast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, success, warning, error, info, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export default ToastContext;
