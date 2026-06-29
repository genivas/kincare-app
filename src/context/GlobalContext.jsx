import React, { createContext, useState, useEffect } from 'react';
import { initialMedications, mockUser, patientInfo, familyMembers, initialTasks } from '../mockData';
import { auth, db, storage } from '../firebase';
import { onAuthStateChanged, deleteUser } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, where, getDocs, onSnapshot, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, uploadString, getDownloadURL } from 'firebase/storage';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Firestore States
  const [patient, setPatient] = useState({ name: 'Loading...', urgencyLevel: 'success' });
  const [family, setFamily] = useState([]);
  const [medications, setMedications] = useState([]);
  const [history, setHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
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

  // Realtime Listeners for Family Data
  useEffect(() => {
    if (!currentUser || !currentUser.familyId) return;

    // Listen to Family/Patient Info
    const unsubscribeFamily = onSnapshot(doc(db, "families", currentUser.familyId), (docSnap) => {
      if(docSnap.exists()) {
        const data = docSnap.data();
        setPatient({ id: docSnap.id, urgencyLevel: 'success', ...data });
        if(data.schedule) setSchedule(data.schedule);
      }
    });

    // Listen to Family Members
    const qMembers = query(collection(db, "users"), where("familyId", "==", currentUser.familyId));
    const unsubscribeMembers = onSnapshot(qMembers, (snapshot) => {
      const membersData = [];
      snapshot.forEach((doc) => membersData.push({ id: doc.id, ...doc.data() }));
      setFamily(membersData);
    });

    const qMeds = query(collection(db, "medications"), where("familyId", "==", currentUser.familyId));
    const unsubscribeMeds = onSnapshot(qMeds, (snapshot) => {
      const medsData = [];
      snapshot.forEach((doc) => medsData.push({ id: doc.id, ...doc.data() }));
      setMedications(medsData);
    });

    const qTasks = query(collection(db, "tasks"), where("familyId", "==", currentUser.familyId));
    const unsubscribeTasks = onSnapshot(qTasks, (snapshot) => {
      const tasksData = [];
      snapshot.forEach((doc) => tasksData.push({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
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
      unsubscribeMembers();
      unsubscribeMeds();
      unsubscribeTasks();
      unsubscribeHist();
    };
  }, [currentUser?.familyId]);

  // Schedule Local Notifications for Medications
  useEffect(() => {
    const scheduleAlarms = async () => {
      if (!Capacitor.isNativePlatform()) return;
      try {
        const permStatus = await LocalNotifications.requestPermissions();
        if (permStatus.display === 'granted') {
          // Clear old notifications
          const pending = await LocalNotifications.getPending();
          if (pending.notifications.length > 0) {
            await LocalNotifications.cancel({ notifications: pending.notifications });
          }
          
          const notificationsToSchedule = medications
            .filter(m => m.status === 'pending')
            .map((m, index) => {
              const [hours, minutes] = m.time.split(':');
              const now = new Date();
              let scheduleDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), parseInt(hours), parseInt(minutes), 0);
              
              // If time has passed today, schedule for tomorrow
              if (scheduleDate < now) {
                scheduleDate.setDate(scheduleDate.getDate() + 1);
              }
              
              return {
                title: 'MedsDone Medication Alert',
                body: `It's time to give ${m.name} (${m.dosage}) to ${patient?.name || 'your loved one'}.`,
                id: index + 1,
                schedule: { at: scheduleDate, allowWhileIdle: true },
              };
            });
          
          if (notificationsToSchedule.length > 0) {
            await LocalNotifications.schedule({ notifications: notificationsToSchedule });
          }
        }
      } catch (e) {
        console.error("Local notifications error:", e);
      }
    };
    
    if (medications.length > 0) {
      scheduleAlarms();
    }
  }, [medications, patient?.name]);

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

  const getTodayCaregiver = () => family.find(f => f.id === schedule[['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()]]);
  const getNextCaregiver = () => family.find(f => f.id === schedule[['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][(new Date().getDay() + 1) % 7]]);

  const addMedication = async (newMed) => {
    let photoUrl = null;
    if (newMed.photoBase64) {
      photoUrl = `data:image/jpeg;base64,${newMed.photoBase64}`;
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

  const updateSchedule = async (newSchedule) => {
    setSchedule(newSchedule);
    if(currentUser?.familyId) {
      await updateDoc(doc(db, "families", currentUser.familyId), { schedule: newSchedule });
    }
  };

  const addTask = async (taskData) => {
    if(!currentUser?.familyId) return;
    await addDoc(collection(db, "tasks"), {
      ...taskData,
      familyId: currentUser.familyId,
      createdAt: Date.now()
    });
  };

  const updateTask = async (taskId, updates) => {
    await updateDoc(doc(db, "tasks", taskId), updates);
  };

  const deleteMedication = async (id) => {
    try {
      await deleteDoc(doc(db, "medications", id));
    } catch (e) {
      console.error("Error deleting medication:", e);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
    } catch (e) {
      console.error("Error deleting task:", e);
    }
  };

  const sendKudos = async (toUserId, message) => {
    if(!currentUser?.familyId) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const toUser = family.find(f => f.id === toUserId);
    await addDoc(collection(db, "history"), {
      type: 'kudos',
      title: `${currentUser.name} enviou Kudos para ${toUser?.name || 'um membro'}: "${message}"`,
      user: currentUser,
      time: `Hoje, ${timeStr}`,
      color: 'success',
      familyId: currentUser.familyId,
      timestamp: Date.now()
    });
  };

  const logDailySync = async (stressLevel, patientMood) => {
    if(!currentUser?.familyId) return;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = new Date().toLocaleDateString();

    let newStreak = patient.careStreak || 0;
    if (patient.lastStreakUpdate !== todayStr) {
       const yesterday = new Date();
       yesterday.setDate(yesterday.getDate() - 1);
       if (patient.lastStreakUpdate === yesterday.toLocaleDateString()) {
           newStreak += 1;
       } else {
           newStreak = 1; // reset or start
       }
       
       await updateDoc(doc(db, "families", currentUser.familyId), { 
           careStreak: newStreak,
           lastStreakUpdate: todayStr
       });
       setPatient(prev => ({...prev, careStreak: newStreak, lastStreakUpdate: todayStr}));
    }

    await addDoc(collection(db, "history"), {
      type: 'daily_sync',
      title: `Daily Sync Concluído por ${currentUser.name} (Humor: ${patientMood}, Estresse: ${stressLevel})`,
      user: currentUser,
      time: `Hoje, ${timeStr}`,
      color: 'success',
      familyId: currentUser.familyId,
      timestamp: Date.now()
    });
  };

  return (
    <GlobalContext.Provider value={{
      patient, setPatient,
      family, setFamily,
      medications, addMedication, markMedicationStatus, deleteMedication,
      tasks, setTasks, addTask, updateTask, deleteTask,
      history, setHistory,
      schedule, setSchedule, updateSchedule,
      getTodayCaregiver, getNextCaregiver,
      currentUser, loading,
      createFamily, joinFamily, deleteAccountAndFamily,
      sendKudos, logDailySync
    }}>
      {children}
    </GlobalContext.Provider>
  );
};
