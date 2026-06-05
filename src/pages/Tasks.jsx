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
    <div className="page-content">
      <header className="header flex justify-between items-center">
        <div>
          <h2>Mural de Tarefas</h2>
          <p>Divida as responsabilidades</p>
        </div>
        <button className="btn-primary" style={{width: 'auto', padding: '0.5rem 1rem', borderRadius: '999px'}} onClick={() => setShowAddForm(true)}>
          <Plus size={20} />
        </button>
      </header>

      <main className="p-4 pt-0">
        {showAddForm && (
          <div className="glass-card mb-4" style={{border: '1px solid var(--primary-color)'}}>
            <div className="flex justify-between items-center mb-3">
              <h3>Nova Tarefa</h3>
              <button style={{background: 'transparent', padding: 0}} onClick={() => setShowAddForm(false)}>
                <X size={20} color="var(--text-light)"/>
              </button>
            </div>
            <form onSubmit={handleAddTask} className="flex-col gap-3 flex">
              <input 
                type="text" 
                placeholder="O que precisa ser feito?" 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontFamily: 'inherit'}}
                required
              />
              <select 
                value={newTaskPriority} 
                onChange={e => setNewTaskPriority(e.target.value)}
                style={{padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc', width: '100%', fontFamily: 'inherit'}}
              >
                <option value="low">Prioridade: Baixa</option>
                <option value="medium">Prioridade: Normal</option>
                <option value="high">Prioridade: Urgente</option>
              </select>
              <button type="submit" className="btn-primary mt-2">Adicionar Tarefa</button>
            </form>
          </div>
        )}

        {tasks.map(task => (
          <div key={task.id} className="glass-card mb-4">
            <div className="flex justify-between items-start mb-3">
              <strong style={{fontSize: '1.05rem', lineHeight: '1.4'}}>{task.title}</strong>
              {task.priority === 'high' && <span className="badge badge-danger">Urgente</span>}
              {task.priority === 'medium' && <span className="badge badge-warning">Normal</span>}
              {task.priority === 'low' && <span className="badge badge-success">Baixa</span>}
            </div>

            {task.status === 'open' ? (
              <div className="mt-4">
                <p className="mb-3" style={{fontSize: '0.85rem'}}>Ninguém assumiu ainda.</p>
                <button 
                  className="btn-secondary" 
                  onClick={() => handleAssignTask(task.id)}
                >
                  Eu vou fazer isso
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 mt-4" style={{background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '12px'}}>
                <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="avatar" style={{width: '28px', height: '28px', borderColor: 'var(--primary-color)'}} />
                <span style={{fontSize: '0.85rem', color: 'var(--primary-color)', fontWeight: '600'}}>
                  {task.assignedTo.name} assumiu esta tarefa
                </span>
              </div>
            )}
          </div>
        ))}
      </main>
    </div>
  );
};

export default Tasks;
