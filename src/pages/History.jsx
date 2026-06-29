import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Activity, XCircle, AlertCircle, CheckCircle2, Clock, Check, Download } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const History = () => {
  const { history } = useContext(GlobalContext);
  const { t } = useTranslation();

  const getIcon = (type, color) => {
    if(type === 'vitals') return <Activity size={18} color={`var(--${color}-color)`} />;
    if(color === 'danger') return <XCircle size={18} color="var(--danger-color)" />;
    if(color === 'warning') return <AlertCircle size={18} color="var(--warning-color)" />;
    return <Check size={18} color="var(--success-color)" />;
  };

  const getBg = (color) => {
    if(color === 'danger') return 'var(--danger-light)';
    if(color === 'warning') return 'var(--warning-light)';
    return 'var(--success-light)';
  }

  const downloadReport = () => {
    let content = `MedsDone - Care History Report\n`;
    content += `Generated on: ${new Date().toLocaleDateString()}\n`;
    content += `-------------------------------------------------\n\n`;
    history.forEach(item => {
      content += `[${item.time}] ${item.user.name}: ${item.title}\n`;
    });
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MedsDone_Report_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content" style={{paddingBottom: '90px', paddingTop: '3rem', background: 'var(--bg-color)', minHeight: '100vh'}}>
      <header className="px-5 mb-8 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-color)', margin: 0, letterSpacing: '-0.3px'}}>{t('pages.history.title')}</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>{t('pages.history.subtitle')}</p>
        </div>
        <button onClick={downloadReport} style={{background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '100px', border: 'none', fontSize: '0.8rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer'}}>
          <Download size={16} strokeWidth={2.5} /> Report
        </button>
      </header>

      <main className="px-5">
        <div style={{background: '#ffffff', borderRadius: '32px', padding: '2rem 1.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.03)'}}>
          <div className="flex-col gap-4">
            {history.length === 0 && (
              <p className="text-center" style={{color: 'var(--text-light)'}}>{t('pages.history.empty')}</p>
            )}
            {history.map((item, index) => (
              <div key={item.id} className="flex gap-4 relative" style={{borderLeft: index !== history.length -1 ? '1px solid rgba(0,0,0,0.06)' : '1px solid transparent', paddingBottom: '2rem', marginLeft: '14px'}}>
                <div style={{position: 'absolute', left: '-16px', top: '0px', background: getBg(item.color), width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #ffffff'}}>
                  {getIcon(item.type, item.color)}
                </div>
                <div style={{marginLeft: '24px', flex: 1, marginTop: '4px'}}>
                  <p style={{fontSize: '1.05rem', fontWeight: '500', color: 'var(--text-color)', margin: '0 0 0.2rem 0', lineHeight: '1.3'}}>
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-2" style={{background: 'var(--bg-color)', display: 'inline-flex', padding: '0.3rem 0.5rem', borderRadius: '100px'}}>
                    <img src={item.user.avatar} alt={item.user.name} style={{width: '18px', height: '18px', borderRadius: '50%'}} />
                    <span style={{fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '500'}}>{item.user.name} • {item.time}</span>
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
