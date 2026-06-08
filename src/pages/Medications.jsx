import React, { useContext, useState, useRef } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Check, Clock, Plus, X, AlertCircle, Camera, Trash2 } from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

const Medications = () => {
  const { medications, markMedicationStatus, addMedication, deleteMedication } = useContext(GlobalContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeActionMed, setActiveActionMed] = useState(null); // Which med is being acted on
  const [isUploading, setIsUploading] = useState(false);
  
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [newMedFrequency, setNewMedFrequency] = useState('24'); // Default 24h (Once a day)
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const fileInputRef = useRef(null);

  const handlePhotoCapture = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt
      });
      if (image.webPath) {
        setPhotoPreview(image.webPath);
        const response = await fetch(image.webPath);
        const blob = await response.blob();
        setPhotoFile(blob);
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
        name: newMedName,
        time: newMedTime,
        frequency: parseInt(newMedFrequency),
        photoFile: photoFile
      });
      setIsUploading(false);
      setShowAddForm(false);
      setNewMedName('');
      setNewMedTime('');
      setPhotoFile(null);
      setPhotoPreview('');
      setNewMedFrequency('24');
    }
  };

  const handleStatusAction = (id, status) => {
    markMedicationStatus(id, status);
    setActiveActionMed(null);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      deleteMedication(id);
    }
  };

  const sortedMeds = [...medications].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="page-content top-gradient-bg" style={{paddingBottom: '80px', paddingTop: '3rem'}}>
      <header className="px-4 mb-6 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700', margin: 0}}>Today's Medications</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>Track and confirm</p>
        </div>
      </header>

      {/* Floating Action Button for Adding Medications */}
      <button className="fab-button" onClick={() => setShowAddForm(true)}>
        <Plus size={24} />
      </button>

      <main className="px-4">
        {showAddForm && (
          <div className="glass-card mb-6" style={{border: '2px solid var(--primary-color)', padding: '1.5rem', boxShadow: '0 10px 25px rgba(37,99,235,0.1)'}}>
            <div className="flex justify-between items-center mb-5">
              <h3 style={{margin: 0, fontSize: '1.2rem'}}>New Medication</h3>
              <button style={{background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.5rem', borderRadius: '50%', border: 'none', display: 'flex'}} onClick={() => setShowAddForm(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex-col gap-4 flex">
              
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center justify-center p-6" style={{border: '2px dashed #94a3b8', borderRadius: '16px', background: '#f8fafc', cursor: 'pointer', transition: 'all 0.2s'}} onClick={handlePhotoCapture}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '12px'}} />
                ) : (
                  <>
                    <div style={{background: '#e2e8f0', padding: '1rem', borderRadius: '50%', marginBottom: '1rem'}}>
                      <Camera size={32} color="#475569" />
                    </div>
                    <span style={{fontSize: '0.95rem', color: '#475569', fontWeight: '600'}}>Take Photo of the Box</span>
                  </>
                )}
              </div>

              <div>
                <label style={{fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)'}}>Medication Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Tylenol 500mg" 
                  value={newMedName}
                  onChange={e => setNewMedName(e.target.value)}
                  style={{padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%', fontFamily: 'inherit', background: '#ffffff', fontSize: '1rem'}}
                  required
                />
              </div>

              <div className="flex gap-4">
                <div style={{flex: 1}}>
                  <label style={{fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)'}}>First Dose</label>
                  <input 
                    type="time" 
                    value={newMedTime}
                    onChange={e => setNewMedTime(e.target.value)}
                    style={{padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%', fontFamily: 'inherit', background: '#ffffff', fontSize: '1rem'}}
                    required
                  />
                </div>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem', color: 'var(--text-color)'}}>Frequency</label>
                  <select 
                    value={newMedFrequency} 
                    onChange={e => setNewMedFrequency(e.target.value)}
                    style={{padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%', fontFamily: 'inherit', background: '#ffffff', fontSize: '1rem'}}
                  >
                    <option value="24">Once a day</option>
                    <option value="12">Every 12 hours</option>
                    <option value="8">Every 8 hours</option>
                    <option value="6">Every 6 hours</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary mt-4" style={{padding: '1rem', borderRadius: '12px', fontSize: '1.05rem', fontWeight: '700', boxShadow: '0 8px 20px rgba(37,99,235,0.2)'}} disabled={isUploading}>
                {isUploading ? 'Saving...' : 'Save Medication Plan'}
              </button>
            </form>
          </div>
        )}

        {sortedMeds.length === 0 && !showAddForm && (
          <div className="text-center p-8 text-gray-500">
            No medications found. Click the + button to add one.
          </div>
        )}

        {sortedMeds.map(med => {
          let borderColor = 'var(--primary-color)'; // default pending
          let bgGradient = 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)';
          let statusBadge = <div style={{background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem'}}><Clock size={14}/> Pending</div>;
          
          if(med.status === 'taken') {
            borderColor = 'var(--success-color)';
            bgGradient = 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(240,253,244,0.5) 100%)';
            statusBadge = <div style={{background: 'var(--success-light)', color: 'var(--success-color)', padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem'}}><Check size={14}/> Taken</div>;
          } else if(med.status === 'missed') {
            borderColor = 'var(--danger-color)';
            bgGradient = 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(254,242,242,0.8) 100%)';
            statusBadge = <div style={{background: 'var(--danger-light)', color: 'var(--danger-color)', padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem'}}><AlertCircle size={14}/> Refused</div>;
          } else if(med.status === 'skipped') {
            borderColor = 'var(--warning-color)';
            bgGradient = 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,251,235,0.8) 100%)';
            statusBadge = <div style={{background: 'var(--warning-light)', color: 'var(--warning-color)', padding: '0.35rem 0.75rem', borderRadius: '100px', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.35rem'}}><AlertCircle size={14}/> Skipped</div>;
          }

          return (
            <div key={med.id} className="glass-card mb-5" style={{borderLeft: `5px solid ${borderColor}`, background: bgGradient, padding: '1.25rem', boxShadow: '0 8px 16px rgba(0,0,0,0.03)'}}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4 items-center">
                  {med.photoUrl ? (
                    <img src={med.photoUrl} alt={med.name} style={{width: '60px', height: '60px', borderRadius: '14px', objectFit: 'cover', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)'}} />
                  ) : (
                    <div style={{width: '60px', height: '60px', borderRadius: '14px', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)'}}>
                      <Clock size={28} />
                    </div>
                  )}
                  <div>
                    <h3 style={{color: borderColor, marginBottom: '0.15rem', fontSize: '1.1rem', fontWeight: '800'}}>
                      {med.time}
                    </h3>
                    <strong style={{fontSize: '1.2rem', color: '#0f172a'}}>{med.name}</strong>
                    {med.frequency && <p style={{fontSize: '0.8rem', color: 'var(--text-light)', margin: '0.15rem 0 0 0', fontWeight: '500'}}>Every {med.frequency} hours</p>}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {statusBadge}
                  <button 
                    onClick={() => handleDelete(med.id, med.name)}
                    style={{background: 'transparent', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '0.25rem'}}
                    title="Delete Medication"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {med.status !== 'pending' ? (
                <div className="flex items-center gap-3 mt-4" style={{background: 'white', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                  {med.takenBy && med.takenBy.avatar ? (
                    <img src={med.takenBy.avatar} alt={med.takenBy.name} className="avatar" style={{width: '32px', height: '32px', borderRadius: '10px'}} />
                  ) : (
                    <div style={{width: '32px', height: '32px', borderRadius: '10px', background: '#cbd5e1'}}></div>
                  )}
                  <span style={{fontSize: '0.9rem', color: '#475569', fontWeight: '500'}}>
                    Logged {med.takenBy ? `by ${med.takenBy.name}` : ''} at {med.takenAt}
                  </span>
                </div>
              ) : (
                <div className="mt-4">
                  {activeActionMed === med.id ? (
                    <div className="flex flex-col gap-3 p-4" style={{background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.02)'}}>
                      <p style={{fontSize: '0.9rem', marginBottom: '0.25rem', fontWeight: '700', color: '#0f172a'}}>Log Action:</p>
                      <div className="flex flex-col gap-2">
                        <button className="btn-success" style={{padding: '0.85rem', borderRadius: '10px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'}} onClick={() => handleStatusAction(med.id, 'taken')}>
                          <Check size={18} /> Taken Successfully
                        </button>
                        <div className="flex gap-2">
                          <button style={{flex: 1, background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', padding: '0.85rem', borderRadius: '10px', fontWeight: '600'}} onClick={() => handleStatusAction(med.id, 'missed')}>
                            Refused
                          </button>
                          <button style={{flex: 1, background: '#fffbeb', color: '#d97706', border: '1px solid #fde68a', padding: '0.85rem', borderRadius: '10px', fontWeight: '600'}} onClick={() => handleStatusAction(med.id, 'skipped')}>
                            Skipped
                          </button>
                        </div>
                      </div>
                      <button style={{background: 'transparent', color: '#64748b', border: 'none', padding: '0.5rem', fontWeight: '600', marginTop: '0.5rem'}} onClick={() => setActiveActionMed(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn-primary" 
                      style={{width: '100%', padding: '1rem', borderRadius: '12px', fontSize: '1rem', fontWeight: '600', background: 'var(--primary-color)', color: 'white'}}
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
