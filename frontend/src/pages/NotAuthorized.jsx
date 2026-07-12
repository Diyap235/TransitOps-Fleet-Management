import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

const NotAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ maxWidth: 600, margin: '80px auto', textAlign: 'center' }}>
      <div className="card-body" style={{ padding: 60 }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #FEF2F2, #FEE2E2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <ShieldAlert size={36} color="#DC2626" strokeWidth={1.5} />
        </div>

        <h2 style={{
          fontSize: 24,
          fontWeight: 700,
          color: 'var(--text-primary)',
          marginBottom: 12,
        }}>
          Access Denied
        </h2>

        <p style={{
          fontSize: 15,
          color: 'var(--text-muted)',
          lineHeight: 1.6,
          marginBottom: 32,
          maxWidth: 400,
          margin: '0 auto 32px',
        }}>
          You don't have permission to access this page. Contact your Fleet Manager if you believe this is an error.
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
        >
          <ArrowLeft size={16} strokeWidth={2} />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default NotAuthorized;
