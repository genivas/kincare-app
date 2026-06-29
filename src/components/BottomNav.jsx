import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Pill, CheckSquare, Calendar, ClipboardList, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BottomNav = () => {
  const { t } = useTranslation();
  return (
    <nav className="bottom-nav">
      <NavLink to="/app" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-wrapper"><Home size={22} strokeWidth={1.5} /></div>
        <span style={{fontSize: '0.65rem'}}>{t('nav.home')}</span>
      </NavLink>
      <NavLink to="/app/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-wrapper"><ClipboardList size={22} strokeWidth={1.5} /></div>
        <span style={{fontSize: '0.65rem'}}>{t('nav.history')}</span>
      </NavLink>
      <NavLink to="/app/medications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-wrapper"><Pill size={22} strokeWidth={1.5} /></div>
        <span style={{fontSize: '0.65rem'}}>{t('nav.meds')}</span>
      </NavLink>
      <NavLink to="/app/schedule" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-wrapper"><Calendar size={22} strokeWidth={1.5} /></div>
        <span style={{fontSize: '0.65rem'}}>{t('nav.schedule')}</span>
      </NavLink>
      <NavLink to="/app/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <div className="icon-wrapper"><CheckSquare size={22} strokeWidth={1.5} /></div>
        <span style={{fontSize: '0.65rem'}}>{t('nav.tasks')}</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
