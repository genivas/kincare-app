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

async function checkPhotos() {
  console.log("Checking database for saved avatars...");
  
  // Check users collection
  const usersSnapshot = await getDocs(collection(db, "users"));
  console.log("Found " + usersSnapshot.size + " users.");
  usersSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.avatar) {
      console.log(`[YES] User ${data.name} (ID: ${doc.id}) HAS avatar: ${data.avatar.substring(0, 50)}...`);
    } else {
      console.log(`[NO] User ${data.name} (ID: ${doc.id}) DOES NOT have an avatar.`);
    }
  });

  // Check families collection
  const familiesSnapshot = await getDocs(collection(db, "families"));
  console.log("\nFound " + familiesSnapshot.size + " families (Patient profiles).");
  familiesSnapshot.forEach(doc => {
    const data = doc.data();
    if (data.avatar) {
      console.log(`[YES] Patient in family (ID: ${doc.id}) HAS avatar: ${data.avatar.substring(0, 50)}...`);
    } else {
      console.log(`[NO] Patient in family (ID: ${doc.id}) DOES NOT have an avatar.`);
    }
  });
  
  process.exit(0);
}

checkPhotos().catch(console.error);
