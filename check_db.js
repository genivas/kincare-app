import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCy9viHxSRZg7eUfiEeO_t5BQ3H7o4ivNw",
  authDomain: "kincare-818c5.firebaseapp.com",
  projectId: "kincare-818c5",
  storageBucket: "kincare-818c5.firebasestorage.app",
  messagingSenderId: "205397452787",
  appId: "1:205397452787:web:41fd527af761d2619dd486"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkSchedule() {
  const familiesSnapshot = await getDocs(collection(db, "families"));
  familiesSnapshot.forEach(doc => {
    const data = doc.data();
    console.log(`Family ID: ${doc.id}`);
    console.log(`Schedule:`, data.schedule);
  });
  process.exit(0);
}

checkSchedule().catch(console.error);
