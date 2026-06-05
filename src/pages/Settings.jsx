import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { UserPlus, X, ShieldCheck, CreditCard, LifeBuoy, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

const Settings = () => {
  const { patient, setPatient, family, setFamily, currentUser, deleteAccountAndFamily } = useContext(GlobalContext);
  const [name, setName] = useState(patient.name);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Family');
  const navigate = useNavigate();

  const handleSave = () => {
    setPatient({ ...patient, name });
    alert('Saved successfully!');
  };

  const handleInviteWhatsApp = (e) => {
    e.preventDefault();
    if(newMemberName && newMemberRelation) {
      const patientName = patient?.name ? patient.name.split(' ')[0] : 'nosso familiar';
      const msg = `Olá ${newMemberName}! Estou te convidando para o aplicativo *KinCare* para ajudar a cuidar de ${patientName}.\n\nPara acessar a rotina e os medicamentos, siga os passos:\n1. Acesse: https://kincare-app.pages.dev\n2. Clique em "Acessar App" e cadastre-se.\n3. Na tela de Boas-vindas, escolha "Já tenho um Código de Convite".\n4. Insira este código de segurança: *${patient?.inviteCode}*\n\nPronto! Já estamos conectados.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
      setShowAddForm(false);
      setNewMemberName('');
      setNewMemberRelation('');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("ATENÇÃO: Você tem certeza que deseja excluir sua conta e apagar todos os dados da sua Família permanentemente? Esta ação não pode ser desfeita.")) {
      try {
        await deleteAccountAndFamily();
        navigate('/');
      } catch(e) {
        alert("Erro ao excluir conta. Faça login novamente para tentar.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="page-content" style={{paddingBottom: '80px', paddingTop: '3rem'}}>
      <header className="px-4 mb-6 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700', margin: 0}}>Configurações</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>Gerenciar conta e família</p>
        </div>
      </header>

      <main className="px-4">
        
        {/* Support & Billing Quick Actions */}
        <div className="flex gap-3 mb-6">
          <button 
            className="glass-card flex-1 flex flex-col items-center justify-center p-4" 
            style={{border: 'none', background: 'white', color: 'var(--text-color)', marginBottom: 0}}
            onClick={() => navigate('/app/support')}
          >
            <LifeBuoy size={28} color="var(--primary-color)" className="mb-2" />
            <span style={{fontSize: '0.9rem', fontWeight: '600'}}>Suporte</span>
          </button>
          
          <button 
            className="glass-card flex-1 flex flex-col items-center justify-center p-4" 
            style={{border: 'none', background: 'white', color: 'var(--text-color)', marginBottom: 0}}
            onClick={() => window.open('https://hotmart.com/pt-br/help', '_blank')}
          >
            <CreditCard size={28} color="#10b981" className="mb-2" />
            <span style={{fontSize: '0.9rem', fontWeight: '600'}}>Assinatura</span>
          </button>
        </div>

        <div className="glass-card mb-6">
          <h3 className="mb-4" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><ShieldCheck size={20} color="var(--primary-color)" /> Perfil do Idoso</h3>
          <div className="flex-col gap-3">
            <div className="flex items-center gap-4 mb-4">
              <img src={patient?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient?.name || 'Idoso'}`} alt="Avatar" className="avatar avatar-lg" style={{width: '60px', height: '60px', borderRadius: '20px'}} />
              <button className="btn-secondary" style={{padding: '0.5rem 1rem', width: 'auto'}}>Mudar Foto</button>
            </div>
            <label style={{fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem'}}>Nome Completo</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', marginBottom: '1rem', fontFamily: 'inherit', background: '#f8fafc'}}
            />
            <button className="btn-primary" onClick={handleSave} style={{padding: '0.85rem', borderRadius: '10px'}}>Salvar Alterações</button>
          </div>
        </div>

        {showAddForm && (
          <div className="glass-card mb-6" style={{border: '1px solid var(--primary-color)'}}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{margin: 0}}>Código de Convite</h3>
              <button style={{background: 'transparent', padding: 0, border: 'none'}} onClick={() => setShowAddForm(false)}>
                <X size={20} color="var(--text-light)"/>
              </button>
            </div>
            <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center', marginBottom: '1rem'}}>
              <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem'}}>Compartilhe este código com os cuidadores:</p>
              <h2 style={{letterSpacing: '3px', color: 'var(--primary-color)'}}>{patient?.inviteCode || '...'}</h2>
            </div>
            <form onSubmit={handleInviteWhatsApp} className="flex-col gap-3 flex">
              <input 
                type="text" 
                placeholder="Nome da pessoa" 
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit'}}
                required
              />
              <input 
                type="text" 
                placeholder="Parentesco (ex: Filho, Cuidadora)" 
                value={newMemberRelation}
                onChange={e => setNewMemberRelation(e.target.value)}
                style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit'}}
                required
              />
              <select 
                value={newMemberRole} 
                onChange={e => setNewMemberRole(e.target.value)}
                style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit', backgroundColor: 'white'}}
              >
                <option value="Family">Membro da Família (Acesso Total)</option>
                <option value="Professional Caregiver">Cuidador(a) Profissional</option>
                <option value="Nurse">Enfermeiro(a)</option>
              </select>
              <button type="submit" className="btn-primary mt-2 flex justify-center items-center gap-2" style={{padding: '0.85rem', borderRadius: '10px', background: '#25d366', borderColor: '#25d366'}}>
                Enviar Convite por WhatsApp
              </button>
            </form>
          </div>
        )}

        <div className="glass-card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{margin: 0}}>Membros da Família</h3>
            {!showAddForm && (
              <button style={{background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.5rem', borderRadius: '8px', border: 'none'}} onClick={() => setShowAddForm(true)}>
                <UserPlus size={18} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            {family.map((f, i) => (
              <div key={f.id} className="flex items-center justify-between" style={{borderBottom: i !== family.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: i !== family.length - 1 ? '1rem' : '0'}}>
                <div className="flex items-center gap-3">
                  <img src={f.avatar} alt={f.name} className="avatar" style={{width: '40px', height: '40px', borderRadius: '12px'}} />
                  <div>
                    <strong style={{display: 'block', fontSize: '0.95rem'}}>{f.name}</strong>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>
                      {f.relation} &bull; {f.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="glass-card flex items-center justify-center gap-2" 
          style={{width: '100%', border: '1px solid #fee2e2', color: '#ef4444', background: '#fef2f2', padding: '1rem'}}
        >
          <LogOut size={20} />
          <strong style={{fontSize: '1rem'}}>Sair da conta</strong>
        </button>

        <button 
          onClick={handleDeleteAccount}
          className="glass-card flex items-center justify-center gap-2 mt-4" 
          style={{width: '100%', border: '1px solid #dc2626', color: '#dc2626', background: 'transparent', padding: '1rem'}}
        >
          <strong style={{fontSize: '1rem'}}>Excluir Conta e Família</strong>
        </button>

      </main>
    </div>
  );
};

export default Settings;
