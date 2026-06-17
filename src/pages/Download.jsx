import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Download, Globe, Smartphone, HeartPulse, BookOpen } from 'lucide-react';

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
          <a 
            href="https://drive.google.com/drive/folders/1Ds1q8Dj94LK9qcct9Hpeh9oXHUrl5uAB" 
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary flex items-center justify-center gap-3"
            style={{ padding: '1.2rem', fontSize: '1.05rem', borderRadius: '12px', fontWeight: 'bold' }}
          >
            <Smartphone size={22} />
            Download Android App (APK)
          </a>

          <button 
            className="flex items-center justify-center gap-3" 
            style={{ padding: '1.2rem', fontSize: '1.05rem', borderRadius: '12px', fontWeight: 'bold', background: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', cursor: 'pointer' }}
            onClick={() => navigate(inviteId ? `/login?invite=${inviteId}` : '/login')}
          >
            <Globe size={22} />
            Use Web App (No Install)
          </button>
          
          <a 
            href="/manual_en.html" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
            style={{ marginTop: '0.5rem', color: '#2563eb', fontWeight: 'bold', fontSize: '0.95rem', textDecoration: 'none', padding: '0.5rem' }}
          >
            <BookOpen size={18} />
            Read Official User Manual
          </a>
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
