import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Pill, CheckSquare, Calendar, ClipboardList, Settings as SettingsIcon } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/app" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Home size={22} />
        <span style={{fontSize: '0.65rem'}}>Home</span>
      </NavLink>
      <NavLink to="/app/history" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <ClipboardList size={22} />
        <span style={{fontSize: '0.65rem'}}>History</span>
      </NavLink>
      <NavLink to="/app/medications" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Pill size={22} />
        <span style={{fontSize: '0.65rem'}}>Meds</span>
      </NavLink>
      <NavLink to="/app/schedule" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Calendar size={22} />
        <span style={{fontSize: '0.65rem'}}>Schedule</span>
      </NavLink>
      <NavLink to="/app/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <CheckSquare size={22} />
        <span style={{fontSize: '0.65rem'}}>Tasks</span>
      </NavLink>
    </nav>
  );
};

export default BottomNav;
