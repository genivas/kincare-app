import React, { useContext, useState, useRef } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Check, Clock, Plus, X, AlertCircle, Camera, Trash2, ChevronRight } from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

const Medications = () => {
  const { medications, markMedicationStatus, addMedication, deleteMedication } = useContext(GlobalContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeActionMed, setActiveActionMed] = useState(null); 
  const [isUploading, setIsUploading] = useState(false);
  
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [newMedFrequency, setNewMedFrequency] = useState('24');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  const handlePhotoCapture = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 60, width: 500, allowEditing: false, resultType: CameraResultType.Base64, source: CameraSource.Prompt
      });
      if (image.base64String) {
        setPhotoPreview(`data:image/${image.format};base64,${image.base64String}`);
        setPhotoFile(image.base64String);
      }
    } catch(err) {
      console.log(err);
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if(newMedName && newMedTime) {
      setIsUploading(true);
      await addMedication({
        name: newMedName, time: newMedTime, frequency: parseInt(newMedFrequency), photoBase64: photoFile
      });
      setIsUploading(false); setShowAddForm(false); setNewMedName(''); setNewMedTime(''); setPhotoFile(null); setPhotoPreview(''); setNewMedFrequency('24');
    }
  };

  const handleStatusAction = (id, status) => {
    markMedicationStatus(id, status);
    setActiveActionMed(null);
  };

  const sortedMeds = [...medications].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="page-content" style={{paddingBottom: '90px', paddingTop: '3rem', background: 'var(--bg-color)', minHeight: '100vh'}}>
      <header className="px-5 mb-8 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-color)', margin: 0, letterSpacing: '-0.3px'}}>Medications</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>Daily schedule</p>
        </div>
      </header>

      <button className="fab-button" onClick={() => setShowAddForm(true)} style={{bottom: '90px', right: '20px'}}>
        <Plus size={24} />
      </button>

      <main className="px-5">
        {showAddForm && (
          <div style={{background: '#ffffff', borderRadius: '32px', padding: '1.5rem', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.04)', marginBottom: '2rem'}}>
            <div className="flex justify-between items-center mb-5">
              <h3 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-color)'}}>New Presciption</h3>
              <button style={{background: 'var(--bg-color)', color: 'var(--text-light)', padding: '0.5rem', borderRadius: '50%', border: 'none', display: 'flex'}} onClick={() => setShowAddForm(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex-col gap-4 flex">
              
              <div className="flex flex-col items-center justify-center p-6" style={{border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '24px', background: 'var(--bg-color)', cursor: 'pointer', transition: 'all 0.2s'}} onClick={handlePhotoCapture}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '16px'}} />
                ) : (
                  <>
                    <div style={{background: '#ffffff', padding: '1rem', borderRadius: '50%', marginBottom: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'}}>
                      <Camera size={28} color="var(--primary-color)" strokeWidth={1.5} />
                    </div>
                    <span style={{fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: '500'}}>Tap to photograph box</span>
                  </>
                )}
              </div>

              <div>
                <label style={{fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)'}}>Medication Name</label>
                <input type="text" placeholder="e.g., Tylenol 500mg" value={newMedName} onChange={e => setNewMedName(e.target.value)} style={{padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', width: '100%', background: '#ffffff', fontSize: '1rem'}} required />
              </div>

              <div className="flex gap-4">
                <div style={{flex: 1}}>
                  <label style={{fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)'}}>First Dose</label>
                  <input type="time" value={newMedTime} onChange={e => setNewMedTime(e.target.value)} style={{padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', width: '100%', background: '#ffffff', fontSize: '1rem'}} required />
                </div>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '0.85rem', fontWeight: '600', display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)'}}>Frequency</label>
                  <select value={newMedFrequency} onChange={e => setNewMedFrequency(e.target.value)} style={{padding: '1rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.1)', width: '100%', background: '#ffffff', fontSize: '1rem'}}>
                    <option value="24">Once a day</option>
                    <option value="12">Every 12 hours</option>
                    <option value="8">Every 8 hours</option>
                    <option value="6">Every 6 hours</option>
                  </select>
                </div>
              </div>

              <button type="submit" style={{padding: '1.1rem', borderRadius: '100px', fontSize: '1rem', fontWeight: '600', background: 'var(--primary-color)', color: 'white', border: 'none', marginTop: '1rem'}} disabled={isUploading}>
                {isUploading ? 'Saving...' : 'Save Medication'}
              </button>
            </form>
          </div>
        )}

        {sortedMeds.length === 0 && !showAddForm && (
          <div className="text-center p-8 text-gray-500" style={{marginTop: '2rem'}}>
            <div style={{background: '#ffffff', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.03)'}}>
              <Plus color="var(--primary-color)" size={32} />
            </div>
            <p>No medications scheduled.</p>
          </div>
        )}

        {sortedMeds.map(med => {
          let statusBadge = null;
          let cardOpacity = 1;
          
          if(med.status === 'taken') {
            statusBadge = <div style={{background: 'var(--success-light)', color: 'var(--success-color)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem'}}><Check size={14}/> Taken</div>;
            cardOpacity = 0.6;
          } else if(med.status === 'missed') {
            statusBadge = <div style={{background: 'var(--danger-light)', color: 'var(--danger-color)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem'}}><AlertCircle size={14}/> Refused</div>;
          } else if(med.status === 'skipped') {
            statusBadge = <div style={{background: 'var(--warning-light)', color: 'var(--warning-color)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem'}}><AlertCircle size={14}/> Skipped</div>;
          } else {
             statusBadge = <div style={{background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.4rem 0.8rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.35rem'}}><Clock size={14}/> Pending</div>;
          }

          return (
            <div key={med.id} style={{background: '#ffffff', borderRadius: '24px', padding: '1.25rem', marginBottom: '1rem', border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 4px 12px rgba(0,0,0,0.02)', opacity: cardOpacity, transition: 'all 0.3s'}}>
              <div className="flex justify-between items-start">
                <div className="flex gap-4 items-center">
                  {med.photoUrl ? (
                    <img src={med.photoUrl} alt={med.name} style={{width: '56px', height: '56px', borderRadius: '16px', objectFit: 'cover', boxShadow: '0 4px 8px rgba(0,0,0,0.05)'}} />
                  ) : (
                    <div style={{width: '56px', height: '56px', borderRadius: '16px', background: 'var(--bg-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)'}}>
                      <Clock size={24} strokeWidth={1.5} />
                    </div>
                  )}
                  <div>
                    <h3 style={{color: 'var(--text-color)', marginBottom: '0.1rem', fontSize: '1.2rem', fontWeight: '700', letterSpacing: '-0.5px'}}>
                      {med.time}
                    </h3>
                    <strong style={{fontSize: '1rem', color: 'var(--text-color)', fontWeight: '500'}}>{med.name}</strong>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {statusBadge}
                  <button onClick={() => { if(window.confirm('Delete?')) deleteMedication(med.id) }} style={{background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer'}}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {med.status === 'pending' && (
                <div className="mt-4 pt-4" style={{borderTop: '1px solid rgba(0,0,0,0.05)'}}>
                  {activeActionMed === med.id ? (
                    <div className="flex flex-col gap-2">
                      <button style={{background: 'var(--success-color)', color: 'white', border: 'none', padding: '0.85rem', borderRadius: '100px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}} onClick={() => handleStatusAction(med.id, 'taken')}>
                        <Check size={18} /> Confirm Taken
                      </button>
                      <div className="flex gap-2 mt-2">
                        <button style={{flex: 1, background: 'var(--danger-light)', color: 'var(--danger-color)', border: 'none', padding: '0.85rem', borderRadius: '100px', fontWeight: '600'}} onClick={() => handleStatusAction(med.id, 'missed')}>
                          Refused
                        </button>
                        <button style={{flex: 1, background: 'var(--warning-light)', color: 'var(--warning-color)', border: 'none', padding: '0.85rem', borderRadius: '100px', fontWeight: '600'}} onClick={() => handleStatusAction(med.id, 'skipped')}>
                          Skipped
                        </button>
                      </div>
                      <button style={{background: 'transparent', color: 'var(--text-light)', border: 'none', padding: '0.5rem', fontWeight: '600', marginTop: '0.5rem'}} onClick={() => setActiveActionMed(null)}>Cancel</button>
                    </div>
                  ) : (
                    <button 
                      style={{width: '100%', padding: '1rem', borderRadius: '100px', fontSize: '0.9rem', fontWeight: '600', background: 'var(--primary-light)', color: 'var(--primary-color)', border: 'none'}}
                      onClick={() => setActiveActionMed(med.id)}
                    >
                      Log Administration
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
};

export default Medications;
