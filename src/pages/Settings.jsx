import React, { useContext, useState } from 'react';
import { GlobalContext } from '../context/GlobalContext';
import { UserPlus, X, ShieldCheck, CreditCard, LifeBuoy, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, db, storage } from '../firebase';
import { signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { Camera } from 'lucide-react';
import { Camera as CapCamera, CameraResultType, CameraSource } from '@capacitor/camera';

const Settings = () => {
  const { patient, setPatient, family, setFamily, currentUser, deleteAccountAndFamily } = useContext(GlobalContext);
  const [name, setName] = useState(patient?.name || '');
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRelation, setNewMemberRelation] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Family');
  const navigate = useNavigate();

  const handleSave = () => {
    setPatient({ ...patient, name });
    alert('Saved successfully!');
  };

  const handlePhotoUpload = async (type, memberId = null) => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 60,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Prompt
      });

      if (!image.base64String) return;

      setUploadingId(type === 'patient' ? 'patient' : memberId);
      let storagePath = '';
      let docRef = null;

      if (type === 'patient') {
        storagePath = `avatars/families/${patient.id}/patient_avatar_${Date.now()}`;
        docRef = doc(db, "families", patient.id);
      } else if (type === 'member' && memberId) {
        storagePath = `avatars/users/${memberId}/avatar_${Date.now()}`;
        docRef = doc(db, "users", memberId);
      }

      const fileRef = ref(storage, storagePath);
      await uploadString(fileRef, image.base64String, 'base64', { contentType: `image/${image.format}` });
      const downloadURL = await getDownloadURL(fileRef);

      await updateDoc(docRef, { avatar: downloadURL });
      // Remove the alert, the UI will update automatically via snapshot
    } catch (err) {
      console.error("Error with camera or upload:", err);
      if (err.message && err.message.indexOf('User cancelled') === -1) {
        alert('Error uploading photo. Please check your connection and try again.');
      }
    } finally {
      setUploadingId(null);
    }
  };

  const handleInviteWhatsApp = (e) => {
    e.preventDefault();
    if(newMemberName && newMemberRelation) {
      const patientName = patient?.name ? patient.name.split(' ')[0] : 'our family member';
      const msg = `Hi ${newMemberName}! I'm inviting you to the *KinCare* app to help care for ${patientName}.\n\nTo access the routine and medications, simply click the link below and create your free account:\n👉 https://kincare-app.pages.dev/login?invite=${currentUser?.familyId}\n\nDone! We are now connected.`;
      window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
      setShowAddForm(false);
      setNewMemberName('');
      setNewMemberRelation('');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("WARNING: Are you sure you want to permanently delete your account and all Family data? This action cannot be undone.")) {
      try {
        await deleteAccountAndFamily();
        navigate('/');
      } catch(e) {
        alert("Error deleting account. Please log in again to try.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="page-content" style={{paddingBottom: '80px', paddingTop: '3rem'}}>
      <header className="px-4 mb-6 flex justify-between items-center">
        <div>
          <h1 style={{fontSize: '1.4rem', fontWeight: '700', margin: 0}}>Settings</h1>
          <p style={{fontSize: '0.85rem', color: 'var(--text-light)', margin: 0}}>Manage account & family</p>
        </div>
      </header>

      <main className="px-4">
        
        {/* Support Quick Action */}
        <div className="flex gap-3 mb-6">
          <button 
            className="glass-card flex-1 flex flex-col items-center justify-center p-4" 
            style={{border: 'none', background: 'white', color: 'var(--text-color)', marginBottom: 0}}
            onClick={() => navigate('/app/support')}
          >
            <LifeBuoy size={28} color="var(--primary-color)" className="mb-2" />
            <span style={{fontSize: '0.9rem', fontWeight: '600'}}>Support</span>
          </button>
        </div>

        <div className="glass-card mb-6">
          <h3 className="mb-4" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><ShieldCheck size={20} color="var(--primary-color)" /> Patient Profile</h3>
          <div className="flex-col gap-3">
            <div className="flex items-center gap-4 mb-4">
              <img src={patient?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${patient?.name || 'Idoso'}`} alt="Avatar" className="avatar avatar-lg" style={{width: '60px', height: '60px', borderRadius: '20px', objectFit: 'cover', opacity: uploadingId === 'patient' ? 0.5 : 1}} />
              <button 
                className="btn-secondary" 
                style={{padding: '0.5rem 1rem', width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem'}}
                onClick={() => handlePhotoUpload('patient')}
                disabled={uploadingId !== null}
              >
                <Camera size={16} /> {uploadingId === 'patient' ? 'Uploading...' : 'Change Photo'}
              </button>
            </div>
            <label style={{fontSize: '0.85rem', fontWeight: 'bold', display: 'block', marginBottom: '0.5rem'}}>Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', marginBottom: '1rem', fontFamily: 'inherit', background: '#f8fafc'}}
            />
            <button className="btn-primary" onClick={handleSave} style={{padding: '0.85rem', borderRadius: '10px'}}>Save Changes</button>
          </div>
        </div>

        {showAddForm && (
          <div className="glass-card mb-6" style={{border: '1px solid var(--primary-color)'}}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{margin: 0}}>Invite Code</h3>
              <button style={{background: 'transparent', padding: 0, border: 'none'}} onClick={() => setShowAddForm(false)}>
                <X size={20} color="var(--text-light)"/>
              </button>
            </div>
            <div style={{background: '#f8fafc', padding: '1rem', borderRadius: '10px', textAlign: 'center', marginBottom: '1rem'}}>
              <p style={{fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem'}}>Share this code with caregivers:</p>
              <h2 style={{letterSpacing: '3px', color: 'var(--primary-color)'}}>{patient?.inviteCode || '...'}</h2>
            </div>
            <form onSubmit={handleInviteWhatsApp} className="flex-col gap-3 flex">
              <input 
                type="text" 
                placeholder="Name" 
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit'}}
                required
              />
              <input 
                type="text" 
                placeholder="Relation (e.g., Son)" 
                value={newMemberRelation}
                onChange={e => setNewMemberRelation(e.target.value)}
                style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit'}}
                required
              />
              <select 
                value={newMemberRole} 
                onChange={e => setNewMemberRole(e.target.value)}
                style={{padding: '0.85rem', borderRadius: '10px', border: '1px solid #e2e8f0', width: '100%', fontFamily: 'inherit', backgroundColor: 'white'}}
              >
                <option value="Family">Family (Full Access)</option>
                <option value="Professional Caregiver">Professional Caregiver</option>
                <option value="Nurse">Registered Nurse</option>
              </select>
              <button type="submit" className="btn-primary mt-2 flex justify-center items-center gap-2" style={{padding: '0.85rem', borderRadius: '10px', background: '#25d366', borderColor: '#25d366'}}>
                Send WhatsApp Invite
              </button>
            </form>
          </div>
        )}

        <div className="glass-card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 style={{margin: 0}}>Family Members</h3>
            {!showAddForm && (
              <button style={{background: 'var(--primary-light)', color: 'var(--primary-color)', padding: '0.5rem', borderRadius: '8px', border: 'none'}} onClick={() => setShowAddForm(true)}>
                <UserPlus size={18} />
              </button>
            )}
          </div>
          
          <div className="flex flex-col gap-4">
            {family.map((f, i) => (
              <div key={f.id} className="flex items-center justify-between" style={{borderBottom: i !== family.length - 1 ? '1px solid #f1f5f9' : 'none', paddingBottom: i !== family.length - 1 ? '1rem' : '0'}}>
                <div className="flex items-center gap-3">
                  <div style={{position: 'relative', opacity: uploadingId === f.id ? 0.5 : 1}}>
                    <img src={f.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${f.name}`} alt={f.name} className="avatar" style={{width: '40px', height: '40px', borderRadius: '12px', objectFit: 'cover'}} />
                    <button 
                      style={{position: 'absolute', bottom: -5, right: -5, background: 'var(--primary-color)', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer', display: 'flex'}}
                      onClick={() => handlePhotoUpload('member', f.id)}
                      disabled={uploadingId !== null}
                    >
                      <Camera size={10} />
                    </button>
                  </div>
                  <div>
                    <strong style={{display: 'block', fontSize: '0.95rem'}}>{f.name}</strong>
                    <span style={{fontSize: '0.8rem', color: 'var(--text-light)'}}>
                      {f.relation} &bull; {f.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button 
          onClick={handleLogout}
          className="glass-card flex items-center justify-center gap-2" 
          style={{width: '100%', border: '1px solid #fee2e2', color: '#ef4444', background: '#fef2f2', padding: '1rem'}}
        >
          <LogOut size={20} />
          <strong style={{fontSize: '1rem'}}>Sign Out</strong>
        </button>

        <button 
          onClick={handleDeleteAccount}
          className="glass-card flex items-center justify-center gap-2 mt-4" 
          style={{width: '100%', border: '1px solid #dc2626', color: '#dc2626', background: 'transparent', padding: '1rem'}}
        >
          <strong style={{fontSize: '1rem'}}>Delete Account & Family</strong>
        </button>

      </main>
    </div>
  );
};

export default Settings;
