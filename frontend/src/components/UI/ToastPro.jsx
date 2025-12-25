import React from 'react';
import { Toaster, toast } from 'react-hot-toast';

const ACCENT = '#b76a2b';
const ERROR_ACCENT = '#ef4444';

function ToastLayout({ id, title, message, accent = ACCENT, icon = '✓' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', minWidth: 360 }}>
      <div style={{ width: 4, height: 64, background: accent, borderRadius: 8, marginRight: 14 }} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 22,
          border: `2px solid ${accent}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 14,
        }}>
          <span style={{ color: accent, fontSize: 18 }}>{icon}</span>
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, color: '#111827', fontWeight: 700 }}>{title}</div>
          {message && <div style={{ marginTop: 6, color: '#6b7280', fontSize: 15 }}>{message}</div>}
        </div>
      </div>

      <button onClick={() => toast.dismiss(id)} style={{
        background: 'transparent',
        border: 'none',
        color: '#6b7280',
        fontSize: 20,
        cursor: 'pointer',
        marginLeft: 12,
      }}>✕</button>
    </div>
  );
}

export function showSuccessToast(title, message) {
  toast.custom((t) => (
    <div style={{
      background: '#ffffff',
      borderRadius: 12,
      padding: 12,
      boxShadow: '0 8px 30px rgba(2,6,23,0.08)',
    }}>
      <ToastLayout id={t.id} title={title} message={message} accent={ACCENT} icon={'✓'} />
    </div>
  ));
}

export function showErrorToast(title, message) {
  toast.custom((t) => (
    <div style={{
      background: '#ffffff',
      borderRadius: 12,
      padding: 12,
      boxShadow: '0 8px 30px rgba(2,6,23,0.08)',
    }}>
      <ToastLayout id={t.id} title={title} message={message} accent={ERROR_ACCENT} icon={'✖'} />
    </div>
  ));
}

export default function ToastPro() {
  return (
    <Toaster
      position="top-right"
      containerStyle={{ marginTop: '30px', zIndex: 9999 }}
      toastOptions={{ duration: 4500 }}
    />
  );
}
