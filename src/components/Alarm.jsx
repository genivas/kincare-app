import React, { useContext, useEffect, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { BellRing } from 'lucide-react';

const Alarm = () => {
  const { medications } = useContext(GlobalContext);
  const [alarmTriggered, setAlarmTriggered] = useState(null);

  useEffect(() => {
    // Request permission for push notifications on component mount
    if ('Notification' in window) {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const currentHour = now.getHours().toString().padStart(2, '0');
      const currentMinute = now.getMinutes().toString().padStart(2, '0');
      const currentTimeString = `${currentHour}:${currentMinute}`;

      const dueMed = medications.find(m => m.time === currentTimeString && m.status === 'pending');
      
      if (dueMed && (!alarmTriggered || alarmTriggered.id !== dueMed.id)) {
        setAlarmTriggered(dueMed);
        
        // Play Audio
        try {
          const audio = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');
          audio.play().catch(e => console.log('Audio autoplay prevented'));
        } catch(e) {}

        // Trigger native browser push notification
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('Time for Medication!', {
            body: `It's time for ${dueMed.name}`,
            icon: 'https://cdn-icons-png.flaticon.com/512/2966/2966327.png'
          });
        }
      }
    };

    const interval = setInterval(checkAlarms, 10000);
    return () => clearInterval(interval);
  }, [medications, alarmTriggered]);

  if (!alarmTriggered) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px'
    }}>
      <div className="glass-card" style={{background: '#ef4444', color: 'white', border: 'none', textAlign: 'center', width: '100%', maxWidth: '400px'}}>
        <BellRing size={48} style={{margin: '0 auto 1rem auto', animation: 'bounce 1s infinite'}} />
        <h2 style={{color: 'white', marginBottom: '0.5rem'}}>Medication Time!</h2>
        <p style={{fontSize: '1.2rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.9)'}}>
          It's time to administer <strong>{alarmTriggered.name}</strong>.
        </p>
        <button 
          style={{background: 'white', color: '#ef4444', padding: '1rem', width: '100%', borderRadius: '12px', fontWeight: 'bold', fontSize: '1.1rem', border: 'none'}}
          onClick={() => setAlarmTriggered(null)}
        >
          Got it
        </button>
      </div>
    </div>
  );
};

export default Alarm;
