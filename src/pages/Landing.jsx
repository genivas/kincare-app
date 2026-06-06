import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, ArrowRight, Shield, CheckCircle2, Calendar, Star, Users, Lock, CreditCard, PlayCircle } from 'lucide-react';
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

        /* VSL Layout Utilities */
        .vsl-container {
          max-width: 900px;
          margin: 0 auto;
          text-align: center;
        }
        
        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
          overflow: hidden;
          background: #000;
          border-radius: 12px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          margin: 2rem 0;
          border: 4px solid #1e293b;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .video-wrapper:hover .play-icon {
          transform: scale(1.1);
        }

        .play-icon {
          color: white;
          transition: transform 0.2s;
        }

        .vsl-headline {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900;
          color: #0f172a;
          line-height: 1.1;
          letter-spacing: -1.5px;
        }
        
        .vsl-subheadline {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: #475569;
          margin-top: 1rem;
          font-weight: 500;
        }

        .buy-button {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 1.5rem 3rem;
          font-size: 1.25rem;
          font-weight: 800;
          border-radius: 100px;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
          width: 100%;
          max-width: 400px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
          70% { box-shadow: 0 0 0 15px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        .buy-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(16, 185, 129, 0.5);
        }

        @media (max-width: 900px) {
          .buy-button {
            width: 100%;
            padding: 1.25rem;
            font-size: 1.1rem;
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

      <main style={{paddingTop: '80px', paddingBottom: '6rem'}}>
        
        {/* VSL Section */}
        <section className="section-container" style={{paddingTop: '2rem', paddingBottom: '3rem'}}>
          <div className="vsl-container">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 mb-6 rounded-full" style={{background: '#fef2f2', color: '#dc2626', fontWeight: '700', fontSize: '0.9rem', border: '1px solid #fecaca'}}>
              <HeartPulse size={16} /> Attention: Family Caregivers
            </div>
            
            <h1 className="vsl-headline">
              <span style={{color: '#dc2626'}}>Stop The WhatsApp Chaos.</span><br/>
              Know Exactly Who Handled Mom’s Medication.
            </h1>
            
            <p className="vsl-subheadline">
              Make sure your loved ones are safe with a single source of truth for the entire family. <b>Watch the short video below to see how.</b>
            </p>
            
            {/* VSL Video Player */}
            <div className="video-wrapper">
              <video 
                src="/vsl-video.mp4" 
                controls 
                playsInline
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div style={{marginTop: '2rem'}}>
              <button 
                onClick={() => handleCheckout('https://pay.hotmart.com/O106115546S?off=agpe42pl')}
                className="buy-button" 
              >
                START 14-DAY FREE TRIAL - $9.99/mo <ArrowRight size={24} />
              </button>
              
              <div className="flex justify-center items-center gap-6 text-sm font-semibold mt-4" style={{color: '#64748b'}}>
                <div className="flex items-center gap-1"><Shield size={16} color="#10b981"/> 14-Day Free Trial</div>
                <div className="flex items-center gap-1"><Lock size={16} color="#10b981"/> 100% Secure Checkout</div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section (Simplified Offer) */}
        <section style={{background: '#0f172a', color: 'white', padding: '4rem 1.5rem', borderRadius: '32px', maxWidth: '1000px', margin: '0 auto'}}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 style={{fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px'}}>
              Everything you need for total peace of mind.
            </h2>
            <p style={{color: '#94a3b8', fontSize: '1.1rem'}}>Try it free for 14 days. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
             <ul className="flex flex-col gap-4" style={{fontSize: '1.1rem'}}>
                <li className="flex items-start gap-3"><CheckCircle2 size={24} color="#10b981" className="shrink-0 mt-1"/> <div><b>Shared Medication Log:</b> Know exactly what was taken and when.</div></li>
                <li className="flex items-start gap-3"><CheckCircle2 size={24} color="#10b981" className="shrink-0 mt-1"/> <div><b>Real-Time Sync:</b> Everyone in the family sees updates instantly.</div></li>
             </ul>
             <ul className="flex flex-col gap-4" style={{fontSize: '1.1rem'}}>
                <li className="flex items-start gap-3"><CheckCircle2 size={24} color="#10b981" className="shrink-0 mt-1"/> <div><b>Family Care Schedule:</b> Assign shifts so no one is overwhelmed.</div></li>
                <li className="flex items-start gap-3"><CheckCircle2 size={24} color="#10b981" className="shrink-0 mt-1"/> <div><b>Task Management:</b> Organize doctor visits, groceries, and pharmacy runs.</div></li>
             </ul>
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
