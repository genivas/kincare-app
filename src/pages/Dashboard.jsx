import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Activity, Droplets, AlertTriangle, BellRing, Settings as SettingsIcon, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { patient, setPatient, medications, getTodayCaregiver, history } = useContext(GlobalContext);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();
  
  const nextMeds = medications.filter(m => m.status === 'pending');
  nextMeds.sort((a, b) => a.time.localeCompare(b.time));
  const nextMed = nextMeds.length > 0 ? nextMeds[0] : null;

  const todayCaregiver = getTodayCaregiver();

  // History preview (last 3 items)
  const recentHistory = history.slice(0, 3);

  const getUrgencyConfig = (level) => {
    switch(level) {
      case 'danger': return { text: 'Urgent Attention Needed', color: 'var(--danger-color)', dot: 'var(--danger-color)' };
      case 'warning': return { text: 'Observation Needed', color: 'var(--warning-color)', dot: 'var(--warning-color)' };
      default: return { text: 'Health Stable', color: 'var(--text-light)', dot: 'var(--success-color)' };
    }
  };

  const urgencyConfig = getUrgencyConfig(patient?.urgencyLevel);

  const changeStatus = (newStatus) => {
    setPatient({...patient, urgencyLevel: newStatus});
    setShowStatusModal(false);
  };

  return (
    <div className="page-content top-gradient-bg" style={{paddingBottom: '80px', paddingTop: '3rem'}}>
      {/* Modals */}
      {showAlertModal && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="glass-card m-4 text-center" style={{padding: '2rem'}}>
            <div style={{background: '#25D366', color: 'white', padding: '1rem', borderRadius: '50%', display: 'inline-block', marginBottom: '1rem', boxShadow: '0 8px 24px rgba(37, 211, 102, 0.3)'}}>
              <BellRing size={32} />
            </div>
            <h3 style={{fontSize: '1.4rem', marginBottom: '0.5rem'}}>Alert Triggered</h3>
            <p className="mb-4" style={{color: 'var(--text-light)'}}>The family WhatsApp group was successfully notified.</p>
            <button className="btn-primary" onClick={() => setShowAlertModal(false)} style={{padding: '1rem', fontSize: '1.1rem', borderRadius: '12px'}}>Done</button>
          </div>
        </div>
      )}

      {showStatusModal && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="glass-card m-4" style={{width: '90%', maxWidth: '320px', padding: '2rem'}}>
            <h3 className="mb-4 text-center">Update Status</h3>
            <div className="flex flex-col gap-3">
              <button className="btn-secondary" style={{color: 'var(--success-color)', border: 'none', background: 'var(--success-light)', padding: '1rem', borderRadius: '12px'}} onClick={() => changeStatus('success')}>🟢 Stable</button>
              <button className="btn-secondary" style={{color: 'var(--warning-color)', border: 'none', background: 'var(--warning-light)', padding: '1rem', borderRadius: '12px'}} onClick={() => changeStatus('warning')}>🟡 Observation</button>
              <button className="btn-secondary" style={{color: 'var(--danger-color)', border: 'none', background: 'var(--danger-light)', padding: '1rem', borderRadius: '12px'}} onClick={() => changeStatus('danger')}>🔴 Emergency</button>
              <button className="btn-secondary mt-2" style={{border: 'none'}} onClick={() => setShowStatusModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Profile Header */}
      <header className="px-4 mb-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <div style={{position: 'relative'}}>
            <img src={patient?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient?.name || 'Patient'}`} alt="Avatar" className="avatar" style={{width: '64px', height: '64px', borderRadius: '24px', boxShadow: '0 8px 16px rgba(0,0,0,0.08)', border: 'none'}} />
            <div style={{position: 'absolute', bottom: '-4px', right: '-4px', width: '20px', height: '20px', background: 'var(--bg-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '12px', height: '12px', background: urgencyConfig.dot, borderRadius: '50%'}}></div>
            </div>
          </div>
          <div className="flex-1">
            <h1 style={{fontSize: '1.4rem', fontWeight: '700', letterSpacing: '-0.5px', marginBottom: '0.2rem', lineHeight: '1.2'}}>{patient?.name || 'Patient'}</h1>
            <p onClick={() => setShowStatusModal(true)} style={{fontSize: '0.85rem', color: urgencyConfig.color, display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontWeight: '500'}}>
              {urgencyConfig.text} <ChevronRight size={14} />
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowAlertModal(true)}
            style={{width: '40px', height: '40px', borderRadius: '14px', background: 'var(--danger-light)', color: 'var(--danger-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none'}}
          >
            <AlertTriangle size={20} />
          </button>
          <button 
            onClick={() => navigate('/app/settings')}
            style={{width: '40px', height: '40px', borderRadius: '14px', background: 'white', color: 'var(--text-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.04)'}}
          >
            <SettingsIcon size={20} />
          </button>
        </div>
      </header>

      <main className="px-4">
        
        {/* Next Medication Action Card (Huge) */}
        <section className="mb-6">
          <h2 style={{fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.75rem', color: 'var(--text-color)'}}>Priority</h2>
          {nextMed ? (
            <div className="glass-card" style={{background: 'var(--primary-color)', color: 'white', padding: '1.5rem', border: 'none', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.2)'}}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span style={{fontSize: '0.85rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600'}}>Next Medication</span>
                  <h3 style={{fontSize: '2rem', fontWeight: '700', margin: '0.25rem 0'}}>{nextMed.time}</h3>
                  <p style={{fontSize: '1.1rem', fontWeight: '500'}}>{nextMed.name}</p>
                </div>
                <div style={{background: 'rgba(255,255,255,0.2)', padding: '0.75rem', borderRadius: '16px'}}>
                  <BellRing size={24} color="white" />
                </div>
              </div>
              <button className="btn-primary" style={{background: 'white', color: 'var(--primary-color)', padding: '1rem', fontSize: '1rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}} onClick={() => navigate('/app/medications')}>
                Log Medication
              </button>
            </div>
          ) : (
            <div className="glass-card flex items-center gap-3" style={{padding: '1.5rem', background: 'var(--success-light)', border: 'none'}}>
              <div style={{background: 'var(--success-color)', borderRadius: '50%', padding: '0.5rem', color: 'white'}}>
                <Check size={24} />
              </div>
              <div>
                <strong style={{color: 'var(--success-color)', fontSize: '1.1rem'}}>All caught up!</strong>
                <p style={{color: '#065f46', fontSize: '0.9rem'}}>No pending medications.</p>
              </div>
            </div>
          )}
        </section>

        {/* Today's Caregiver & Vitals Grid */}
        <section className="flex gap-3 mb-6">
          <div className="glass-card flex-1 mb-0" style={{padding: '1.25rem'}}>
            <span style={{fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase'}}>Shift</span>
            <div className="flex items-center gap-3 mt-3">
              <img src={todayCaregiver?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Family`} alt={todayCaregiver?.name || 'Family'} style={{width: '44px', height: '44px', borderRadius: '14px', objectFit: 'cover'}}/>
              <div>
                <strong style={{fontSize: '1rem', display: 'block', color: 'var(--primary-color)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80px'}}>{todayCaregiver?.name || 'Family'}</strong>
                <span style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>On duty today</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <div className="glass-card flex items-center justify-between mb-0" style={{padding: '1rem'}}>
              <div>
                <span style={{fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', fontWeight: '600', textTransform: 'uppercase'}}>Pressure</span>
                <strong style={{fontSize: '1.1rem', color: 'var(--text-color)'}}>120/80</strong>
              </div>
              <Activity color="var(--primary-color)" size={20} opacity={0.6} />
            </div>
            <div className="glass-card flex items-center justify-between mb-0" style={{padding: '1rem'}}>
              <div>
                <span style={{fontSize: '0.75rem', color: 'var(--text-light)', display: 'block', fontWeight: '600', textTransform: 'uppercase'}}>Water</span>
                <strong style={{fontSize: '1.1rem', color: 'var(--text-color)'}}>3 💧</strong>
              </div>
              <Droplets color="var(--primary-color)" size={20} opacity={0.6} />
            </div>
          </div>
        </section>

        {/* Recent History */}
        <section className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 style={{fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-color)'}}>Recent Events</h2>
            <button style={{fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '600', background: 'transparent', padding: 0}} onClick={() => navigate('/app/history')}>
              See all
            </button>
          </div>
          <div className="glass-card" style={{padding: '0.5rem 1.25rem'}}>
            <div className="flex-col">
              {recentHistory.map((item, index) => (
                <div key={item.id} className="flex items-center justify-between" style={{borderBottom: index !== recentHistory.length - 1 ? '1px solid #f4f4f5' : 'none', padding: '0.85rem 0'}}>
                  <div className="flex items-center gap-3">
                    <span style={{width: '10px', height: '10px', borderRadius: '50%', background: `var(--${item.color}-color)`}}></span>
                    <div>
                      <p style={{fontSize: '0.95rem', color: 'var(--text-color)', fontWeight: '500'}}>{item.title}</p>
                      <span style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>{item.time}</span>
                    </div>
                  </div>
                  <img src={item.user.avatar} style={{width: '32px', height: '32px', borderRadius: '10px', objectFit: 'cover'}} />
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default Dashboard;
