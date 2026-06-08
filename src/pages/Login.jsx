import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { HeartPulse } from 'lucide-react';
import { GlobalContext } from '../context/GlobalContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(GlobalContext);

  const queryParams = new URLSearchParams(location.search);
  const isCheckoutSuccess = queryParams.get('checkout') === 'success';
  const inviteId = queryParams.get('invite');
  const isRegisteringState = location.pathname === '/register' || queryParams.get('checkout') === 'success';
  const [isRegistering, setIsRegistering] = useState(isRegisteringState);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (currentUser) {
      navigate('/app');
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        if (!inviteId && accessCode.trim().toUpperCase() !== 'KINCARE-VIP-26') {
          throw new Error('Invalid VIP Access Code. Please check the email you received after purchase.');
        }

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

      } else if (isResetting) {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset email sent! Please check your inbox.");
        setIsResetting(false);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Do not navigate manually here; wait for currentUser to populate from context
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase:', '').trim());
      setLoading(false); // Only unset loading if there's an error, otherwise let it navigate
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
            {isRegistering ? "Create your account to start" : "Welcome back"}
          </p>
        </div>

        {isCheckoutSuccess && (
          <div style={{ background: '#10b981', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>
            🎉 Payment Approved! Create your account below to access KinCare.
          </div>
        )}

        {inviteId && (
          <div style={{ background: '#3b82f6', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', fontSize: '0.95rem', fontWeight: '600', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.2)' }}>
            👋 You've been invited to a family! Create your account to access.
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
                placeholder="e.g. John Doe"
              />
            </div>
          )}

          {isRegistering && !inviteId && (
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>VIP Access Code</label>
              <input 
                type="text" 
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit', textTransform: 'uppercase' }}
                required={isRegistering && !inviteId}
                placeholder="KINCARE-VIP-26"
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
              required
              placeholder="you@email.com"
            />
          </div>

          {!isResetting && (
            <div>
              <div className="flex justify-between items-center mb-2">
                <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
                {!isRegistering && (
                  <button 
                    type="button" 
                    onClick={() => { setIsResetting(true); setError(''); }}
                    style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.8rem', cursor: 'pointer', padding: 0 }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                required={!isResetting}
                placeholder="••••••••"
              />
            </div>
          )}

          <button 
            type="submit" 
            className="btn-primary" 
            style={{ marginTop: '0.5rem', padding: '0.85rem', fontWeight: 'bold' }}
            disabled={loading}
          >
            {loading ? "Please wait..." : (isResetting ? "Send Reset Email" : (isRegistering ? "Create Account" : "Sign In"))}
          </button>
        </form>

        <div className="text-center mt-6">
          <button 
            type="button"
            style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: '500', cursor: 'pointer' }}
            onClick={() => {
              if (isResetting) {
                setIsResetting(false);
              } else {
                setIsRegistering(!isRegistering);
              }
              setError('');
            }}
          >
            {isResetting ? "Back to Login" : (isRegistering ? "Already have an account? Sign In" : "Don't have an account? Sign Up")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
