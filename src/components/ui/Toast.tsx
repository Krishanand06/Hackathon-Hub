import React, { useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toast: ToastMessage;
  onRemove: (id: string) => void;
}

const icons = {
  success: <CheckCircle size={16} color="var(--color-success)" />,
  error: <XCircle size={16} color="var(--color-danger)" />,
  warning: <AlertTriangle size={16} color="var(--color-warning)" />,
  info: <Info size={16} color="var(--color-accent)" />,
};

const borderColors = {
  success: 'var(--color-success)',
  error: 'var(--color-danger)',
  warning: 'var(--color-warning)',
  info: 'var(--color-accent)',
};

export function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div className="fade-in" style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      backgroundColor: 'var(--color-bg-primary)',
      border: '1px solid var(--color-border)',
      borderLeft: `3px solid ${borderColors[toast.type]}`,
      borderRadius: '6px',
      padding: '10px 14px',
      minWidth: '260px',
      maxWidth: '380px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    }}>
      {icons[toast.type]}
      <span style={{ flex: 1, fontSize: '13px', color: 'var(--color-text-primary)' }}>{toast.message}</span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', padding: '0', display: 'flex' }}
      >
        <X size={14} />
      </button>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

// Hook
import { useState, useCallback } from 'react';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, type, message }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
