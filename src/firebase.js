import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, query, where, Timestamp } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Your web app's Firebase configuration
// Replace these with your actual Firebase project settings
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

// Data Structure Reference Examples ==========================

/* 
1. Collection: users 
   Fields: uid (string), name (string), role (string: 'patient' or 'doctor'), email (string)

2. Collection: records
   Fields: patientId (string), fileURL (string), date (string or Timestamp), title (string), category (string), status (string)

3. Collection: prescriptions
   Fields: patientId (string), doctorId (string), medsArray (array of objects), timestamp (firebase Timestamp)
*/

// Example: Get all records for a specific patient
export const fetchPatientRecords = async (patientId) => {
  try {
    const recordsRef = collection(db, 'records');
    const q = query(recordsRef, where('patientId', '==', patientId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching patient records:", error);
    return [];
  }
};

// Example: Add a new prescription
export const addDigitalPrescription = async (patientId, doctorId, meds) => {
  try {
    const docRef = await addDoc(collection(db, 'prescriptions'), {
      patientId,
      doctorId,
      medsArray: meds,
      timestamp: Timestamp.now()
    });
    console.log("Prescription added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error adding prescription:", error);
    throw error;
  }
};

// Example: Upload file to Firebase Storage
export const uploadReport = async (file, patientId) => {
  try {
    const fileRef = ref(storage, `reports/${patientId}/${file.name}`);
    const uploadTask = await uploadBytesResumable(fileRef, file);
    const downloadURL = await getDownloadURL(uploadTask.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading report:", error);
    throw error;
  }
};

export default app;
