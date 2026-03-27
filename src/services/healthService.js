import { collection, query, where, getDocs, addDoc, deleteDoc, Timestamp } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Fetch a patient by their Dummy ABHA ID
 * @param {string} abhaId - The 14-digit dummy ID (e.g., 91-1234-5678-9012)
 */
export const fetchPatientByAbha = async (abhaId) => {
  try {
    const patientsRef = collection(db, "mock_abha_users");
    const q = query(patientsRef, where("abhaId", "==", abhaId));
    
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Return the first match found
      return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
    } else {
      throw new Error("Patient not found in the ABDM Registry.");
    }
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

/**
 * Add dummy patients (Run this once to populate your DB)
 */
export const seedMockAbhaUsers = async () => {
  console.log('Starting to seed mock ABHA users...');
  
  const mockPatients = [
    {
      abhaId: "91-0000-1111-2222",
      name: "Rahul Sharma",
      age: 28,
      dob: "1996-05-15",
      gender: "Male",
      mobile: "9876543210",
      address: "123 Tech Park, Bangalore, KA - 560001",
      bloodGroup: "O+",
      history: []
    },
    {
      abhaId: '91-1122-3344-5566',
      name: 'Aarav Sharma',
      age: 52,
      dob: "1972-03-10",
      gender: 'Male',
      mobile: "9811223344",
      address: "42 MG Road, Pune, MH - 411001",
      bloodGroup: 'O+',
      lastVisit: Timestamp.fromDate(new Date('2023-10-15T09:30:00')),
      primaryDiagnosis: 'Diabetes Type 2',
      medicalNotes: 'Prescription: Metformin 500mg daily. HbA1c at 7.2%. Needs follow-up in 3 months.'
    },
    {
      abhaId: '82-2233-4455-6677',
      name: 'Priya Patel',
      age: 45,
      dob: "1979-11-20",
      gender: 'Female',
      mobile: "9988776655",
      address: "15 Marine Drive, Mumbai, MH - 400020",
      bloodGroup: 'B+',
      lastVisit: Timestamp.fromDate(new Date('2023-11-02T10:15:00')),
      primaryDiagnosis: 'Hypertension',
      medicalNotes: 'Blood pressure logs show average 145/90. Prescribed Amlodipine 5mg.'
    },
    {
      abhaId: '73-3344-5566-7788',
      name: 'Rohan Gupta',
      age: 28,
      dob: "1996-07-08",
      gender: 'Male',
      mobile: "9123456780",
      address: "88 Vasant Vihar, New Delhi, DL - 110057",
      bloodGroup: 'A+',
      lastVisit: Timestamp.fromDate(new Date('2023-12-10T11:45:00')),
      primaryDiagnosis: 'Chronic Asthma',
      medicalNotes: 'Inhaler usage: Salbutamol as needed. Triggered by cold weather and dust.'
    },
    {
      abhaId: '64-4455-6677-8899',
      name: 'Neha Singh',
      age: 34,
      dob: "1990-01-25",
      gender: 'Female',
      mobile: "9876543212",
      address: "7th Avenue, Salt Lake, Kolkata, WB - 700091",
      bloodGroup: 'AB+',
      lastVisit: Timestamp.fromDate(new Date('2024-01-05T14:20:00')),
      primaryDiagnosis: 'Anemia',
      medicalNotes: 'Low Hemoglobin reports (9.5 g/dL). Prescribed Iron and Folic Acid supplements.'
    },
    {
      abhaId: '55-5566-7788-9900',
      name: 'Vikram Mehta',
      age: 41,
      dob: "1983-09-12",
      gender: 'Male',
      mobile: "9871122334",
      address: "33 Jubilee Hills, Hyderabad, TG - 500033",
      bloodGroup: 'O-',
      lastVisit: Timestamp.fromDate(new Date('2024-01-18T16:00:00')),
      primaryDiagnosis: 'Vitamin D Deficiency',
      medicalNotes: 'Serum Vitamin D level at 12 ng/mL. Weekly cholecalciferol 60k IU prescribed for 8 weeks.'
    },
    {
      abhaId: '46-6677-8899-0011',
      name: 'Anita Desai',
      age: 29,
      dob: "1995-12-05",
      gender: 'Female',
      mobile: "9922334455",
      address: "4A Navrangpura, Ahmedabad, GJ - 380009",
      bloodGroup: 'B-',
      lastVisit: Timestamp.fromDate(new Date('2024-02-12T09:00:00')),
      primaryDiagnosis: 'Migraine',
      medicalNotes: 'Neurology consults note frequent episodic migraines. Prescribed Sumatriptan 50mg for acute attacks.'
    },
    {
      abhaId: '37-7788-9900-1122',
      name: 'Suresh Kumar',
      age: 55,
      dob: "1969-04-18",
      gender: 'Male',
      mobile: "9845012345",
      address: "10 T Nagar, Chennai, TN - 600017",
      bloodGroup: 'A-',
      lastVisit: Timestamp.fromDate(new Date('2024-02-28T10:30:00')),
      primaryDiagnosis: 'Hyperthyroidism',
      medicalNotes: 'TSH reports low (0.1 mIU/L). Started on Methimazole 10mg daily.'
    },
    {
      abhaId: '28-8899-0011-2233',
      name: 'Meena Reddy',
      age: 62,
      dob: "1962-08-30",
      gender: 'Female',
      mobile: "9866123456",
      address: "55 Banjara Hills, Hyderabad, TG - 500034",
      bloodGroup: 'AB-',
      lastVisit: Timestamp.fromDate(new Date('2024-03-05T11:15:00')),
      primaryDiagnosis: 'Osteoarthritis',
      medicalNotes: 'Bilateral knee X-ray records show moderate joint space narrowing. Advised physiotherapy and Aceclofenac.'
    },
    {
      abhaId: '19-9900-1122-3344',
      name: 'Rahul Joshi',
      age: 38,
      dob: "1986-06-22",
      gender: 'Male',
      mobile: "9822123456",
      address: "12 Kothrud, Pune, MH - 411038",
      bloodGroup: 'O+',
      lastVisit: Timestamp.fromDate(new Date('2024-03-10T12:00:00')),
      primaryDiagnosis: 'GERD / Acid Reflux',
      medicalNotes: 'Gastroenterology history of chronic heartburn. Prescribed Pantoprazole 40mg before breakfast.'
    },
    {
      abhaId: '90-0011-2233-4455',
      name: 'Sunita Verma',
      age: 26,
      dob: "1998-02-14",
      gender: 'Female',
      mobile: "9812345678",
      address: "21 Gomti Nagar, Lucknow, UP - 226010",
      bloodGroup: 'B+',
      lastVisit: Timestamp.fromDate(new Date('2024-03-15T15:30:00')),
      primaryDiagnosis: 'PCOD / PCOS',
      medicalNotes: 'Hormonal profile irregular. Advised lifestyle modifications and oral contraceptives for symptom management.'
    },
    {
      abhaId: '81-1122-3344-5566',
      name: 'Karan Malhotra',
      age: 19,
      dob: "2005-10-10",
      gender: 'Male',
      mobile: "9878123456",
      address: "9 Sector 17, Chandigarh, CH - 160017",
      bloodGroup: 'A+',
      lastVisit: Timestamp.fromDate(new Date('2024-03-20T10:00:00')),
      primaryDiagnosis: 'Seasonal Allergies',
      medicalNotes: 'Immunology notes severe allergic rhinitis during spring. Prescribed Fexofenadine and fluticasone nasal spray.'
    },
    {
      abhaId: '72-2233-4455-6677',
      name: 'Pooja Iyer',
      age: 31,
      dob: "1993-05-02",
      gender: 'Female',
      mobile: "9844123456",
      address: "18 Indiranagar, Bangalore, KA - 560038",
      bloodGroup: 'O-',
      lastVisit: Timestamp.fromDate(new Date('2024-03-22T14:45:00')),
      primaryDiagnosis: 'Sinusitis',
      medicalNotes: 'ENT history of recurrent chronic sinusitis. Advised saline irrigation and prescribed a 7-day course of Amoxicillin.'
    },
    {
      abhaId: '63-3344-5566-7788',
      name: 'Amit Agarwal',
      age: 48,
      dob: "1976-11-14",
      gender: 'Male',
      mobile: "9830123456",
      address: "44 Civil Lines, Jaipur, RJ - 302006",
      bloodGroup: 'B-',
      lastVisit: Timestamp.fromDate(new Date('2024-03-25T09:15:00')),
      primaryDiagnosis: 'Fatty Liver (NAFLD)',
      medicalNotes: 'Ultrasound reports show Grade 2 fatty infiltration. Advised strict diet control and weight loss regimen.'
    },
    {
      abhaId: '54-4455-6677-8899',
      name: 'Shikha Tiwari',
      age: 50,
      dob: "1974-07-25",
      gender: 'Female',
      mobile: "9899123456",
      address: "56 Saket, New Delhi, DL - 110017",
      bloodGroup: 'AB-',
      lastVisit: Timestamp.fromDate(new Date('2024-03-26T11:30:00')),
      primaryDiagnosis: 'Lower Back Pain / Sciatica',
      medicalNotes: 'Physiotherapy logs indicate L4-L5 disc compression. Prescribed muscle relaxants and core strengthening exercises.'
    },
    {
      abhaId: '45-5566-7788-9900',
      name: 'Deepak Chahar',
      age: 22,
      dob: "2002-01-05",
      gender: 'Male',
      mobile: "9826123456",
      address: "24 Malviya Nagar, Bhopal, MP - 462003",
      bloodGroup: 'A-',
      lastVisit: Timestamp.fromDate(new Date('2024-03-27T16:20:00')),
      primaryDiagnosis: 'Iron Deficiency',
      medicalNotes: 'Ferritin levels severely low (10 ng/mL). Initiated IV iron therapy (Ferric Carboxymaltose).'
    }
  ];

  const usersCollectionRef = collection(db, 'mock_abha_users');
  let successCount = 0;
  
  try {
    // Clear old records first
    console.log('Clearing old records...');
    const existingDocs = await getDocs(usersCollectionRef);
    const deletePromises = existingDocs.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
    console.log('Old records cleared. Adding new records...');

    const uploadPromises = mockPatients.map(async (patient) => {
      await addDoc(usersCollectionRef, patient);
      successCount++;
    });

    await Promise.all(uploadPromises);
    console.log(`✅ Successfully seeded ${successCount} out of ${mockPatients.length} patient records to the 'mock_abha_users' collection.`);
  } catch (error) {
    console.error('❌ Error seeding patient records:', error);
  }
};