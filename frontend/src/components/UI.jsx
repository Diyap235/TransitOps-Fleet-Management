/**
 * UI.jsx — Shared design-system primitives for TransitOps.
 * All inline-styled reusable pieces live here so every page
 * gets identical interaction tokens without duplication.
 */
import React, { useState } from 'react';
import { AlertCircle, X } from 'lucide-react';

/* ─── Modal ───────────────────────────────────────────────────── */
export const Modal = ({ title, onClose, children, maxWidth = 520 }) => (
  <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
    <div className="modal-panel" style={{ maxWidth }}>
      <div className="modal-header">
        <span className="modal-title">{title}</span>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X size={17} strokeWidth={2} />
        </button>
      </div>
      <div className="modal-body">{children}</div>
    </div>
  </div>
);

/* ─── FormField ───────────────────────────────────────────────── */
export const FormField = ({ label, required, children, hint, error }) => (
  <div className="ff-group">
    {label && (
      <label className="ff-label">
        {label}
        {required && <span className="ff-required">*</span>}
      </label>
    )}
    {children}
    {hint  && !error && <p className="ff-hint">{hint}</p>}
    {error && <p className="ff-error">{error}</p>}
  </div>
);

/* ─── Input ───────────────────────────────────────────────────── */
export const Input = ({ className = '', ...props }) => (
  <input className={`to-input ${className}`} {...props} />
);

/* ─── Select ──────────────────────────────────────────────────── */
export const Select = ({ className = '', children, ...props }) => (
  <select className={`to-input to-select ${className}`} {...props}>
    {children}
  </select>
);

/* ─── ErrorBanner ─────────────────────────────────────────────── */
export const ErrorBanner = ({ message }) =>
  message ? (
    <div className="err-banner">
      <AlertCircle size={14} style={{ flexShrink: 0 }} />
      {message}
    </div>
  ) : null;

/* ─── SaveButton ──────────────────────────────────────────────── */
export const SaveButton = ({ loading, label = 'Save', loadingLabel }) => (
  <button type="submit" disabled={loading} className="btn btn-primary btn-save">
    {loading && <span className="spinner" />}
    {loading ? (loadingLabel ?? `${label.replace(/^Save /, 'Saving ')}…`) : label}
  </button>
);

/* ─── CancelButton ────────────────────────────────────────────── */
export const CancelButton = ({ onClick }) => (
  <button type="button" onClick={onClick} className="btn btn-secondary">
    Cancel
  </button>
);

/* ─── ModalFooter ─────────────────────────────────────────────── */
export const ModalFooter = ({ onClose, loading, saveLabel }) => (
  <div className="modal-footer">
    <CancelButton onClick={onClose} />
    <SaveButton loading={loading} label={saveLabel} />
  </div>
);

/* ─── EmptyState ──────────────────────────────────────────────── */
export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="empty-state">
    <div className="empty-state-ring">
      <div className="empty-state-icon">
        {Icon && <Icon size={24} strokeWidth={1.5} />}
      </div>
    </div>
    <h3 className="empty-state-title">{title}</h3>
    {description && <p className="empty-state-desc">{description}</p>}
    {action}
  </div>
);

/* ─── PageHeader ──────────────────────────────────────────────── */
export const PageHeader = ({ title, subtitle, action }) => (
  <div className="page-header">
    <div className="page-header-left">
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
    {action}
  </div>
);

/* ─── SearchBar ───────────────────────────────────────────────── */
export const SearchBar = ({ value, onChange, placeholder = 'Search…' }) => (
  <div className="search-bar">
    <svg className="search-bar-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
    <input
      type="text"
      className="search-input"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  </div>
);

/* ─── FuelBar ─────────────────────────────────────────────────── */
export const FuelBar = ({ level }) => {
  const color = level > 50 ? '#2FD4A8' : level > 20 ? '#F5A623' : '#FB5B4B';
  return (
    <div className="fuel-bar-wrap">
      <div className="fuel-bar-track">
        <div className="fuel-bar-fill" style={{ width: `${level}%`, background: color }} />
      </div>
      <span className="fuel-bar-label">{level}%</span>
    </div>
  );
};
