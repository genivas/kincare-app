import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useTranslation } from 'react-i18next';

const Schedule = () => {
  const { schedule, updateSchedule, family } = useContext(GlobalContext);
  const { t } = useTranslation();

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleAssign = (day, memberId) => {
    updateSchedule({ ...schedule, [day]: memberId });
  };

  return (
    <div className="page-content top-gradient-bg" style={{paddingBottom: '80px', paddingTop: '3rem'}}>
      <header className="px-4 mb-6 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700', margin: 0}}>{t('pages.schedule.title')}</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>{t('pages.schedule.subtitle')}</p>
        </div>
      </header>

      <main className="px-4">
        <div className="glass-card" style={{padding: '0.5rem 1rem'}}>
          {days.map((day, index) => (
            <div key={day} className="flex justify-between items-center py-4" style={{borderBottom: index !== days.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'}}>
              <strong style={{minWidth: '90px', fontSize: '1rem', color: 'var(--text-color)'}}>{day}</strong>
              <select 
                value={schedule[day] || ''} 
                onChange={(e) => handleAssign(day, e.target.value)}
                style={{padding: '0.6rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', color: 'var(--primary-color)', fontFamily: 'inherit', outline: 'none'}}
              >
                <option value="" disabled>{t('pages.schedule.select')}</option>
                {family.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Schedule;
