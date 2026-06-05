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
  const canRegister = isCheckoutSuccess || !!inviteId;

  const [isRegistering, setIsRegistering] = useState(canRegister);
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
        if (!canRegister) {
          throw new Error("Registration requires a valid purchase or invitation link.");
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });
        
        let familyId = userCredential.user.uid;
        let role = "Admin";
        
        if (inviteId) {
          familyId = inviteId;
          role = "Family Member";
        }

        // Save initial user profile to Firestore
        await setDoc(doc(db, "users", userCredential.user.uid), {
          name: name,
          email: email,
          role: role,
          familyId: familyId,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`
        });

        // Fire Meta Pixel CompleteRegistration event
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
            {isRegistering ? "Create your family account" : "Welcome back to your family"}
          </p>
        </div>

        {isCheckoutSuccess && (
          <div style={{ background: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
            🎉 Payment Approved! Create your account below to activate your KinCare subscription.
          </div>
        )}

        {inviteId && (
          <div style={{ background: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' }}>
            👋 You've been invited to join a family! Create your account below to access their schedule.
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
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                required={isRegistering}
                placeholder="E.g., John Doe"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
              required
              placeholder="you@family.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
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
            {loading ? "Please wait..." : (isRegistering ? "Create Account" : "Sign In")}
          </button>
        </form>

        <div className="text-center mt-6">
          {canRegister ? (
             <button 
               style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '500' }}
               onClick={() => {
                 setIsRegistering(!isRegistering);
                 setError('');
               }}
             >
               {isRegistering ? "Already have an account? Sign in" : "Need an account? Sign up"}
             </button>
          ) : (
            <p style={{fontSize: '0.85rem', color: 'var(--text-light)'}}>Registration requires a purchase or invite.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
