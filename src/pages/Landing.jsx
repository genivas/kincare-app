import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, ArrowRight, Shield, CheckCircle2, Star, Lock, PlayCircle, Clock, Plus, Minus } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();
  const [showSticky, setShowSticky] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA after scrolling past the hero section (approx 600px)
      if (window.scrollY > 600) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCheckout = (url) => {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout');
    }
    window.location.href = url;
  };

  const faqs = [
    {
      q: "Does my elderly parent need to use the app?",
      a: "No! KinCare is designed for you and your family members (the caregivers). Your parents don't need to do anything or own a smartphone. You use it to coordinate their care among yourselves."
    },
    {
      q: "Do I have to pay for each family member?",
      a: "Absolutely not. One $9.99/mo subscription covers your entire family. You can invite your siblings, a hired nurse, or anyone else for free."
    },
    {
      q: "Is it easy to cancel?",
      a: "Yes. You can cancel your subscription anytime with just one click inside your account settings. No phone calls or emails required."
    },
    {
      q: "What if I accidentally log the wrong medication?",
      a: "You have a full history log where you can easily delete or edit past entries. Everyone in the family gets instantly updated when a change is made."
    }
  ];

  return (
    <div style={{minHeight: '100vh', background: '#f8fafc', overflowX: 'hidden', fontFamily: "'Nunito', sans-serif"}}>
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

        /* Sticky CTA */
        .sticky-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(255,255,255,0.98);
          padding: 1rem;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
          z-index: 100;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          justify-content: center;
          align-items: center;
          border-top: 1px solid #e2e8f0;
        }
        .sticky-cta.visible {
          transform: translateY(0);
        }

        /* Guarantee Box */
        .guarantee-box {
          background: #ecfdf5;
          border: 2px dashed #34d399;
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          max-width: 800px;
          margin: 4rem auto;
        }

        /* FAQ */
        .faq-item {
          background: white;
          border-radius: 16px;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .faq-question {
          padding: 1.5rem;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #0f172a;
        }
        .faq-answer {
          padding: 0 1.5rem 1.5rem 1.5rem;
          color: #475569;
          line-height: 1.6;
        }

        @media (max-width: 900px) {
          .buy-button {
            width: 100%;
            padding: 1.25rem;
            font-size: 1.1rem;
          }
          .sticky-cta .buy-button {
            padding: 1rem;
            font-size: 1rem;
          }
        }
      `}</style>

      {/* Urgency Banner */}
      <div style={{background: '#dc2626', color: 'white', textAlign: 'center', padding: '0.75rem', fontSize: '0.9rem', fontWeight: '700', position: 'fixed', top: 0, width: '100%', zIndex: 60, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem'}}>
        <Clock size={16} /> SPECIAL LAUNCH OFFER: Claim Your 14-Day Free Trial Today!
      </div>

      {/* Navigation Bar */}
      <nav className="glass-nav flex justify-between items-center px-6 py-4" style={{position: 'fixed', top: '40px', width: '100%', zIndex: 50}}>
        <div className="flex items-center gap-2">
          <HeartPulse color="#0d9488" size={28} />
          <span style={{fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.5px'}}>
            <span style={{color: '#0d9488'}}>Kin</span><span style={{color: '#0f172a'}}>Care</span>
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => navigate('/login')}
            style={{background: 'transparent', border: 'none', color: '#475569', fontWeight: '600', fontSize: '0.95rem', cursor: 'pointer'}}
          >
            Sign in
          </button>
        </div>
      </nav>

      <main style={{paddingTop: '120px', paddingBottom: '6rem'}}>
        
        {/* VSL Hero Section */}
        <section className="section-container" style={{paddingTop: '2rem', paddingBottom: '3rem'}}>
          <div className="vsl-container">
            <div className="inline-flex items-center justify-center gap-2 px-4 py-2 mb-6 rounded-full" style={{background: '#fef2f2', color: '#dc2626', fontWeight: '800', fontSize: '0.9rem', border: '1px solid #fecaca'}}>
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

        {/* Social Proof / Testimonials */}
        <section style={{background: '#ffffff', padding: '5rem 1.5rem'}}>
          <div className="max-w-4xl mx-auto">
            <h2 style={{textAlign: 'center', fontSize: '2.2rem', fontWeight: '800', marginBottom: '3rem', color: '#0f172a'}}>
              Families Sleep Better With KinCare.
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div style={{background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0'}}>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{fontSize: '1.1rem', color: '#334155', fontStyle: 'italic', marginBottom: '1.5rem'}}>
                  "My brother and I almost gave my dad a double dose of insulin because a WhatsApp message got lost in the chat. KinCare literally saved us from a hospital visit."
                </p>
                <div className="flex items-center gap-3">
                  <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden'}}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah" alt="User" />
                  </div>
                  <div>
                    <strong style={{display: 'block', color: '#0f172a'}}>Sarah T.</strong>
                    <span style={{fontSize: '0.85rem', color: '#64748b'}}>Cares for her father</span>
                  </div>
                </div>
              </div>

              <div style={{background: '#f8fafc', padding: '2rem', borderRadius: '24px', border: '1px solid #e2e8f0'}}>
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{fontSize: '1.1rem', color: '#334155', fontStyle: 'italic', marginBottom: '1.5rem'}}>
                  "Finally, no more waking up at 2 AM wondering if mom took her heart pills. I just open the app and see the green checkmark. Total peace of mind."
                </p>
                <div className="flex items-center gap-3">
                  <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden'}}>
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Michael" alt="User" />
                  </div>
                  <div>
                    <strong style={{display: 'block', color: '#0f172a'}}>Michael R.</strong>
                    <span style={{fontSize: '0.85rem', color: '#64748b'}}>Cares for his mother</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section style={{background: '#0f172a', color: 'white', padding: '5rem 1.5rem', margin: '2rem auto', maxWidth: '1000px', borderRadius: '32px'}}>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 style={{fontSize: '2rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-1px'}}>
              Everything you need for total peace of mind.
            </h2>
            <p style={{color: '#94a3b8', fontSize: '1.1rem'}}>Stop guessing. Start knowing.</p>
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

        {/* Risk Reversal / Guarantee Box */}
        <section className="px-6">
          <div className="guarantee-box">
            <Shield size={64} color="#10b981" style={{margin: '0 auto 1.5rem'}} />
            <h2 style={{fontSize: '2.5rem', fontWeight: '900', color: '#064e3b', marginBottom: '1rem'}}>
              100% Risk-Free 14-Day Guarantee
            </h2>
            <p style={{fontSize: '1.25rem', color: '#065f46', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6'}}>
              Try KinCare with your family for a full 14 days. If you don't feel significantly more relaxed, organized, and confident in your loved one's care, simply cancel with one click. <b>You won't be charged a single cent.</b>
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{maxWidth: '800px', margin: '0 auto 5rem', padding: '0 1.5rem'}}>
          <h2 style={{textAlign: 'center', fontSize: '2.2rem', fontWeight: '800', marginBottom: '3rem', color: '#0f172a'}}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <div className="faq-question" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  {faq.q}
                  {openFaq === index ? <Minus size={20} color="#0d9488" /> : <Plus size={20} color="#0d9488" />}
                </div>
                {openFaq === index && (
                  <div className="faq-answer">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
      
      {/* Sticky CTA (Appears on scroll) */}
      <div className={`sticky-cta ${showSticky ? 'visible' : ''}`}>
        <div className="flex justify-between items-center w-full max-w-4xl mx-auto gap-4">
          <div className="hidden md:block">
            <strong style={{display: 'block', fontSize: '1.2rem', color: '#0f172a'}}>Ready for peace of mind?</strong>
            <span style={{color: '#64748b'}}>Start your 14-Day Free Trial now.</span>
          </div>
          <button 
            onClick={() => handleCheckout('https://pay.hotmart.com/O106115546S?off=agpe42pl')}
            className="buy-button"
            style={{margin: 0, padding: '1rem 2rem'}} 
          >
            START FREE TRIAL <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-10" style={{background: '#020617', color: '#64748b', textAlign: 'center'}}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <HeartPulse color="#0d9488" size={24} />
          <span style={{fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.5px'}}>
            <span style={{color: '#0d9488'}}>Kin</span><span style={{color: '#f8fafc'}}>Care</span>
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
