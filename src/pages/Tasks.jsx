import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Plus, X } from 'lucide-react';

const Tasks = () => {
  const { tasks, setTasks, currentUser } = useContext(GlobalContext);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('medium');

  const handleAssignTask = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        return {
          ...task,
          status: 'in_progress',
          assignedTo: currentUser
        };
      }
      return task;
    }));
  };

  const handleAddTask = (e) => {
    e.preventDefault();
    if(newTaskTitle) {
      setTasks([...tasks, {
        id: Date.now(),
        title: newTaskTitle,
        priority: newTaskPriority,
        assignedTo: null,
        status: 'open'
      }]);
      setShowAddForm(false);
      setNewTaskTitle('');
      setNewTaskPriority('medium');
    }
  };

  return (
    <div className="page-content" style={{paddingBottom: '80px', paddingTop: '3rem'}}>
      <header className="px-4 mb-6 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700', margin: 0}}>Task Board</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>Share the responsibilities</p>
        </div>
        <button className="btn-primary" style={{width: 'auto', padding: '0.5rem 1rem', borderRadius: '999px'}} onClick={() => setShowAddForm(true)}>
          <Plus size={20} />
        </button>
      </header>

      <main className="px-4">
        {showAddForm && (
          <div className="glass-card mb-4" style={{border: '2px solid var(--primary-color)'}}>
            <div className="flex justify-between items-center mb-3">
              <h3 style={{margin: 0}}>New Task</h3>
              <button style={{background: 'transparent', padding: 0, border: 'none'}} onClick={() => setShowAddForm(false)}>
                <X size={20} color="var(--text-light)"/>
              </button>
            </div>
            <form onSubmit={handleAddTask} className="flex-col gap-3 flex">
              <input 
                type="text" 
                placeholder="What needs to be done?" 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit', background: '#f8fafc'}}
                required
              />
              <select 
                value={newTaskPriority} 
                onChange={e => setNewTaskPriority(e.target.value)}
                style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit', background: '#f8fafc'}}
              >
                <option value="low">Priority: Low</option>
                <option value="medium">Priority: Normal</option>
                <option value="high">Priority: High</option>
              </select>
              <button type="submit" className="btn-primary mt-2" style={{padding: '0.85rem', borderRadius: '10px'}}>Add Task</button>
            </form>
          </div>
        )}

        {tasks.map(task => (
          <div key={task.id} className="glass-card mb-4">
            <div className="flex justify-between items-start mb-3">
              <strong style={{fontSize: '1.05rem', lineHeight: '1.4'}}>{task.title}</strong>
              {task.priority === 'high' && <span className="badge badge-danger">High</span>}
              {task.priority === 'medium' && <span className="badge badge-warning">Normal</span>}
              {task.priority === 'low' && <span className="badge badge-success">Low</span>}
            </div>

            {task.status === 'open' ? (
              <div className="mt-4">
                <p className="mb-3" style={{fontSize: '0.85rem', color: 'var(--text-light)'}}>No one is assigned yet.</p>
                <button 
                  className="btn-secondary" 
                  style={{width: '100%', padding: '0.75rem', borderRadius: '10px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)', fontWeight: '600'}}
                  onClick={() => handleAssignTask(task.id)}
                >
                  I'll do this
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-4" style={{background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '12px'}}>
                <img src={task.assignedTo?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignedTo?.name || 'User'}`} alt={task.assignedTo?.name} className="avatar" style={{width: '28px', height: '28px', borderColor: 'var(--primary-color)'}} />
                <span style={{fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '600'}}>
                  {task.assignedTo?.name || 'Someone'} is on it
                </span>
              </div>
            )}
          </div>
        ))}
        {tasks.length === 0 && !showAddForm && (
          <div className="text-center p-8 text-gray-500">
            No tasks yet. Click the + button to create one.
          </div>
        )}
      </main>
    </div>
  );
};

export default Tasks;
