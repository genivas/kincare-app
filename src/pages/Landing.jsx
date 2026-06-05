import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, ArrowRight, Shield, CheckCircle2, Calendar, Star, Users, Lock, CreditCard } from 'lucide-react';
import appMockup from '../assets/app_mockup.png';

const Landing = () => {
  const navigate = useNavigate();

  const handleCheckout = (url) => {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout');
    }
    window.location.href = url;
  };

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', overflowX: 'hidden', fontFamily: "'Inter', sans-serif"}}>
      <style>{`
        /* Minimalist & Responsive Utilities */
        .glass-nav {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
        }
        
        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 5rem 1.5rem;
        }

        /* 50/50 Split for Desktop Hero */
        .hero-split {
          display: flex;
          align-items: center;
          gap: 4rem;
          min-height: 80vh;
        }
        
        .hero-text-content {
          flex: 1;
          padding-right: 2rem;
        }

        .hero-image-content {
          flex: 1;
          position: relative;
        }

        .hero-image {
          width: 100%;
          border-radius: 24px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          object-fit: cover;
        }

        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-top: 4rem;
        }

        @media (max-width: 900px) {
          .hero-split {
            flex-direction: column;
            text-align: center;
            padding-top: 6rem;
          }
          .hero-text-content {
            padding-right: 0;
          }
          .hero-title {
            font-size: 2.5rem !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr;
          }
          .cta-button {
            margin: 0 auto;
          }
        }
      `}</style>

      {/* Navigation Bar */}
      <nav className="glass-nav flex justify-between items-center px-6 py-4" style={{position: 'fixed', top: 0, width: '100%', zIndex: 50}}>
        <div className="flex items-center gap-2">
          <HeartPulse color="#0891b2" size={28} />
          <span style={{fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px'}}>
            <span style={{color: '#0891b2'}}>Kin</span><span style={{color: '#0f172a'}}>Care</span>
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => navigate('/login')}
            style={{background: 'transparent', border: 'none', color: '#475569', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer'}}
          >
            Sign in
          </button>
          <button 
            onClick={() => navigate('/login')}
            style={{background: '#2563eb', border: 'none', color: '#ffffff', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer', padding: '0.5rem 1.25rem', borderRadius: '100px'}}
          >
            Create free care plan
          </button>
        </div>
      </nav>

      <main style={{paddingTop: '60px'}}>
        
        {/* HOOK: Hero Section (Consciente do Problema) */}
        <section className="section-container" style={{paddingTop: '2rem', paddingBottom: '3rem'}}>
          <div className="hero-split">
            <div className="hero-text-content">
              <div className="inline-flex items-center justify-center gap-2 px-4 py-2 mb-6 rounded-full" style={{background: '#fef2f2', color: '#dc2626', fontWeight: '600', fontSize: '0.85rem'}}>
                <HeartPulse size={16} /> Stop the WhatsApp chaos
              </div>
              
              <h1 className="hero-title" style={{fontSize: '4.5rem', fontWeight: '800', color: '#0f172a', lineHeight: '1.1', letterSpacing: '-1.5px', marginBottom: '1.5rem'}}>
                Know exactly who handled mom’s medication.
              </h1>
              
              <p style={{fontSize: '1.25rem', color: '#475569', lineHeight: '1.6', marginBottom: '2.5rem'}}>
                A shared medication schedule, clear alerts, and a simple log for the whole family.
              </p>
              
              <button 
                onClick={() => navigate('/login')}
                className="cta-button flex items-center justify-center gap-2" 
                style={{background: '#2563eb', color: 'white', border: 'none', padding: '1.25rem 2.5rem', fontSize: '1.1rem', fontWeight: '600', borderRadius: '100px', boxShadow: '0 10px 25px rgba(37, 99, 235, 0.3)', width: '100%', maxWidth: '320px', cursor: 'pointer', transition: 'transform 0.2s'}}
              >
                Create free care plan <ArrowRight size={20} />
              </button>
              
              <div className="flex items-center gap-2 mt-4" style={{fontSize: '0.85rem', color: '#64748b'}}>
                <Shield size={16} color="#10b981"/> <span>Private by design. Cancel anytime.</span>
              </div>
            </div>

            <div className="hero-image-content flex justify-center">
              <img 
                src={appMockup} 
                alt="KinCare App Interface" 
                className="hero-image"
                style={{maxWidth: '350px', border: '8px solid #0f172a', borderRadius: '32px'}}
              />
            </div>
          </div>
        </section>

        {/* STORY: Conexão e Validação da Dor */}
        <section style={{background: '#ffffff', padding: '6rem 1.5rem'}}>
          <div className="max-w-3xl mx-auto text-center">
            <h2 style={{fontSize: 'clamp(2rem, 4vw, 2.5rem)', fontWeight: '800', color: '#0f172a', lineHeight: '1.2', marginBottom: '2rem', letterSpacing: '-1px'}}>
              "We tried organizing on WhatsApp dozens of times..."
            </h2>
            <p style={{fontSize: '1.2rem', color: '#475569', lineHeight: '1.7', marginBottom: '2rem'}}>
              Messages got lost. One day, mom took her blood pressure medication twice because my brother didn't see my text. We realized a simple mistake could lead to a hospital visit. That's when we created KinCare: a single, shared source of truth for the whole family.
            </p>
            <div className="flex justify-center items-center gap-4">
              <div style={{background: '#eff6ff', color: '#2563eb', padding: '1rem 1.5rem', borderRadius: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                <CheckCircle2 size={20}/> A clear shared log for every dose.
              </div>
            </div>
          </div>
        </section>

        {/* OFFER: Pricing Tiers */}
        <section style={{background: '#0f172a', color: 'white', padding: '6rem 1.5rem'}}>
          <div className="section-container" style={{padding: '0'}}>
            <div className="text-center max-w-2xl mx-auto">
              <h2 style={{fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px'}}>
                Choose peace of mind.
              </h2>
              <p style={{color: '#94a3b8', fontSize: '1.2rem', marginBottom: '2rem'}}>
                Stop paying the emotional toll of disorganized caregiving.
              </p>
              <div className="flex justify-center items-center gap-4 text-sm font-semibold" style={{color: '#10b981'}}>
                <div className="flex items-center gap-1"><Lock size={16}/> 100% Secure Checkout</div>
                <div className="flex items-center gap-1"><CreditCard size={16}/> All major cards accepted</div>
              </div>
            </div>

            <div className="pricing-grid">
              {/* Basic Tier */}
              <div style={{background: '#1e293b', borderRadius: '24px', padding: '2.5rem', border: '1px solid #334155'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem'}}>Basic</h3>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', minHeight: '40px'}}>Perfect to try it out.</p>
                <div style={{marginBottom: '2rem'}}>
                  <span style={{fontSize: '3rem', fontWeight: '800'}}>$0</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8" style={{color: '#cbd5e1'}}>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#94a3b8"/> 1 Patient</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#94a3b8"/> 1 Caregiver</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#94a3b8"/> Basic Medication Logging</li>
                </ul>
                <button onClick={() => navigate('/login')} style={{width: '100%', padding: '1rem', borderRadius: '100px', background: 'transparent', border: '2px solid #475569', color: 'white', fontWeight: '600', cursor: 'pointer'}}>Get Started</button>
              </div>

              {/* Essential Tier */}
              <div style={{background: '#2563eb', borderRadius: '24px', padding: '2.5rem', position: 'relative', transform: 'scale(1.05)', boxShadow: '0 25px 50px -12px rgba(37,99,235,0.5)'}}>
                <div style={{position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: '#f59e0b', color: 'white', padding: '0.25rem 1rem', borderRadius: '100px', fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase'}}>Most Popular</div>
                <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem'}}>Family</h3>
                <p style={{color: '#bfdbfe', fontSize: '0.9rem', marginBottom: '2rem', minHeight: '40px'}}>For the united family.</p>
                <div style={{marginBottom: '2rem'}}>
                  <span style={{fontSize: '3rem', fontWeight: '800'}}>$9.99</span><span style={{color: '#bfdbfe'}}>/mo</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8" style={{color: '#ffffff'}}>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#60a5fa"/> 1 Patient</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#60a5fa"/> Up to 4 Family Members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#60a5fa"/> Real-time Alerts</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#60a5fa"/> Complete History Log</li>
                </ul>
                <button onClick={() => handleCheckout('https://pay.hotmart.com/O106115546S?off=agpe42pl')} style={{width: '100%', padding: '1rem', borderRadius: '100px', background: 'white', border: 'none', color: '#2563eb', fontWeight: '700', cursor: 'pointer'}}>Start 14-Day Free Trial</button>
              </div>

              {/* Pro Tier */}
              <div style={{background: '#1e293b', borderRadius: '24px', padding: '2.5rem', border: '1px solid #334155'}}>
                <h3 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem'}}>Pro</h3>
                <p style={{color: '#94a3b8', fontSize: '0.9rem', marginBottom: '2rem', minHeight: '40px'}}>For professional caregivers or large families.</p>
                <div style={{marginBottom: '2rem'}}>
                  <span style={{fontSize: '3rem', fontWeight: '800'}}>$19.99</span><span style={{color: '#64748b'}}>/mo</span>
                </div>
                <ul className="flex flex-col gap-3 mb-8" style={{color: '#cbd5e1'}}>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#94a3b8"/> Unlimited Patients</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#94a3b8"/> Unlimited Members</li>
                  <li className="flex items-center gap-2"><CheckCircle2 size={18} color="#94a3b8"/> Export PDF for Doctors</li>
                </ul>
                <button onClick={() => handleCheckout('https://pay.hotmart.com/O106115546S?off=6bl5f0mn')} style={{width: '100%', padding: '1rem', borderRadius: '100px', background: '#334155', border: 'none', color: 'white', fontWeight: '600', cursor: 'pointer'}}>Start 14-Day Free Trial</button>
              </div>
            </div>
          </div>
        </section>

      </main>
      
      {/* Footer */}
      <footer className="px-6 py-10" style={{background: '#020617', color: '#64748b', textAlign: 'center'}}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <HeartPulse color="#0891b2" size={24} />
          <span style={{fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px'}}>
            <span style={{color: '#0891b2'}}>Kin</span><span style={{color: '#f8fafc'}}>Care</span>
          </span>
        </div>
        <p style={{fontSize: '0.9rem', marginBottom: '1.5rem'}}>&copy; 2026 KinCare Tech. Built for real families.</p>
        <div className="flex justify-center gap-6" style={{fontSize: '0.9rem', fontWeight: '500'}}>
          <a href="/login" style={{color: '#94a3b8', textDecoration: 'none'}}>Terms of Service</a>
          <a href="/login" style={{color: '#94a3b8', textDecoration: 'none'}}>Privacy Policy</a>
          <a href="/login" style={{color: '#94a3b8', textDecoration: 'none'}}>Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
