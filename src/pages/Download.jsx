import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Globe, Smartphone, HeartPulse } from 'lucide-react';

const DownloadPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const inviteId = queryParams.get('invite');

  return (
    <div className="page-content flex flex-col justify-center items-center" style={{ minHeight: '100vh', background: 'var(--bg-color)', padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '2rem', textAlign: 'center' }}>
        <div className="flex flex-col items-center justify-center mb-6">
          <HeartPulse color="#2563eb" size={56} className="mb-3" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px', marginBottom: '0.5rem' }}>
            KinCare
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1rem', lineHeight: '1.5' }}>
            You've been invited to join a family care group! Choose how you want to access KinCare:
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-6">
          <button 
            className="btn-primary flex items-center justify-center gap-3" 
            style={{ padding: '1.2rem', fontSize: '1.05rem', borderRadius: '12px', fontWeight: 'bold' }}
            onClick={() => navigate(inviteId ? `/login?invite=${inviteId}` : '/login')}
          >
            <Globe size={22} />
            Use Web App (No Install)
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
            <span style={{ padding: '0 10px', color: '#94a3b8', fontSize: '0.9rem', fontWeight: '500' }}>OR</span>
            <div style={{ flex: 1, height: '1px', background: '#e2e8f0' }}></div>
          </div>

          <a 
            href="/kincare-android.apk" 
            download
            className="btn-secondary flex flex-col items-center justify-center gap-2" 
            style={{ padding: '1.2rem', fontSize: '1.05rem', borderRadius: '12px', background: '#f8fafc', border: '2px solid #e2e8f0', color: '#334155', textDecoration: 'none', transition: 'all 0.2s' }}
          >
            <div className="flex items-center gap-2 font-bold" style={{color: '#2563eb'}}>
              <Download size={22} color="#2563eb" />
              Download Android App
            </div>
            <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 'normal' }}>
              Requires Android 8.0+
            </span>
          </a>
        </div>

        <div style={{ marginTop: '2rem', padding: '1.2rem', background: '#eff6ff', borderRadius: '12px', textAlign: 'left' }}>
          <h4 style={{ color: '#1e40af', fontSize: '0.95rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Smartphone size={16} /> How to install on Android
          </h4>
          <ol style={{ margin: 0, paddingLeft: '1.2rem', color: '#3b82f6', fontSize: '0.85rem', lineHeight: '1.6' }}>
            <li>Tap the Download button above</li>
            <li>Open the downloaded <b>kincare-android.apk</b> file</li>
            <li>If prompted, allow <b>"Install from unknown sources"</b></li>
            <li>Open the app and {inviteId ? 'create your free account' : 'log in'}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
