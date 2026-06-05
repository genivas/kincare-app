import React, { useContext, useState, useRef } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { Check, Clock, Plus, X, AlertCircle, Camera } from 'lucide-react';

const Medications = () => {
  const { medications, markMedicationStatus, addMedication } = useContext(GlobalContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeActionMed, setActiveActionMed] = useState(null); // Which med is being acted on
  const [isUploading, setIsUploading] = useState(false);
  
  const [newMedName, setNewMedName] = useState('');
  const [newMedTime, setNewMedTime] = useState('');
  const [newMedFrequency, setNewMedFrequency] = useState('24'); // Default 24h (Once a day)
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  
  const fileInputRef = useRef(null);

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
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

  const sortedMeds = [...medications].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="page-content" style={{paddingBottom: '80px', paddingTop: '1.5rem'}}>
      <header className="px-4 mb-6 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700'}}>Today's Medications</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)'}}>Track and confirm</p>
        </div>
        <button className="btn-primary" style={{width: 'auto', padding: '0.5rem 1rem', borderRadius: '999px'}} onClick={() => setShowAddForm(true)}>
          <Plus size={20} />
        </button>
      </header>

      <main className="px-4">
        {showAddForm && (
          <div className="glass-card mb-4" style={{border: '2px solid var(--primary-color)'}}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{margin: 0}}>New Medication</h3>
              <button style={{background: 'transparent', padding: 0, border: 'none'}} onClick={() => setShowAddForm(false)}>
                <X size={20} color="var(--text-light)"/>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="flex-col gap-4 flex">
              
              {/* Photo Upload Section */}
              <div className="flex flex-col items-center justify-center p-4" style={{border: '2px dashed #cbd5e1', borderRadius: '12px', background: '#f8fafc', cursor: 'pointer'}} onClick={() => fileInputRef.current.click()}>
                {photoPreview ? (
                  <img src={photoPreview} alt="Preview" style={{width: '100%', maxHeight: '150px', objectFit: 'cover', borderRadius: '8px'}} />
                ) : (
                  <>
                    <Camera size={32} color="var(--text-light)" className="mb-2" />
                    <span style={{fontSize: '0.9rem', color: 'var(--text-light)', fontWeight: '600'}}>Take Photo of the Box</span>
                  </>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  capture="environment" 
                  ref={fileInputRef} 
                  onChange={handlePhotoCapture} 
                  style={{display: 'none'}} 
                />
              </div>

              <div>
                <label style={{fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem'}}>Medication Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Tylenol 500mg" 
                  value={newMedName}
                  onChange={e => setNewMedName(e.target.value)}
                  style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit', background: '#f8fafc'}}
                  required
                />
              </div>

              <div className="flex gap-3">
                <div style={{flex: 1}}>
                  <label style={{fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem'}}>First Dose Time</label>
                  <input 
                    type="time" 
                    value={newMedTime}
                    onChange={e => setNewMedTime(e.target.value)}
                    style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit', background: '#f8fafc'}}
                    required
                  />
                </div>
                <div style={{flex: 1}}>
                  <label style={{fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem'}}>Frequency</label>
                  <select 
                    value={newMedFrequency} 
                    onChange={e => setNewMedFrequency(e.target.value)}
                    style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit', background: '#f8fafc'}}
                  >
                    <option value="24">Once a day</option>
                    <option value="12">Every 12 hours</option>
                    <option value="8">Every 8 hours</option>
                    <option value="6">Every 6 hours</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary mt-2" disabled={isUploading}>
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
          let statusBadge = <div className="badge badge-warning flex items-center gap-1"><Clock size={14}/> Pending</div>;
          
          if(med.status === 'taken') {
            borderColor = 'var(--success-color)';
            statusBadge = <div className="badge badge-success flex items-center gap-1"><Check size={14}/> Taken</div>;
          } else if(med.status === 'missed') {
            borderColor = 'var(--danger-color)';
            statusBadge = <div className="badge badge-danger flex items-center gap-1"><AlertCircle size={14}/> Refused</div>;
          } else if(med.status === 'skipped') {
            borderColor = 'var(--warning-color)';
            statusBadge = <div className="badge badge-warning flex items-center gap-1"><AlertCircle size={14}/> Skipped</div>;
          }

          return (
            <div key={med.id} className="glass-card mb-4" style={{borderLeft: `4px solid ${borderColor}`}}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-3">
                  {med.photoUrl ? (
                    <img src={med.photoUrl} alt={med.name} style={{width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #e2e8f0'}} />
                  ) : (
                    <div style={{width: '50px', height: '50px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8'}}>
                      <Clock size={24} />
                    </div>
                  )}
                  <div>
                    <h3 style={{color: borderColor, marginBottom: '0.25rem', fontSize: '1rem', fontWeight: '700'}}>
                      {med.time}
                    </h3>
                    <strong style={{fontSize: '1.1rem'}}>{med.name}</strong>
                    {med.frequency && <p style={{fontSize: '0.75rem', color: 'var(--text-light)', margin: 0}}>Every {med.frequency} hours</p>}
                  </div>
                </div>
                {statusBadge}
              </div>

              {med.status !== 'pending' ? (
                <div className="flex items-center gap-2 mt-4" style={{background: 'rgba(0,0,0,0.03)', padding: '0.75rem', borderRadius: '8px'}}>
                  {med.takenBy && med.takenBy.avatar ? (
                    <img src={med.takenBy.avatar} alt={med.takenBy.name} className="avatar" style={{width: '28px', height: '28px'}} />
                  ) : (
                    <div style={{width: '28px', height: '28px', borderRadius: '50%', background: '#cbd5e1'}}></div>
                  )}
                  <span style={{fontSize: '0.85rem'}}>
                    Logged {med.takenBy ? `by ${med.takenBy.name}` : ''} at {med.takenAt}
                  </span>
                </div>
              ) : (
                <div className="mt-4">
                  {activeActionMed === med.id ? (
                    <div className="flex flex-col gap-2 p-3" style={{background: 'rgba(0,0,0,0.02)', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
                      <p style={{fontSize: '0.85rem', marginBottom: '0.5rem', fontWeight: 'bold'}}>Log Action:</p>
                      <button className="btn-success" onClick={() => handleStatusAction(med.id, 'taken')}>
                        ✅ Taken
                      </button>
                      <button className="btn-secondary" style={{borderColor: 'var(--danger-color)', color: 'var(--danger-color)'}} onClick={() => handleStatusAction(med.id, 'missed')}>
                        ❌ Patient Refused
                      </button>
                      <button className="btn-secondary" style={{borderColor: 'var(--warning-color)', color: 'var(--warning-color)'}} onClick={() => handleStatusAction(med.id, 'skipped')}>
                        ⏭️ Skip (Doctor's Orders)
                      </button>
                      <button className="btn-secondary mt-2" style={{border: 'none'}} onClick={() => setActiveActionMed(null)}>
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn-primary" 
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
