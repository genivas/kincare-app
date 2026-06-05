import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Activity, XCircle, AlertCircle, CheckCircle2 } from 'lucide-react';

const History = () => {
  const { history } = useContext(GlobalContext);

  const getIcon = (type, color) => {
    if(type === 'vitals') return <Activity size={20} color={`var(--${color}-color)`} />;
    if(color === 'danger') return <XCircle size={20} color="var(--danger-color)" />;
    if(color === 'warning') return <AlertCircle size={20} color="var(--warning-color)" />;
    return <CheckCircle2 size={20} color="var(--success-color)" />;
  };

  return (
    <div className="page-content">
      <header className="header">
        <h2>Medical Records & History</h2>
        <p>Timeline of events</p>
      </header>

      <main className="p-4 pt-0">
        <div className="glass-card">
          <div className="flex-col gap-4">
            {history.map((item, index) => (
              <div key={item.id} className="flex gap-3 relative" style={{borderLeft: index !== history.length -1 ? '2px solid #e2e8f0' : '2px solid transparent', paddingBottom: '1.5rem', marginLeft: '10px'}}>
                <div style={{position: 'absolute', left: '-11px', top: '-2px', background: 'white', borderRadius: '50%'}}>
                  {getIcon(item.type, item.color)}
                </div>
                <div style={{marginLeft: '20px', flex: 1}}>
                  <p style={{fontSize: '1rem', fontWeight: '600', color: `var(--${item.color}-color, var(--text-color))`}}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <img src={item.user.avatar} alt={item.user.name} className="avatar" style={{width: '20px', height: '20px', border: 'none', boxShadow: 'none'}} />
                    <span style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>{item.user.name} • {item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
