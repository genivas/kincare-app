import React, { createContext, useState, useEffect } from 'react';
import { initialMedications, mockUser, patientInfo, familyMembers, initialTasks } from '../mockData';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firestore States
  const [patient, setPatient] = useState({ ...patientInfo, urgencyLevel: 'success' });
  const [family, setFamily] = useState(familyMembers);
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState(initialTasks);
  const [schedule, setSchedule] = useState({
    'Segunda': 1, 'Terça': 2, 'Quarta': 3, 'Quinta': 1, 'Sexta': 2, 'Sábado': 3, 'Domingo': 1,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, ...userDoc.data() });
        } else {
          setCurrentUser({
            id: user.uid,
            name: user.displayName || "Membro da Família",
            email: user.email,
            avatar: user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
          });
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Realtime Listeners for Family Data
  useEffect(() => {
    if (!currentUser || !currentUser.familyId) return;

    // Listen to Family/Patient Info
    const unsubscribeFamily = onSnapshot(doc(db, "families", currentUser.familyId), (docSnap) => {
      if(docSnap.exists()) {
        setPatient({ id: docSnap.id, urgencyLevel: 'success', ...docSnap.data() });
      }
    });

    const qMeds = query(collection(db, "medications"), where("familyId", "==", currentUser.familyId));
    const unsubscribeMeds = onSnapshot(qMeds, (snapshot) => {
      const medsData = [];
      snapshot.forEach((doc) => medsData.push({ id: doc.id, ...doc.data() }));
      setMedications(medsData);
    });

    const qHistory = query(collection(db, "history"), where("familyId", "==", currentUser.familyId));
    const unsubscribeHist = onSnapshot(qHistory, (snapshot) => {
      const histData = [];
      snapshot.forEach((doc) => histData.push({ id: doc.id, ...doc.data() }));
      histData.sort((a,b) => b.timestamp - a.timestamp);
      setHistory(histData);
    });

    return () => {
      unsubscribeFamily();
      unsubscribeMeds();
      unsubscribeHist();
    };
  }, [currentUser?.familyId]);

  const createFamily = async (patientData) => {
    if(!currentUser) return;
    const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const familyRef = doc(collection(db, "families"));
    await setDoc(familyRef, {
      ...patientData,
      inviteCode: inviteCode,
      adminId: currentUser.id,
      createdAt: Date.now()
    });

    const userRef = doc(db, "users", currentUser.id);
    await setDoc(userRef, { ...currentUser, familyId: familyRef.id }, { merge: true });
    setCurrentUser(prev => ({ ...prev, familyId: familyRef.id }));
  };

  const joinFamily = async (inviteCode) => {
    if(!currentUser) return false;
    const q = query(collection(db, "families"), where("inviteCode", "==", inviteCode.toUpperCase()));
    const querySnapshot = await getDocs(q);
    
    if(!querySnapshot.empty) {
      const familyDoc = querySnapshot.docs[0];
      const familyId = familyDoc.id;
      
      const userRef = doc(db, "users", currentUser.id);
      await setDoc(userRef, { ...currentUser, familyId: familyId }, { merge: true });
      setCurrentUser(prev => ({ ...prev, familyId: familyId }));
      return true;
    }
    return false;
  };

  const deleteAccountAndFamily = async () => {
    if(!currentUser) return;
    
    try {
      if (currentUser.familyId) {
        await deleteDoc(doc(db, "families", currentUser.familyId));
      }
      await deleteDoc(doc(db, "users", currentUser.id));
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      setCurrentUser(null);
    } catch (error) {
      console.error("Erro ao excluir conta:", error);
      throw error;
    }
  };

  const getTodayCaregiver = () => family.find(f => f.id === schedule[['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][new Date().getDay()]]);
  const getNextCaregiver = () => family.find(f => f.id === schedule[['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'][(new Date().getDay() + 1) % 7]]);

  const addMedication = async (newMed) => {
    let photoUrl = null;
    if (newMed.photoFile) {
      const storageRef = ref(storage, `medications/${Date.now()}_${newMed.photoFile.name}`);
      await uploadBytes(storageRef, newMed.photoFile);
      photoUrl = await getDownloadURL(storageRef);
    }
    const dosesToCreate = 24 / newMed.frequency;
    const [hours, minutes] = newMed.time.split(':').map(Number);
    for (let i = 0; i < dosesToCreate; i++) {
      let doseHour = (hours + (i * newMed.frequency)) % 24;
      let doseTime = `${doseHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      await addDoc(collection(db, "medications"), {
        name: newMed.name,
        time: doseTime,
        frequency: newMed.frequency,
        photoUrl: photoUrl,
        familyId: currentUser.familyId,
        status: 'pending',
        takenBy: null,
        takenAt: null
      });
    }
  };

  const markMedicationStatus = async (id, statusType) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const medRef = doc(db, "medications", id);
    await updateDoc(medRef, { status: statusType, takenBy: currentUser, takenAt: timeStr });
    const med = medications.find(m => m.id === id);
    let actionStr = statusType === 'taken' ? `Deu o remédio ${med?.name}` : statusType === 'missed' ? `Idoso recusou ${med?.name}` : `Pulou ${med?.name} por orientação`;
    let histColor = statusType === 'taken' ? 'success' : statusType === 'missed' ? 'danger' : 'warning';
    
    await addDoc(collection(db, "history"), {
      type: 'medication',
      title: actionStr,
      user: currentUser,
      time: `Hoje, ${timeStr}`,
      color: histColor,
      familyId: currentUser.familyId,
      timestamp: Date.now()
    });
  };

  return (
    <GlobalContext.Provider value={{
      patient, setPatient,
      family, setFamily,
      medications, addMedication, markMedicationStatus,
      tasks, setTasks,
      history, setHistory,
      schedule, setSchedule,
      getTodayCaregiver, getNextCaregiver,
      currentUser, loading,
      createFamily, joinFamily, deleteAccountAndFamily
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
