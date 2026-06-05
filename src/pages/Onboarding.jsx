import React, { useState, useContext } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';

function Onboarding() {
  const { createFamily, joinFamily, currentUser, deleteAccountAndFamily } = useContext(GlobalContext);
  const navigate = useNavigate();
  
  const [mode, setMode] = useState('choice'); // 'choice', 'create', 'join'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Create Form State
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [conditions, setConditions] = useState('');
  const [bloodType, setBloodType] = useState('Não sei');

  // Join Form State
  const [inviteCode, setInviteCode] = useState('');

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await createFamily({ name, age, conditions, bloodType });
      navigate('/app');
    } catch (err) {
      setError('Erro ao criar família. Tente novamente.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const success = await joinFamily(inviteCode);
      if (success) {
        navigate('/app');
      } else {
        setError('Código inválido ou não encontrado.');
      }
    } catch (err) {
      setError('Erro ao buscar código.');
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      const { auth } = await import('../firebase');
      await auth.signOut();
      navigate('/login');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="page-content flex flex-col justify-center items-center" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px', fontSize: '1.5rem', fontWeight: 'bold' }}>
          Bem-vindo(a), {currentUser?.name?.split(' ')[0]}!
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '30px', fontSize: '0.95rem' }}>
          Para continuar, precisamos configurar o perfil do idoso.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {mode === 'choice' && (
          <div className="flex flex-col gap-4">
            <button className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', borderRadius: '12px' }} onClick={() => setMode('create')}>
              Cadastrar Novo Idoso
            </button>
            <button className="btn-secondary" onClick={() => setMode('join')} style={{ padding: '1rem', fontSize: '1rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
              Já tenho um Código de Convite
            </button>
            
            <div className="flex flex-col items-center gap-3" style={{ marginTop: '2rem' }}>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.9rem', cursor: 'pointer' }}>
                Sair da conta
              </button>
              <button onClick={async () => {
                if (window.confirm("Certeza que deseja excluir sua conta para recomeçar os testes?")) {
                  await deleteAccountAndFamily();
                }
              }} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}>
                Excluir Conta de Teste
              </button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Nome do Idoso</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Maria Silva" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Idade</label>
              <input type="number" required value={age} onChange={e => setAge(e.target.value)} placeholder="Ex: 75" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Condições Principais</label>
              <input type="text" value={conditions} onChange={e => setConditions(e.target.value)} placeholder="Ex: Hipertensão, Diabetes" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Tipo Sanguíneo</label>
              <select value={bloodType} onChange={e => setBloodType(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', backgroundColor: 'white' }}>
                <option>Não sei</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
                <option>O+</option><option>O-</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.85rem', background: 'transparent', border: '1px solid #cbd5e1', color: 'var(--text-light)', borderRadius: '8px' }} onClick={() => setMode('choice')} disabled={loading}>Voltar</button>
              <button type="submit" className="btn-primary" style={{ flex: 2, padding: '0.85rem', borderRadius: '8px', fontWeight: 'bold' }} disabled={loading}>
                {loading ? 'Salvando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', textAlign: 'center' }}>
              Peça o código de 6 letras/números para o familiar que já cadastrou o idoso no aplicativo.
            </p>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Código de Convite</label>
              <input type="text" required value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Ex: A7B9X" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px dashed #cbd5e1', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '3px', textAlign: 'center', fontSize: '1.2rem', background: '#f8fafc' }} maxLength={6} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.85rem', background: 'transparent', border: '1px solid #cbd5e1', color: 'var(--text-light)', borderRadius: '8px' }} onClick={() => setMode('choice')} disabled={loading}>Voltar</button>
              <button type="submit" className="btn-primary" style={{ flex: 2, padding: '0.85rem', borderRadius: '8px', fontWeight: 'bold' }} disabled={loading || inviteCode.length < 5}>
                {loading ? 'Buscando...' : 'Entrar na Família'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Onboarding;
