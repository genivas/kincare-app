import React, { useContext, useState, useEffect } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Activity, Droplets, AlertTriangle, BellRing, Settings as SettingsIcon, Check, ChevronRight, Heart, Smile, Frown, Meh, Sparkles, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';

const Dashboard = () => {
  const { patient, setPatient, medications, getTodayCaregiver, history, tasks, currentUser, logDailySync, sendKudos } = useContext(GlobalContext);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDailySync, setShowDailySync] = useState(false);
  const [dailyStep, setDailyStep] = useState(1);
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedStress, setSelectedStress] = useState(null);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  // Check if daily sync was done today
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const hasSynced = localStorage.getItem(`dailySync_${today}_${currentUser?.id}`);
    if (!hasSynced && currentUser?.familyId) {
      setShowDailySync(true);
    }
  }, [currentUser]);

  const handleSyncComplete = () => {
    logDailySync(selectedStress || 'Neutral', selectedMood || 'Neutral');
    const today = new Date().toLocaleDateString();
    localStorage.setItem(`dailySync_${today}_${currentUser?.id}`, 'true');
    setShowDailySync(false);
    
    // GAMIFICATION: Confetti burst!
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#ec4899']
    });
  };

  const handleSendKudos = (userId) => {
    sendKudos(userId, "You're doing a great job!");
    confetti({
      particleCount: 50,
      spread: 40,
      origin: { y: 0.8 },
      colors: ['#ec4899', '#f43f5e']
    });
  };
  
  const myTasks = tasks ? tasks.filter(t => t.assignedTo?.name === currentUser?.name && t.status !== 'completed') : [];

  const nextMeds = medications.filter(m => m.status === 'pending');
  nextMeds.sort((a, b) => a.time.localeCompare(b.time));
  const nextMed = nextMeds.length > 0 ? nextMeds[0] : null;

  const todayCaregiver = getTodayCaregiver();

  const getUrgencyConfig = (level) => {
    switch(level) {
      case 'danger': return { text: t('dashboard.status.attentionNeeded'), color: 'var(--danger-color)', bg: 'var(--danger-light)' };
      case 'warning': return { text: t('dashboard.status.observation'), color: 'var(--warning-color)', bg: 'var(--warning-light)' };
      default: return { text: t('dashboard.status.healthStable'), color: 'var(--success-color)', bg: 'var(--success-light)' };
    }
  };

  const urgencyConfig = getUrgencyConfig(patient?.urgencyLevel);

  const changeStatus = (newStatus) => {
    setPatient({...patient, urgencyLevel: newStatus});
    setShowStatusModal(false);
  };

  return (
    <div className="page-content" style={{paddingBottom: '90px', paddingTop: '3rem', background: 'var(--bg-color)', minHeight: '100vh'}}>
      
      {/* GAMIFICATION: Daily Sync Routine Modal */}
      {showDailySync && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(12px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="glass-card" style={{width: '90%', maxWidth: '360px', padding: '2.5rem 2rem', textAlign: 'center'}}>
            
            {dailyStep === 1 ? (
              <>
                <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)', marginBottom: '0.5rem'}}>{t('dashboard.dailySync.title')}</h2>
                <p style={{color: 'var(--text-light)', marginBottom: '2rem'}}>{t('dashboard.dailySync.moodQ', { name: patient?.name || 'your loved one' })}</p>
                
                <div className="flex justify-center gap-4 mb-8">
                  <button onClick={() => setSelectedMood('Bad')} style={{background: selectedMood === 'Bad' ? 'var(--danger-light)' : '#f1f5f9', border: selectedMood === 'Bad' ? '2px solid var(--danger-color)' : '2px solid transparent', padding: '1rem', borderRadius: '20px', transition: 'all 0.2s'}}><Frown size={32} color={selectedMood === 'Bad' ? 'var(--danger-color)' : '#94a3b8'} /></button>
                  <button onClick={() => setSelectedMood('Okay')} style={{background: selectedMood === 'Okay' ? 'var(--warning-light)' : '#f1f5f9', border: selectedMood === 'Okay' ? '2px solid var(--warning-color)' : '2px solid transparent', padding: '1rem', borderRadius: '20px', transition: 'all 0.2s'}}><Meh size={32} color={selectedMood === 'Okay' ? 'var(--warning-color)' : '#94a3b8'} /></button>
                  <button onClick={() => setSelectedMood('Good')} style={{background: selectedMood === 'Good' ? 'var(--success-light)' : '#f1f5f9', border: selectedMood === 'Good' ? '2px solid var(--success-color)' : '2px solid transparent', padding: '1rem', borderRadius: '20px', transition: 'all 0.2s'}}><Smile size={32} color={selectedMood === 'Good' ? 'var(--success-color)' : '#94a3b8'} /></button>
                </div>
                <button 
                  disabled={!selectedMood}
                  onClick={() => setDailyStep(2)}
                  style={{width: '100%', padding: '1rem', background: selectedMood ? 'var(--primary-color)' : '#cbd5e1', color: '#fff', borderRadius: '100px', fontWeight: '600', border: 'none', transition: 'all 0.2s'}}
                >
                  {t('dashboard.dailySync.btnNext')} <ChevronRight size={18} style={{display: 'inline', verticalAlign: 'text-bottom'}}/>
                </button>
              </>
            ) : (
              <>
                <h2 style={{fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-color)', marginBottom: '0.5rem'}}>{t('dashboard.dailySync.stressTitle')}</h2>
                <p style={{color: 'var(--text-light)', marginBottom: '2rem'}}>{t('dashboard.dailySync.stressQ')}</p>
                
                <div className="flex justify-center gap-4 mb-8">
                  <button onClick={() => setSelectedStress('High')} style={{background: selectedStress === 'High' ? 'var(--danger-light)' : '#f1f5f9', border: selectedStress === 'High' ? '2px solid var(--danger-color)' : '2px solid transparent', padding: '1rem', borderRadius: '20px', transition: 'all 0.2s', fontSize: '1.5rem'}}>🤯</button>
                  <button onClick={() => setSelectedStress('Medium')} style={{background: selectedStress === 'Medium' ? 'var(--warning-light)' : '#f1f5f9', border: selectedStress === 'Medium' ? '2px solid var(--warning-color)' : '2px solid transparent', padding: '1rem', borderRadius: '20px', transition: 'all 0.2s', fontSize: '1.5rem'}}>😮‍💨</button>
                  <button onClick={() => setSelectedStress('Low')} style={{background: selectedStress === 'Low' ? 'var(--success-light)' : '#f1f5f9', border: selectedStress === 'Low' ? '2px solid var(--success-color)' : '2px solid transparent', padding: '1rem', borderRadius: '20px', transition: 'all 0.2s', fontSize: '1.5rem'}}>😌</button>
                </div>
                <button 
                  disabled={!selectedStress}
                  onClick={handleSyncComplete}
                  style={{width: '100%', padding: '1rem', background: selectedStress ? 'var(--primary-color)' : '#cbd5e1', color: '#fff', borderRadius: '100px', fontWeight: '600', border: 'none', transition: 'all 0.2s', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}
                >
                  <Sparkles size={18} /> {t('dashboard.dailySync.btnComplete')}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showStatusModal && (
        <div style={{position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(255,255,255,0.4)', backdropFilter: 'blur(12px)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="glass-card" style={{width: '90%', maxWidth: '320px', padding: '2rem'}}>
            <h3 style={{marginBottom: '1.5rem', textAlign: 'center', fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-color)'}}>{t('dashboard.status.title')}</h3>
            <div className="flex flex-col gap-3">
              <button style={{color: 'var(--success-color)', border: 'none', background: 'var(--success-light)', padding: '1rem', borderRadius: '100px', fontWeight: '600'}} onClick={() => changeStatus('success')}>🟢 {t('dashboard.status.stable')}</button>
              <button style={{color: 'var(--warning-color)', border: 'none', background: 'var(--warning-light)', padding: '1rem', borderRadius: '100px', fontWeight: '600'}} onClick={() => changeStatus('warning')}>🟡 {t('dashboard.status.observation')}</button>
              <button style={{color: 'var(--danger-color)', border: 'none', background: 'var(--danger-light)', padding: '1rem', borderRadius: '100px', fontWeight: '600'}} onClick={() => changeStatus('danger')}>🔴 {t('dashboard.status.emergency')}</button>
              <button style={{border: 'none', background: 'transparent', color: 'var(--text-light)', marginTop: '0.5rem', fontWeight: '600'}} onClick={() => setShowStatusModal(false)}>{t('dashboard.status.cancel')}</button>
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
            <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0', fontWeight: '500'}}>{t('dashboard.header.caringFor')}</p>
            <div className="flex items-center gap-2">
               <h1 style={{fontSize: '1.3rem', fontWeight: '700', color: 'var(--text-color)', margin: 0, letterSpacing: '-0.3px'}}>{patient?.name || 'Loved One'}</h1>
               {patient?.careStreak > 0 && (
                 <span style={{background: '#ffedd5', color: '#ea580c', padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px'}}>
                   🔥 {patient.careStreak}
                 </span>
               )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            onChange={(e) => i18n.changeLanguage(e.target.value)} 
            value={i18n.language || 'en'}
            style={{padding: '0.3rem', borderRadius: '100px', border: '1px solid rgba(0,0,0,0.05)', background: 'white', cursor: 'pointer', fontSize: '0.8rem', outline: 'none'}}
          >
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="fr">🇫🇷 FR</option>
            <option value="it">🇮🇹 IT</option>
            <option value="de">🇩🇪 DE</option>
          </select>
          <button onClick={() => setShowStatusModal(true)} style={{background: urgencyConfig.bg, color: urgencyConfig.color, padding: '0.5rem 1rem', borderRadius: '100px', border: 'none', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
            {urgencyConfig.text} <ChevronRight size={14} />
          </button>
          <button 
            onClick={() => navigate('/app/settings')}
            style={{background: 'white', color: 'var(--text-light)', width: '36px', height: '36px', borderRadius: '50%', border: '1px solid rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'}}
          >
            <SettingsIcon size={18} strokeWidth={1.5} />
          </button>
        </div>
      </header>

      <main className="px-5">
        
        {/* Next Medication (Delicate Hero Card) */}
        <section className="mb-8">
          <h2 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-light)'}}>{t('dashboard.meds.upcoming')}</h2>
          {nextMed ? (
            <div className="glass-card" style={{background: 'var(--primary-gradient)', color: 'white', position: 'relative', overflow: 'hidden', padding: '1.75rem', border: 'none'}}>
              <div style={{position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', filter: 'blur(10px)'}}></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div>
                  <div style={{display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '0.3rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600', marginBottom: '1rem', backdropFilter: 'blur(5px)'}}>
                    <BellRing size={12} strokeWidth={2} /> <span>{t('dashboard.meds.medication')}</span>
                  </div>
                  <h3 style={{fontSize: '2.5rem', fontWeight: '800', margin: '0', color: 'white', letterSpacing: '-1px'}}>{nextMed.time}</h3>
                  <p style={{fontSize: '1.15rem', fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginTop: '0.2rem'}}>{nextMed.name}</p>
                </div>
              </div>
              <button style={{width: '100%', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '1.1rem', fontSize: '0.95rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.3)', fontWeight: '600', backdropFilter: 'blur(10px)', transition: 'background 0.2s'}} onClick={() => navigate('/app/medications')}>
                {t('dashboard.meds.openLog')}
              </button>
            </div>
          ) : (
            <div style={{background: 'var(--success-light)', borderRadius: '24px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid rgba(16, 185, 129, 0.1)'}}>
              <div style={{background: 'white', borderRadius: '50%', padding: '0.6rem', color: 'var(--success-color)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)'}}>
                <Check size={20} strokeWidth={2.5} />
              </div>
              <div>
                <strong style={{color: 'var(--success-color)', fontSize: '1rem', fontWeight: '600'}}>{t('dashboard.meds.caughtUp')}</strong>
                <p style={{color: 'var(--success-color)', fontSize: '0.85rem', opacity: 0.8, margin: 0}}>{t('dashboard.meds.noPending')}</p>
              </div>
            </div>
          )}
        </section>

        {/* Shift & Vitals (Glass Cards) */}
        <section className="flex gap-4 mb-8">
          <div className="glass-card" style={{flex: 1, display: 'flex', flexDirection: 'column', marginBottom: 0, padding: '1.25rem'}}>
            <span style={{fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px'}}>{t('dashboard.duty.title')}</span>
            <div className="flex items-center gap-3 mt-3 mb-auto">
              <img src={todayCaregiver?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=Family`} style={{width: '40px', height: '40px', borderRadius: '100px'}}/>
              <div>
                <strong style={{fontSize: '0.95rem', display: 'block', color: 'var(--text-color)', fontWeight: '600'}}>{todayCaregiver?.name || t('dashboard.duty.family')}</strong>
              </div>
            </div>
            
            {/* GAMIFICATION: Send Kudos Button */}
            {todayCaregiver && todayCaregiver.id !== currentUser?.id && (
              <button 
                onClick={() => handleSendKudos(todayCaregiver.id)}
                style={{marginTop: '1rem', width: '100%', background: '#fdf2f8', color: '#db2777', border: '1px solid #fbcfe8', padding: '0.6rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s'}}
              >
                <Heart size={14} fill="#db2777" /> {t('dashboard.duty.kudos')}
              </button>
            )}
            {todayCaregiver && todayCaregiver.id === currentUser?.id && (
              <div style={{marginTop: '1rem', width: '100%', background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.6rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '600', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.4rem'}}>
                <ThumbsUp size={14} /> {t('dashboard.duty.youDuty')}
              </div>
            )}
          </div>

          <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            <div className="glass-card" style={{padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0}}>
               <span style={{fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '600'}}>120/80</span>
               <Activity color="var(--primary-color)" size={18} />
            </div>
            <div className="glass-card" style={{padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 0}}>
               <span style={{fontSize: '0.9rem', color: 'var(--text-color)', fontWeight: '600'}}>3 💧</span>
               <Droplets color="var(--primary-color)" size={18} />
            </div>
          </div>
        </section>

        {/* Tasks Section */}
        {myTasks.length > 0 && (
          <section className="mb-8">
            <h2 style={{fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', color: 'var(--text-light)'}}>{t('dashboard.tasks.title')}</h2>
            <div className="flex flex-col gap-3">
              {myTasks.map(task => (
                <div key={task.id} className="glass-card" style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', marginBottom: 0}}>
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
