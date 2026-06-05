import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { HeartPulse } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const isCheckoutSuccess = queryParams.get('checkout') === 'success';
  const inviteId = queryParams.get('invite');
  const isRegisteringState = location.pathname === '/register' || queryParams.get('checkout') === 'success';
  const [isRegistering, setIsRegistering] = useState(isRegisteringState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });
        
        let familyId = inviteId || null;
        let role = inviteId ? "Family Member" : "Admin";

        // Save initial user profile to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          role: role,
          familyId: familyId,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });

        if (window.fbq) {
          window.fbq('track', 'CompleteRegistration', {
            content_name: role
          });
        }

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/app');
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase:', '').trim());
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content flex flex-col justify-center items-center" style={{ minHeight: '100vh', background: 'var(--bg-color)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div className="flex flex-col items-center justify-center mb-6">
          <HeartPulse color="#2563eb" size={48} className="mb-2" />
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#0f172a', letterSpacing: '-0.5px' }}>
            KinCare
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            {isRegistering ? "Crie sua conta para começar" : "Bem-vindo(a) de volta"}
          </p>
        </div>

        {isCheckoutSuccess && (
          <div style={{ background: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
            🎉 Pagamento Aprovado! Crie sua conta abaixo para acessar o KinCare.
          </div>
        )}

        {inviteId && (
          <div style={{ background: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' }}>
            👋 Você foi convidado para uma família! Crie sua conta para acessar.
          </div>
        )}

        {error && (
          <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isRegistering && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Nome Completo</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                required={isRegistering}
                placeholder="Ex: João da Silva"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>E-mail</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
              required
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Senha</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '0.5rem', padding: '0.85rem', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? "Aguarde..." : (isRegistering ? "Criar Conta" : "Entrar")}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}
            onClick={() => {
              setIsRegistering(!isRegistering);
              setError('');
            }}
          >
            {isRegistering ? "Já tem uma conta? Entrar" : "Ainda não tem conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
