import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Pill, Users, ChevronRight } from 'lucide-react';

const Welcome = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const slides = [
    {
      icon: <HeartPulse size={80} strokeWidth={1.5} color="var(--primary-color)" />,
      title: "Care with Love",
      description: "A delicate and organized way to manage your family's health journey.",
      bgImage: "radial-gradient(circle at top right, var(--primary-light), transparent 60%)"
    },
    {
      icon: <Pill size={80} strokeWidth={1.5} color="var(--success-color)" />,
      title: "Track Medications",
      description: "Never miss a dose again. Get gentle reminders and log everything seamlessly.",
      bgImage: "radial-gradient(circle at top left, var(--success-light), transparent 60%)"
    },
    {
      icon: <Users size={80} strokeWidth={1.5} color="var(--warning-color)" />,
      title: "Connect the Family",
      description: "Share the responsibility. Everyone stays in sync and helps with the care.",
      bgImage: "radial-gradient(circle at bottom right, var(--warning-light), transparent 60%)"
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      localStorage.setItem('hasSeenWelcome', 'true');
      navigate('/login');
    }
  };

  const handleSkip = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    navigate('/login');
  };

  return (
    <div className="page-content" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', position: 'relative', overflow: 'hidden'}}>
      
      {/* Decorative Background */}
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: slides[currentSlide].bgImage, transition: 'background 0.5s ease', opacity: 0.7}}></div>

      {/* Top Header */}
      <div style={{padding: '2rem', display: 'flex', justifyContent: 'flex-end', zIndex: 10}}>
        <button onClick={handleSkip} style={{background: 'transparent', border: 'none', color: 'var(--text-light)', fontSize: '0.9rem', fontWeight: '600', cursor: 'pointer'}}>
          Skip
        </button>
      </div>

      {/* Slide Content */}
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: 10, textAlign: 'center'}}>
        <div style={{marginBottom: '3rem', animation: 'fade-in 0.5s ease'}}>
          <div style={{background: '#ffffff', width: '160px', height: '160px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.02)'}}>
            {slides[currentSlide].icon}
          </div>
        </div>

        <h1 style={{fontSize: '2rem', fontWeight: '800', color: 'var(--text-color)', marginBottom: '1rem', letterSpacing: '-0.5px'}}>
          {slides[currentSlide].title}
        </h1>
        <p style={{fontSize: '1.1rem', color: 'var(--text-light)', lineHeight: '1.6', maxWidth: '300px'}}>
          {slides[currentSlide].description}
        </p>
      </div>

      {/* Bottom Controls */}
      <div style={{padding: '2rem 2rem 4rem 2rem', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem'}}>
        
        {/* Pagination Dots */}
        <div className="flex gap-2">
          {slides.map((_, index) => (
            <div 
              key={index} 
              style={{
                width: currentSlide === index ? '24px' : '8px', 
                height: '8px', 
                borderRadius: '10px', 
                background: currentSlide === index ? 'var(--primary-color)' : '#e2e8f0',
                transition: 'all 0.3s ease'
              }}
            ></div>
          ))}
        </div>

        {/* Next Button */}
        <button 
          onClick={handleNext}
          style={{
            width: '100%', 
            padding: '1.1rem', 
            borderRadius: '100px', 
            background: 'var(--text-color)', 
            color: '#ffffff', 
            border: 'none', 
            fontSize: '1.1rem', 
            fontWeight: '600', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.5rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
          }}
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'} <ChevronRight size={20} />
        </button>

      </div>
    </div>
  );
};

export default Welcome;
