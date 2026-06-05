import React, { useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';

const Schedule = () => {
  const { schedule, setSchedule, family } = useContext(GlobalContext);

  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

  const handleAssign = (day, memberId) => {
    setSchedule({ ...schedule, [day]: Number(memberId) });
  };

  return (
    <div className="page-content">
      <header className="header">
        <h2>Escala de Plantões</h2>
        <p>Defina o responsável de cada dia</p>
      </header>

      <main className="p-4 pt-0">
        <div className="glass-card">
          {days.map((day, index) => (
            <div key={day} className="flex justify-between items-center py-3" style={{borderBottom: index !== days.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none'}}>
              <strong style={{minWidth: '80px'}}>{day}</strong>
              <select 
                value={schedule[day] || ''} 
                onChange={(e) => handleAssign(day, e.target.value)}
                style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', background: 'white'}}
              >
                <option value="" disabled>Selecionar...</option>
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
