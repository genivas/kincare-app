import React, { createContext, useState, useEffect } from 'react';
import { initialMedications, mockUser, patientInfo, familyMembers, initialTasks } from '../mockData';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          setCurrentUser({ id: user.uid, ...userDoc.data() });
        } else {
          setCurrentUser({
            id: user.uid,
            name: user.displayName || "Family Member",
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

  const [patient, setPatient] = useState({
    ...patientInfo,
    urgencyLevel: 'success', // 'success', 'warning', 'danger', 'neutral'
  });
  
  const [family, setFamily] = useState(familyMembers);
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);

  // Firestore Realtime Listeners
  useEffect(() => {
    if (!currentUser || !currentUser.familyId) return;
    
    // Listen to Medications
    import('firebase/firestore').then(({ collection, onSnapshot, query, orderBy, where }) => {
      const qMeds = query(collection(db, "medications"), where("familyId", "==", currentUser.familyId));
      const unsubscribeMeds = onSnapshot(qMeds, (snapshot) => {
        const medsData = [];
        snapshot.forEach((doc) => medsData.push({ id: doc.id, ...doc.data() }));
        setMedications(medsData);
      });

      const qHistory = query(collection(db, "history"), where("familyId", "==", currentUser.familyId), orderBy("timestamp", "desc"));
      const unsubscribeHist = onSnapshot(qHistory, (snapshot) => {
        const histData = [];
        snapshot.forEach((doc) => histData.push({ id: doc.id, ...doc.data() }));
        setHistory(histData);
      });

      return () => {
        unsubscribeMeds();
        unsubscribeHist();
      };
    });
  }, [currentUser]);

  const [tasks, setTasks] = useState(initialTasks);
  const [schedule, setSchedule] = useState({
    'Segunda': 1,
    'Terça': 2,
    'Quarta': 3,
    'Quinta': 1,
    'Sexta': 2,
    'Sábado': 3,
    'Domingo': 1,
  });

  const getTodayCaregiver = () => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const today = days[new Date().getDay()];
    return family.find(f => f.id === schedule[today]);
  };

  const getNextCaregiver = () => {
    const days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    const tomorrow = days[(new Date().getDay() + 1) % 7];
    return family.find(f => f.id === schedule[tomorrow]);
  };

  const addMedication = async (newMed) => {
    const { collection, addDoc } = await import('firebase/firestore');
    
    let photoUrl = null;
    if (newMed.photoFile) {
      const storageRef = ref(storage, `medications/${Date.now()}_${newMed.photoFile.name}`);
      await uploadBytes(storageRef, newMed.photoFile);
      photoUrl = await getDownloadURL(storageRef);
    }

    // Gerar doses para as proximas 24 horas baseado na frequencia
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
    const { doc, updateDoc, collection, addDoc } = await import('firebase/firestore');
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Update Medication
    const medRef = doc(db, "medications", id);
    await updateDoc(medRef, {
      status: statusType,
      takenBy: currentUser,
      takenAt: timeStr
    });

    // Create History entry
    const med = medications.find(m => m.id === id);
    let actionStr = '';
    let histColor = 'success';
    if(statusType === 'taken') actionStr = `Deu o remédio ${med?.name}`;
    if(statusType === 'missed') { actionStr = `Idoso recusou ${med?.name}`; histColor = 'danger'; }
    if(statusType === 'skipped') { actionStr = `Pulou ${med?.name} por orientação`; histColor = 'warning'; }

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
      currentUser, loading
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
