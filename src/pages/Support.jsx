import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Send, CheckCircle2 } from 'lucide-react';

const Support = () => {
  const navigate = useNavigate();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(message.trim()) {
      setSent(true);
      setTimeout(() => {
        navigate('/app/settings');
      }, 3000);
    }
  };

  return (
    <div className="page-content" style={{paddingBottom: '80px', paddingTop: '1.5rem'}}>
      <header className="px-4 mb-6 flex items-center gap-3">
        <button onClick={() => navigate(-1)} style={{background: 'white', border: 'none', padding: '0.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)'}}>
          <ArrowLeft size={24} color="var(--text-color)" />
        </button>
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700'}}>Support</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)'}}>We're here to help you</p>
        </div>
      </header>

      <main className="px-4">
        {sent ? (
          <div className="glass-card text-center flex flex-col items-center justify-center py-10" style={{background: 'var(--success-light)', border: 'none'}}>
            <CheckCircle2 size={64} color="var(--success-color)" className="mb-4" />
            <h2 style={{color: 'var(--success-color)'}}>Message Sent!</h2>
            <p style={{color: '#065f46'}}>Our team will reply to your registered email within 24 hours.</p>
          </div>
        ) : (
          <div className="glass-card p-5">
            <div className="flex items-center gap-3 mb-6">
              <div style={{background: 'var(--primary-light)', padding: '0.75rem', borderRadius: '12px'}}>
                <MessageSquare size={24} color="var(--primary-color)" />
              </div>
              <div>
                <h3 style={{fontSize: '1.1rem', margin: 0}}>Send us a message</h3>
                <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>Bug report or account assistance</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600'}}>Subject</label>
                <select 
                  value={subject} 
                  onChange={e => setSubject(e.target.value)}
                  style={{width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', fontFamily: 'inherit'}}
                  required
                >
                  <option value="" disabled>Select a subject...</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="feedback">Feedback / Suggestion</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600'}}>Message</label>
                <textarea 
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Describe your issue in detail..."
                  style={{width: '100%', padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', background: '#f8fafc', minHeight: '150px', fontFamily: 'inherit', resize: 'vertical'}}
                  required
                />
              </div>

              <button type="submit" className="btn-primary flex items-center justify-center gap-2 mt-2" style={{padding: '1rem', borderRadius: '12px', fontSize: '1.05rem'}}>
                <Send size={18} />
                Send Message
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
};

export default Support;
