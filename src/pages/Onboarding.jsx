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
    <div className="login-page">
      <div className="login-card" style={{ maxWidth: '400px', width: '90%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '10px' }}>Bem-vindo(a), {currentUser?.name?.split(' ')[0]}!</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '30px' }}>
          Para continuar, precisamos configurar o perfil do idoso.
        </p>

        {error && <div className="error-message" style={{ color: 'var(--danger-color)', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        {mode === 'choice' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <button className="primary-button" onClick={() => setMode('create')}>
              Cadastrar Novo Idoso
            </button>
            <button className="secondary-button" onClick={() => setMode('join')} style={{ backgroundColor: 'transparent', color: 'var(--primary-color)', border: '1px solid var(--primary-color)' }}>
              Já tenho um Código de Convite
            </button>
            <button onClick={handleLogout} style={{ marginTop: '20px', background: 'none', border: 'none', color: 'var(--text-secondary)', textDecoration: 'underline', cursor: 'pointer' }}>
              Sair da conta
            </button>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreate}>
            <div className="input-group">
              <label>Nome do Idoso</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Maria Silva" />
            </div>
            <div className="input-group">
              <label>Idade</label>
              <input type="number" required value={age} onChange={e => setAge(e.target.value)} placeholder="Ex: 75" />
            </div>
            <div className="input-group">
              <label>Condições Principais</label>
              <input type="text" value={conditions} onChange={e => setConditions(e.target.value)} placeholder="Ex: Hipertensão, Diabetes" />
            </div>
            <div className="input-group">
              <label>Tipo Sanguíneo</label>
              <select value={bloodType} onChange={e => setBloodType(e.target.value)}>
                <option>Não sei</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
                <option>O+</option><option>O-</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="secondary-button" onClick={() => setMode('choice')} disabled={loading}>Voltar</button>
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Salvando...' : 'Cadastrar'}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
              Peça o código de 6 letras/números para o familiar que já cadastrou o idoso no aplicativo.
            </p>
            <div className="input-group">
              <label>Código de Convite</label>
              <input type="text" required value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="Ex: A7B9X" style={{ textTransform: 'uppercase', letterSpacing: '2px', textAlign: 'center', fontSize: '1.2rem' }} maxLength={6} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="secondary-button" onClick={() => setMode('choice')} disabled={loading}>Voltar</button>
              <button type="submit" className="primary-button" disabled={loading || inviteCode.length < 5}>
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
