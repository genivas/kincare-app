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
      setError('Error creating family. Please try again.');
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
        setError('Invalid or not found code.');
      }
    } catch (err) {
      setError('Error joining family.');
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
          Welcome, {currentUser?.name?.split(' ')[0]}!
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-light)', marginBottom: '30px', fontSize: '0.95rem' }}>
          To continue, we need to set up the patient's profile.
        </p>

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        {mode === 'choice' && (
          <div className="flex flex-col gap-4">
            <button className="btn-primary" style={{ padding: '1rem', fontSize: '1rem', borderRadius: '12px' }} onClick={() => setMode('create')}>
              Register New Patient
            </button>
            <button className="btn-secondary" onClick={() => setMode('join')} style={{ padding: '1rem', fontSize: '1rem', borderRadius: '12px', background: 'transparent', border: '1px solid var(--primary-color)', color: 'var(--primary-color)' }}>
              I already have an Invite Code
            </button>
            
            <div className="flex flex-col items-center gap-3" style={{ marginTop: '2rem' }}>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-light)', fontSize: '0.9rem', cursor: 'pointer' }}>
                Sign Out
              </button>
              <button onClick={async () => {
                if (window.confirm("Are you sure you want to delete your account to restart tests?")) {
                  await deleteAccountAndFamily();
                }
              }} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.8rem', cursor: 'pointer' }}>
                Delete Test Account
              </button>
            </div>
          </div>
        )}

        {mode === 'create' && (
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Patient Name</label>
              <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Mary Smith" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Age</label>
              <input type="number" required value={age} onChange={e => setAge(e.target.value)} placeholder="e.g. 75" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Main Conditions</label>
              <input type="text" value={conditions} onChange={e => setConditions(e.target.value)} placeholder="e.g. Hypertension, Diabetes" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Blood Type</label>
              <select value={bloodType} onChange={e => setBloodType(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', backgroundColor: 'white' }}>
                <option>I don't know</option>
                <option>A+</option><option>A-</option>
                <option>B+</option><option>B-</option>
                <option>AB+</option><option>AB-</option>
                <option>O+</option><option>O-</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.85rem', background: 'transparent', border: '1px solid #cbd5e1', color: 'var(--text-light)', borderRadius: '8px' }} onClick={() => setMode('choice')} disabled={loading}>Back</button>
              <button type="submit" className="btn-primary" style={{ flex: 2, padding: '0.85rem', borderRadius: '8px', fontWeight: 'bold' }} disabled={loading}>
                {loading ? 'Saving...' : 'Register'}
              </button>
            </div>
          </form>
        )}

        {mode === 'join' && (
          <form onSubmit={handleJoin} className="flex flex-col gap-4">
            <p style={{ fontSize: '0.9rem', color: 'var(--text-light)', marginBottom: '0.5rem', textAlign: 'center' }}>
              Ask the family member who registered the patient for the 6-letter/number code.
            </p>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Invite Code</label>
              <input type="text" required value={inviteCode} onChange={e => setInviteCode(e.target.value)} placeholder="e.g. A7B9X" style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '2px dashed #cbd5e1', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '3px', textAlign: 'center', fontSize: '1.2rem', background: '#f8fafc' }} maxLength={6} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
              <button type="button" className="btn-secondary" style={{ flex: 1, padding: '0.85rem', background: 'transparent', border: '1px solid #cbd5e1', color: 'var(--text-light)', borderRadius: '8px' }} onClick={() => setMode('choice')} disabled={loading}>Back</button>
              <button type="submit" className="btn-primary" style={{ flex: 2, padding: '0.85rem', borderRadius: '8px', fontWeight: 'bold' }} disabled={loading || inviteCode.length < 5}>
                {loading ? 'Searching...' : 'Join Family'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default Onboarding;
