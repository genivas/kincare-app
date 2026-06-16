import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Activity, Droplets, AlertTriangle, BellRing, Settings as SettingsIcon, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { patient, setPatient, medications, getTodayCaregiver, history, tasks, currentUser } = useContext(GlobalContext);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();
  
  const myTasks = tasks ? tasks.filter(t => t.assignedTo?.name === currentUser?.name && t.status !== 'completed') : [];

  const nextMeds = medications.filter(m => m.status === 'pending');
  nextMeds.sort((a, b) => a.time.localeCompare(b.time));
  const nextMed = nextMeds.length > 0 ? nextMeds[0] : null;

  const todayCaregiver = getTodayCaregiver();

  const getUrgencyConfig = (level) => {
    switch(level) {
      case 'danger': return { text: 'Attention Needed', color: 'var(--danger-color)', bg: 'var(--danger-light)' };
      case 'warning': return { text: 'Observation', color: 'var(--warning-color)', bg: 'var(--warning-light)' };
      default: return { text: 'Health Stable', color: 'var(--success-color)', bg: 'var(--success-light)' };
    }
  };

  const urgencyConfig = getUrgencyConfig(patient?.urgencyLevel);

  const changeStatus = (newStatus) => {
    setPatient({...patient, urgencyLevel: newStatus});
    setShowStatusModal(false);
  };

  return (
    <div className="page-content" style={{paddingBottom: '90px', paddingTop: '3rem', background: 'var(--bg-color)', minHeight: '100vh'}}>
      
      {showStatusModal && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(10px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{background: '#fff', border: '1px solid rgba(0,0,0,0.05)', borderRadius: '32px', width: '90%', maxWidth: '320px', padding: '2rem', boxShadow: '0 20px 40px rgba(0,0,0,0.04)'}}>
            <h3 style={{marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)'}}>Update Status</h3>
            <div className="flex flex-col gap-3">
              <button style={{color: 'var(--success-color)', border: 'none', background: 'var(--success-light)', padding: '1rem', borderRadius: '100px', fontWeight: '600'}} onClick={() => changeStatus('success')}>🟢 Stable</button>
              <button style={{color: 'var(--warning-color)', border: 'none', background: 'var(--warning-light)', padding: '1rem', borderRadius: '100px', fontWeight: '600'}} onClick={() => changeStatus('warning')}>🟡 Observation</button>
              <button style={{color: 'var(--danger-color)', border: 'none', background: 'var(--danger-light)', padding: '1rem', borderRadius: '100px', fontWeight: '600'}} onClick={() => changeStatus('danger')}>🔴 Emergency</button>
              <button style={{border: 'none', background: 'transparent', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: '600'}} onClick={() => setShowStatusModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Header Profile */}
      <header className="px-5 mb-8 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div style={{position: 'relative'}}>
            <img src={patient?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient?.name || 'Patient'}`} alt="Avatar" style={{width: '56px', height: '56px', borderRadius: '100px', border: '2px solid white', boxShadow: '0 8px 16px rgba(0,0,0,0.04)'}} />
            <div style={{position: 'absolute', bottom: '0', right: '0', width: '16px', height: '16px', background: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div style={{width: '10px', height: '10px', background: urgencyConfig.color, borderRadius: '50%'}}></div>
            </div>
          </div>
          <div>
            <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0', fontWeight: '500'}}>Caring for</p>
            <h1 style={{fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-color)', margin: 0, letterSpacing: '-0.3px'}}>{patient?.name || 'Loved One'}</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button onClick={() => setShowStatusModal(true)} style={{background: urgencyConfig.bg, color: urgencyConfig.color, padding: '0.5rem 1rem', borderRadius: '100px', border: 'none', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            {urgencyConfig.text} <ChevronRight size={14} />
          </button>
        </div>
      </header>

      <main className="px-5">
        
        {/* Next Medication (Delicate Hero Card) */}
        <section className="mb-8">
          <h2 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-light)'}}>Upcoming Priority</h2>
          {nextMed ? (
            <div style={{background: '#ffffff', borderRadius: '32px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)', position: 'relative', overflow: 'hidden'}}>
              <div style={{position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'var(--primary-light)', borderRadius: '50%', opacity: 0.5}}></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <div style={{display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600', marginBottom: '1rem'}}>
                    <BellRing size={12} strokeWidth={2} /> <span>Medication</span>
                  </div>
                  <h3 style={{fontSize: '2.2rem', fontWeight: '300', margin: '0', color: 'var(--text-color)', letterSpacing: '-1px'}}>{nextMed.time}</h3>
                  <p style={{fontSize: '1.1rem', fontWeight: '500', color: 'var(--text-color)', marginTop: '0.2rem'}}>{nextMed.name}</p>
                </div>
              </div>
              <button style={{width: '100%', background: 'var(--primary-color)', color: '#ffffff', padding: '1.1rem', fontSize: '0.95rem', borderRadius: '100px', border: 'none', fontWeight: '600', boxShadow: '0 8px 16px rgba(0,0,0,0.05)'}} onClick={() => navigate('/app/medications')}>
                Open Medical Log
              </button>
            </div>
          ) : (
            <div style={{background: 'var(--success-light)', borderRadius: '24px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(16, 185, 129, 0.1)'}}>
              <div style={{background: 'white', borderRadius: '50%', padding: '0.6rem', color: 'var(--success-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                <Check size={20} strokeWidth={2.5} />
              </div>
              <div>
                <strong style={{color: 'var(--success-color)', fontSize: '1rem', fontWeight: '600'}}>All caught up!</strong>
                <p style={{color: 'var(--success-color)', fontSize: '0.85rem', opacity: 0.8, margin: 0}}>No pending medications.</p>
              </div>
            </div>
          )}
        </section>

        {/* Shift & Vitals (Pill shaped cards) */}
        <section className="flex gap-4 mb-8">
          <div style={{flex: 1, background: '#ffffff', borderRadius: '24px', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>On Duty</span>
            <div className="flex items-center gap-3 mt-3">
              <img src={todayCaregiver?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Family`} style={{width: '40px', height: '40px', borderRadius: '100px'}}/>
              <div>
                <strong style={{fontSize: '0.95rem', display: 'block', color: 'var(--text-color)', fontWeight: '600'}}>{todayCaregiver?.name || 'Family'}</strong>
              </div>
            </div>
          </div>

          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            <div style={{background: '#ffffff', borderRadius: '100px', padding: '0.75rem 1.25rem', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'}}>
               <span style={{fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: '500'}}>120/80</span>
               <Activity color="var(--primary-color)" size={16} />
            </div>
            <div style={{background: '#ffffff', borderRadius: '100px', padding: '0.75rem 1.25rem', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 2px 8px rgba(0,0,0,0.02)'}}>
               <span style={{fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: '500'}}>3 💧</span>
               <Droplets color="var(--primary-color)" size={16} />
            </div>
          </div>
        </section>

        {/* Tasks Section */}
        {myTasks.length > 0 && (
          <section className="mb-8">
            <h2 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-light)'}}>Your Active Tasks</h2>
            <div className="flex flex-col gap-3">
              {myTasks.map(task => (
                <div key={task.id} style={{background: '#ffffff', borderRadius: '20px', padding: '1.25rem', border: '1px solid rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'}}>
                   <div style={{width: '12px', height: '12px', borderRadius: '50%', border: `2px solid ${task.priority === 'high' ? 'var(--danger-color)' : 'var(--primary-color)'}`}}></div>
                   <div style={{flex: 1}}>
                     <p style={{fontSize: '0.95rem', color: 'var(--text-color)', fontWeight: '500', margin: 0}}>{task.title}</p>
                   </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
    </div>
  );
};

export default Dashboard;
