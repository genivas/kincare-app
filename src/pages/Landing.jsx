import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, ArrowRight, Shield, CheckCircle2, Star, Lock, Clock, Plus, Minus } from 'lucide-react';
import appMockup from '../assets/app_mockup.png';

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

  const scrollToPricing = (e) => {
    e.preventDefault();
    document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' });
  };

  const openCheckout = (url) => {
    if (window.fbq) {
      window.fbq('track', 'InitiateCheckout');
    }
    window.location.href = url;
  };

  const faqs = [
    {
      q: "Does my elderly parent need to use the app?",
      a: "No! MedsDone is designed for you and your family members (the caregivers). Your parents don't need to do anything or own a smartphone. You use it to coordinate their care among yourselves."
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
    <div style={{minHeight: '100vh', background: 'var(--bg-color)', overflowX: 'hidden', fontFamily: "'Nunito', sans-serif"}}>
      <style>{`
        /* Core Layout & Spacing */
        .page-wrapper {
          padding-top: 120px;
          padding-bottom: 6rem;
        }

        .section-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 1.5rem;
        }

        .flex-center {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .flex-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .flex-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .flex-col {
          display: flex;
          flex-direction: column;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr 1fr;
          }
        }

        /* Header Elements */
        .trust-banner {
          background: var(--primary-light);
          color: var(--primary-color);
          text-align: center;
          padding: 0.75rem 1rem;
          font-size: 0.9rem;
          font-weight: 700;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
        }

        .glass-nav {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          padding: 0.75rem 1.5rem;
        }

        /* Hero & Typography */
        .vsl-container {
          max-width: 800px;
          margin: 0 auto;
          text-align: center;
        }

        .vsl-headline {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          color: var(--text-color);
          line-height: 1.1;
          letter-spacing: -1.5px;
        }
        
        .vsl-subheadline {
          font-size: clamp(1.1rem, 2.5vw, 1.4rem);
          color: #475569;
          margin-top: 1.5rem;
          font-weight: 500;
          line-height: 1.5;
        }

        /* Video Box */
        .video-wrapper {
          position: relative;
          padding-bottom: 56.25%; /* 16:9 Aspect Ratio */
          height: 0;
          overflow: hidden;
          background: #1e293b;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04);
          margin: 2.5rem 0;
          border: 4px solid #fff;
        }

        /* Trust-focused Buttons */
        .buy-button {
          background: var(--primary-color);
          color: #1a3630;
          border: none;
          padding: 1.5rem 2rem;
          font-size: 1.25rem;
          font-weight: 600;
          border-radius: 100px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
          width: 100%;
          max-width: 450px;
          cursor: pointer;
          transition: transform 0.2s, background 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
        }

        .buy-button:hover {
          background: #1a3630;
          transform: translateY(-2px);
        }

        .sign-in-btn {
          background: var(--bg-color);
          border: 1px solid var(--primary-color);
          color: var(--text-color);
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          padding: 0.5rem 1.25rem;
          border-radius: 100px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
          transition: background 0.2s, transform 0.2s;
        }
        .sign-in-btn:hover {
          background: var(--primary-light);
          transform: translateY(-1px);
        }

        /* Sticky CTA */
        .sticky-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          width: 100%;
          background: rgba(255,255,255,0.98);
          padding: 1rem;
          box-shadow: 0 -10px 30px rgba(0,0,0,0.02);
          z-index: 100;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border-top: 1px solid #e2e8f0;
        }
        .sticky-cta.visible {
          transform: translateY(0);
        }

        .sticky-content {
          display: flex;
          justify-content: center;
          align-items: center;
          max-width: 900px;
          margin: 0 auto;
          width: 100%;
          gap: 1rem;
        }

        @media (min-width: 768px) {
          .sticky-content {
            justify-content: space-between;
          }
        }

        .sticky-text {
          display: none;
        }
        @media (min-width: 768px) {
          .sticky-text { display: block; }
        }

        /* Risk Reversal / Guarantee Box */
        .guarantee-box {
          background: #f0fdf4;
          border: 2px dashed var(--success-light);
          border-radius: 24px;
          padding: 2.5rem 1.5rem;
          text-align: center;
          max-width: 800px;
          margin: 3rem auto;
        }

        /* FAQ Accessible */
        .faq-item {
          background: var(--card-bg);
          border-radius: 16px;
          margin-bottom: 1rem;
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
          overflow: hidden;
        }
        .faq-button {
          width: 100%;
          padding: 1.5rem;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: var(--text-color);
          background: none;
          border: none;
          text-align: left;
          font-family: inherit;
        }
        .faq-answer {
          padding: 0 1.5rem 1.5rem 1.5rem;
          color: #475569;
          line-height: 1.6;
        }

        /* Review Cards */
        .review-card {
          background: var(--bg-color);
          padding: 2rem;
          border-radius: 24px;
          border: 1px solid #e2e8f0;
        }
        
        /* Features Section */
        .features-section {
          background: var(--primary-light); /* Fundo clarinho */
          color: var(--text-color);
          padding: 4rem 1.5rem;
          margin: 2rem auto;
          max-width: 1000px;
          border-radius: 32px;
        }

        .feature-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
        }

        /* Pricing Cards */
        .pricing-section {
          padding: 4rem 1.5rem;
          background: var(--bg-color);
        }
        .pricing-card {
          background: var(--card-bg);
          border-radius: 24px;
          padding: 2.5rem;
          box-shadow: 0 4px 24px rgba(0,0,0,0.03);
          border: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .pricing-card.popular {
          border: 2px solid var(--primary-color);
          transform: scale(1.02);
        }
        .popular-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--primary-color);
          color: #1a3630;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }
      `}</style>

      {/* Fixed Header Wrapper */}
      <header style={{position: 'fixed', top: 0, width: '100%', zIndex: 60}}>
        {/* Trust Banner instead of Urgency Banner */}
        <div className="trust-banner">
          <Shield size={16} /> <span>One plan covers your entire family. Private care log. Cancel anytime.</span>
        </div>

        {/* Navigation Bar */}
        <nav className="glass-nav flex-between">
          <div className="flex-row">
            <HeartPulse color="var(--primary-color)" size={28} />
            <span style={{fontSize: '1.25rem', fontWeight: '600', letterSpacing: '-0.5px'}}>
              <span style={{color: 'var(--primary-color)'}}>Kin</span><span style={{color: 'var(--text-color)'}}>Care</span>
            </span>
          </div>
          <div>
            <button className="sign-in-btn" onClick={() => navigate('/login')}>
              Sign in
            </button>
          </div>
        </nav>
      </header>

      <main className="page-wrapper">
        
        {/* VSL Hero Section */}
        <section className="section-container">
          <div className="vsl-container">
            
            <h1 className="vsl-headline">
              <span style={{color: 'var(--primary-color)'}}>Stop The WhatsApp Chaos.</span><br/>
              Know Exactly Who Handled Mom’s Medication.
            </h1>
            
            <p className="vsl-subheadline">
              We are not a complicated hospital software. Stop filling out endless medical forms. MedsDone is the simplest way to replace your chaotic family WhatsApp group. <b>Watch the short video below to see how.</b>
            </p>
            
            {/* VSL Video Player with Poster */}
            <div className="video-wrapper">
              <video 
                src="/vsl-video.mp4" 
                poster={appMockup}
                controls 
                playsInline
                aria-label="MedsDone App Demonstration Video"
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
              >
                <track kind="captions" srcLang="en" label="English" />
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div style={{marginTop: '2rem'}}>
              <button onClick={scrollToPricing} className="buy-button">
                View Pricing Plans <ArrowRight size={24} />
              </button>
              
              <div className="flex-center" style={{gap: '1.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: '600', marginTop: '1rem'}}>
                <div className="flex-row"><Shield size={16} color="var(--primary-color)"/> 14-Day Money-Back Guarantee</div>
                <div className="flex-row"><Lock size={16} color="var(--primary-color)"/> Secure Checkout</div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof / Testimonials */}
        <section style={{background: 'var(--card-bg)', padding: '4rem 1.5rem'}}>
          <div className="section-container" style={{padding: 0}}>
            <h2 style={{textAlign: 'center', fontSize: '2.2rem', fontWeight: '600', marginBottom: '3rem', color: 'var(--text-color)'}}>
              Families Sleep Better With MedsDone.
            </h2>
            
            <div className="grid-2">
              <div className="review-card">
                <div className="flex-row" style={{marginBottom: '0.75rem'}}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{fontSize: '1.1rem', color: '#334155', fontStyle: 'italic', marginBottom: '1.5rem'}}>
                  "My brother and I almost gave my dad a double dose of insulin because a WhatsApp message got lost in the chat. MedsDone literally saved us from a hospital visit."
                </p>
                <div className="flex-row">
                  <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden'}}>
                    <img src="/sarah_avatar.png" alt="Sarah" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                  <div>
                    <strong style={{display: 'block', color: 'var(--text-color)'}}>Sarah T.</strong>
                    <span style={{fontSize: '0.85rem', color: '#64748b'}}>Cares for her father</span>
                  </div>
                </div>
              </div>

              <div className="review-card">
                <div className="flex-row" style={{marginBottom: '0.75rem'}}>
                  {[1,2,3,4,5].map(i => <Star key={i} size={20} color="#f59e0b" fill="#f59e0b" />)}
                </div>
                <p style={{fontSize: '1.1rem', color: '#334155', fontStyle: 'italic', marginBottom: '1.5rem'}}>
                  "Finally, no more waking up at 2 AM wondering if mom took her heart pills. I just open the app and see the green checkmark. Total peace of mind."
                </p>
                <div className="flex-row">
                  <div style={{width: '48px', height: '48px', borderRadius: '50%', background: '#cbd5e1', overflow: 'hidden'}}>
                    <img src="/michael_avatar.png" alt="Michael" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                  </div>
                  <div>
                    <strong style={{display: 'block', color: 'var(--text-color)'}}>Michael R.</strong>
                    <span style={{fontSize: '0.85rem', color: '#64748b'}}>Cares for his mother</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get Section */}
        <section className="features-section">
          <div style={{textAlign: 'center', marginBottom: '3rem'}}>
            <h2 style={{fontSize: '2rem', fontWeight: '600', marginBottom: '1rem', letterSpacing: '-1px'}}>
              Everything you need for total peace of mind.
            </h2>
            <p style={{color: '#94a3b8', fontSize: '1.1rem'}}>Stop guessing. Start knowing.</p>
          </div>

          <div className="grid-2">
             <div className="flex-col">
                <div className="feature-item">
                  <CheckCircle2 size={24} color="var(--success-color)" style={{flexShrink: 0, marginTop: '2px'}}/> 
                  <div><b>Shared Medication Log:</b> Know exactly what was taken and when.</div>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={24} color="var(--success-color)" style={{flexShrink: 0, marginTop: '2px'}}/> 
                  <div><b>Real-Time Sync:</b> Everyone in the family sees updates instantly.</div>
                </div>
             </div>
             <div className="flex-col">
                <div className="feature-item">
                  <CheckCircle2 size={24} color="var(--success-color)" style={{flexShrink: 0, marginTop: '2px'}}/> 
                  <div><b>Family Care Schedule:</b> Assign shifts so no one is overwhelmed.</div>
                </div>
                <div className="feature-item">
                  <CheckCircle2 size={24} color="var(--success-color)" style={{flexShrink: 0, marginTop: '2px'}}/> 
                  <div><b>Task Management:</b> Organize doctor visits, groceries, and pharmacy runs.</div>
                </div>
             </div>
          </div>
        </section>

        {/* Risk Reversal / Guarantee Box */}
        <section style={{padding: '0 1.5rem'}}>
          <div className="guarantee-box">
            <Shield size={64} color="var(--primary-color)" style={{margin: '0 auto 1.5rem'}} />
            <h2 style={{fontSize: '2.2rem', fontWeight: '700', color: 'var(--text-color)', marginBottom: '1rem'}}>
              100% Risk-Free 14-Day Guarantee
            </h2>
            <p style={{fontSize: '1.15rem', color: '#1a3630', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6'}}>
              Get MedsDone for your family today. If you don't feel significantly more relaxed, organized, and confident in your loved one's care within 14 days, simply let us know and we'll refund you. <b>100% Risk-Free.</b>
            </p>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="pricing-section">
          <h2 style={{textAlign: 'center', fontSize: '2.2rem', fontWeight: '600', marginBottom: '3rem', color: 'var(--text-color)'}}>
            Simple, Transparent Pricing
          </h2>
          <div className="section-container" style={{padding: 0}}>
            <div className="grid-2" style={{maxWidth: '900px', margin: '0 auto'}}>
              
              {/* Family Plan */}
              <div className="pricing-card">
                <h3 style={{fontSize: '1.5rem', color: 'var(--text-color)', margin: 0}}>MedsDone Family</h3>
                <p style={{color: '#64748b', marginBottom: '1.5rem'}}>Perfect for individual families.</p>
                <div style={{fontSize: '3rem', fontWeight: '700', color: 'var(--text-color)', marginBottom: '0.5rem'}}>
                  $9.99<span style={{fontSize: '1rem', color: '#64748b', fontWeight: '500'}}>/mo</span>
                </div>
                <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1}}>
                  <li className="flex-row" style={{marginBottom: '0.75rem'}}><CheckCircle2 size={18} color="var(--primary-color)"/> 1 Patient Profile</li>
                  <li className="flex-row" style={{marginBottom: '0.75rem'}}><CheckCircle2 size={18} color="var(--primary-color)"/> Up to 4 Family Members</li>
                  <li className="flex-row" style={{marginBottom: '0.75rem'}}><CheckCircle2 size={18} color="var(--primary-color)"/> Real-time Alerts</li>
                  <li className="flex-row" style={{marginBottom: '0.75rem'}}><CheckCircle2 size={18} color="var(--primary-color)"/> Complete History Log</li>
                </ul>
                <button onClick={() => openCheckout('https://pay.hotmart.com/O106115546S?off=agpe42pl')} className="buy-button" style={{width: '100%', fontSize: '1.1rem', padding: '1rem'}}>
                  Start 14-Day Free Trial
                </button>
              </div>

              {/* Pro Plan */}
              <div className="pricing-card popular">
                <div className="popular-badge">RECOMMENDED</div>
                <h3 style={{fontSize: '1.5rem', color: 'var(--text-color)', margin: 0}}>MedsDone Pro</h3>
                <p style={{color: '#64748b', marginBottom: '1.5rem'}}>For professional caregivers & large families.</p>
                <div style={{fontSize: '3rem', fontWeight: '700', color: 'var(--text-color)', marginBottom: '0.5rem'}}>
                  $19.99<span style={{fontSize: '1rem', color: '#64748b', fontWeight: '500'}}>/mo</span>
                </div>
                <ul style={{listStyle: 'none', padding: 0, margin: '0 0 2rem 0', flex: 1}}>
                  <li className="flex-row" style={{marginBottom: '0.75rem'}}><CheckCircle2 size={18} color="var(--primary-color)"/> <b>Unlimited</b> Patients</li>
                  <li className="flex-row" style={{marginBottom: '0.75rem'}}><CheckCircle2 size={18} color="var(--primary-color)"/> <b>Unlimited</b> Members</li>
                  <li className="flex-row" style={{marginBottom: '0.75rem'}}><CheckCircle2 size={18} color="var(--primary-color)"/> Real-time Alerts</li>
                  <li className="flex-row" style={{marginBottom: '0.75rem'}}><CheckCircle2 size={18} color="var(--primary-color)"/> Export PDF for Doctors</li>
                </ul>
                <button onClick={() => openCheckout('https://pay.hotmart.com/O106115546S?off=6bl5f0mn')} className="buy-button" style={{width: '100%', fontSize: '1.1rem', padding: '1rem', background: 'var(--text-color)'}}>
                  Start 14-Day Free Trial
                </button>
              </div>

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{maxWidth: '800px', margin: '0 auto', padding: '0 1.5rem'}}>
          <h2 style={{textAlign: 'center', fontSize: '2.2rem', fontWeight: '600', marginBottom: '3rem', color: 'var(--text-color)'}}>
            Frequently Asked Questions
          </h2>
          <div>
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button 
                  className="faq-button" 
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  aria-expanded={openFaq === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span>{faq.q}</span>
                  {openFaq === index ? <Minus size={20} color="var(--primary-color)" /> : <Plus size={20} color="var(--primary-color)" />}
                </button>
                {openFaq === index && (
                  <div id={`faq-answer-${index}`} className="faq-answer" role="region">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
      
      {/* Sticky CTA (Appears on scroll) */}
      <div className={`sticky-cta ${showSticky ? 'visible' : ''}`} aria-hidden={!showSticky}>
        <div className="sticky-content">
          <div className="sticky-text">
            <strong style={{display: 'block', fontSize: '1.2rem', color: 'var(--text-color)'}}>Ready for peace of mind?</strong>
            <span style={{color: '#64748b'}}>Secure your family's care today.</span>
          </div>
          <button onClick={scrollToPricing} className="buy-button" style={{margin: 0, padding: '1rem 2rem', maxWidth: '100%', flex: 1}}>
            View Pricing Plans <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{background: 'var(--bg-color)', color: '#64748b', textAlign: 'center', padding: '3rem 1.5rem'}}>
        <div className="flex-center" style={{gap: '0.5rem', marginBottom: '1rem'}}>
          <HeartPulse color="var(--primary-color)" size={24} />
          <span style={{fontSize: '1.4rem', fontWeight: '600', letterSpacing: '-0.5px'}}>
            <span style={{color: 'var(--primary-color)'}}>Kin</span><span style={{color: 'var(--bg-color)'}}>Care</span>
          </span>
        </div>
        <p style={{fontSize: '0.9rem', marginBottom: '1.5rem'}}>&copy; 2026 MedsDone Tech. Built for real families.</p>
        <div className="flex-center" style={{gap: '1.5rem', fontSize: '0.9rem', fontWeight: '500'}}>
          <a href="/login" style={{color: '#94a3b8', textDecoration: 'none'}}>Terms of Service</a>
          <a href="/login" style={{color: '#94a3b8', textDecoration: 'none'}}>Privacy Policy</a>
          <a href="/login" style={{color: '#94a3b8', textDecoration: 'none'}}>Support</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
