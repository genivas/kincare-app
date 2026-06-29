import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Plus, X, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Tasks = () => {
  const { tasks, addTask, updateTask, currentUser, deleteTask } = useContext(GlobalContext);
  const { t } = useTranslation();
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const handleAssignTask = async (id) => {
    await updateTask(id, {
      status: 'in_progress',
      assignedTo: currentUser
    });
  };

  const handleCompleteTask = async (id) => {
    await updateTask(id, {
      status: 'completed'
    });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if(newTaskTitle) {
      await addTask({
        title: newTaskTitle,
        priority: newTaskPriority,
        assignedTo: null,
        status: 'open'
      });
      setShowAddForm(false);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
    }
  };

  return (
    <div className="page-content" style={{paddingBottom: '90px', paddingTop: '3rem', background: 'var(--bg-color)', minHeight: '100vh'}}>
      <header className="px-5 mb-8 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-color)', margin: 0, letterSpacing: '-0.3px'}}>{t('pages.tasks.title')}</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>{t('pages.tasks.subtitle')}</p>
        </div>
      </header>

      <button className="fab-button" onClick={() => setShowAddForm(true)} style={{bottom: '90px', right: '20px'}}>
        <Plus size={24} />
      </button>

      <main className="px-5">
        {showAddForm && (
          <div style={{background: '#ffffff', borderRadius: '32px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', marginBottom: '2rem'}}>
            <div className="flex justify-between items-center mb-5">
              <h3 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-color)'}}>{t('pages.tasks.addTitle')}</h3>
              <button style={{background: 'var(--bg-color)', color: 'var(--text-light)', padding: '0.5rem', borderRadius: '50%', border: 'none', display: 'flex'}} onClick={() => setShowAddForm(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="flex-col gap-4 flex">
              <input 
                type="text" 
                placeholder={t('pages.tasks.inputPlaceholder')} 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                style={{padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', width: '100%', background: '#ffffff', fontSize: '1rem'}}
                required
              />
              <select 
                value={newTaskPriority} 
                onChange={e => setNewTaskPriority(e.target.value)}
                style={{padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', width: '100%', background: '#ffffff', fontSize: '1rem'}}
              >
                <option value="low">{t('pages.tasks.prioLow')}</option>
                <option value="medium">{t('pages.tasks.prioNormal')}</option>
                <option value="high">{t('pages.tasks.prioHigh')}</option>
              </select>
              <button type="submit" style={{padding: '1.1rem', borderRadius: '100px', fontSize: '1rem', fontWeight: '600', background: 'var(--primary-color)', color: 'white', border: 'none', marginTop: '1rem'}}>
                {t('pages.tasks.btnAdd')}
              </button>
            </form>
          </div>
        )}

        {tasks.filter(t => t.status !== 'completed').map(task => {
          
          let priorityColor = 'var(--primary-color)';
          let priorityBg = 'var(--primary-light)';
          let priorityLabel = t('pages.tasks.labelNormal');
          
          if(task.priority === 'high') { priorityColor = 'var(--danger-color)'; priorityBg = 'var(--danger-light)'; priorityLabel = t('pages.tasks.labelHigh'); }
          if(task.priority === 'low') { priorityColor = 'var(--success-color)'; priorityBg = 'var(--success-light)'; priorityLabel = t('pages.tasks.labelLow'); }

          return (
            <div key={task.id} style={{background: '#ffffff', borderRadius: '24px', padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', display: 'flex', flexDirection: 'column'}}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-3 items-start flex-1">
                  <button onClick={() => handleCompleteTask(task.id)} style={{background: 'transparent', border: 'none', padding: 0, marginTop: '0.2rem', color: 'var(--text-light)'}}>
                    <Circle size={24} strokeWidth={1.5} />
                  </button>
                  <div>
                    <p style={{fontSize: '1.05rem', color: 'var(--text-color)', fontWeight: '500', margin: '0 0 0.5rem 0', lineHeight: '1.4'}}>{task.title}</p>
                    <div style={{display: 'inline-block', background: priorityBg, color: priorityColor, padding: '0.2rem 0.6rem', borderRadius: '100px', fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase'}}>
                      {priorityLabel}
                    </div>
                  </div>
                </div>
                <button onClick={() => { if(window.confirm('Delete task?')) deleteTask(task.id) }} style={{background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.2rem'}}>
                  <Trash2 size={18} strokeWidth={1.5} />
                </button>
              </div>

              {task.status === 'open' ? (
                <div className="mt-4 pt-4" style={{borderTop: '1px solid rgba(0,0,0,0.03)'}}>
                  <button 
                    style={{width: '100%', padding: '0.85rem', borderRadius: '100px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', fontWeight: '600', fontSize: '0.9rem'}}
                    onClick={() => handleAssignTask(task.id)}
                  >
                    {t('pages.tasks.btnDoIt')}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mt-4 pt-4" style={{borderTop: '1px solid rgba(0,0,0,0.03)'}}>
                  <img src={task.assignedTo?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo?.name || 'User'}`} alt={task.assignedTo?.name} style={{width: '24px', height: '24px', borderRadius: '50%'}} />
                  <span style={{fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: '500'}}>
                    <strong style={{color: 'var(--text-color)'}}>{task.assignedTo?.name || 'Someone'}</strong> {t('pages.tasks.isOnIt')}
                  </span>
                </div>
              )}
            </div>
          );
        })}

        {tasks.filter(t => t.status !== 'completed').length === 0 && !showAddForm && (
          <div className="text-center p-8 text-gray-500" style={{marginTop: '2rem'}}>
            <div style={{background: '#ffffff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'}}>
              <CheckCircle2 color="var(--success-color)" size={32} strokeWidth={1.5} />
            </div>
            <p>{t('pages.tasks.empty')}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
