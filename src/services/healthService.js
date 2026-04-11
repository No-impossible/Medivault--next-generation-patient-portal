import { supabase } from "../supabaseClient";

/**
 * Fetch a patient by their Dummy ABHA ID
 * @param {string} abhaId - The 14-digit dummy ID (e.g., 91-1234-5678-9012)
 */
export const fetchPatientByAbha = async (abhaId) => {
  try {
    console.log("Input Abha ID:", abhaId);
    // Format the ABHA ID properly (in case it was passed without dashes)
    const digits = abhaId.replace(/\D/g, '');
    const formattedAbha = digits.length === 14
      ? `${digits.slice(0, 2)}-${digits.slice(2, 6)}-${digits.slice(6, 10)}-${digits.slice(10, 14)}`
      : abhaId; // Fallback if it's already a different length, though DB expects 14

    console.log("Formatted Abha ID for Supabase Query:", formattedAbha);

    const { data, error } = await supabase
      .from('mock_abha_users')
      .select('*')
      .eq('abhaId', formattedAbha);

    console.log("Supabase response data:", data, "error:", error);

    if (!error && data && data.length > 0) {
      return data[0];
    }

    // Fallback:
    const fallback = MOCK_PATIENTS.find(p => p.abhaId === formattedAbha);
    if (fallback) {
      return {
        ...fallback,
        id: 'local-' + Date.now(),
        emergencyContacts: [
          { name: `${fallback.name.split(' ')[0]}'s Primary Contact`, phone: '+91 90000 11111', relation: 'Family' },
          { name: `${fallback.name.split(' ')[0]}'s Secondary Contact`, phone: '+91 90000 22222', relation: 'Friend' }
        ]
      };
    }

    throw new Error("Patient not found in the ABDM Registry.");
  } catch (error) {
    console.error("Error fetching patient:", error);
    throw error;
  }
};

export const MOCK_PATIENTS = [
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
    lastVisit: '2023-10-15T09:30:00Z',
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
    lastVisit: '2023-11-02T10:15:00Z',
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
    lastVisit: '2023-12-10T11:45:00Z',
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
    lastVisit: '2024-01-05T14:20:00Z',
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
    lastVisit: '2024-01-18T16:00:00Z',
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
    lastVisit: '2024-02-12T09:00:00Z',
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
    lastVisit: '2024-02-28T10:30:00Z',
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
    lastVisit: '2024-03-05T11:15:00Z',
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
    lastVisit: '2024-03-10T12:00:00Z',
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
    lastVisit: '2024-03-15T15:30:00Z',
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
    lastVisit: '2024-03-20T10:00:00Z',
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
    lastVisit: '2024-03-22T14:45:00Z',
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
    lastVisit: '2024-03-25T09:15:00Z',
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
    lastVisit: '2024-03-26T11:30:00Z',
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
    lastVisit: '2024-03-27T16:20:00Z',
    primaryDiagnosis: 'Iron Deficiency',
    medicalNotes: 'Ferritin levels severely low (10 ng/mL). Initiated IV iron therapy (Ferric Carboxymaltose).'
  },
  {
    abhaId: '11-2233-4455-6677',
    name: 'Kishore Kumar',
    age: 41,
    dob: "1983-05-10",
    gender: 'Male',
    mobile: "9988771122",
    address: "Phase 4, Udyog Vihar, Gurgaon - 122015",
    bloodGroup: 'B+',
    lastVisit: '2024-04-01T09:30:00Z',
    primaryDiagnosis: 'Vitamin D Deficiency',
    medicalNotes: 'Recent Comprehensive Full Body Checkup shows Vitamin D levels at 5.5 ng/mL (Severe Deficiency). Other parameters (Complete Blood Count, Urine Routine, ESR) are within normal limits. Prescribed Vitamin D supplements.'
  }
];

/**
 * Add dummy patients (Run this once to populate your DB)
 */
export const seedMockAbhaUsers = async () => {
  console.log('Starting to seed mock ABHA users...');
  let successCount = 0;

  try {
    // Check if records already exist to prevent wiping out stable UUIDs
    const { count, error: countError } = await supabase
      .from('mock_abha_users')
      .select('*', { count: 'exact', head: true });

    if (!countError && count && count > 0) {
      console.log('Mock ABHA users already exist. Skipping seed to preserve stable patient IDs.');
      return;
    }

    console.log('No records found. Adding new mock ABHA records...');

    const payload = MOCK_PATIENTS.map((patient) => {
      const emergencyContacts = [
        { name: `${patient.name.split(' ')[0]}'s Primary Contact`, phone: '+91 90000 11111', relation: 'Family' },
        { name: `${patient.name.split(' ')[0]}'s Secondary Contact`, phone: '+91 90000 22222', relation: 'Friend' }
      ];
      return { ...patient, emergencyContacts };
    });

    // Instead of Promise.all addDoc, supabase supports bulk insert!
    const { error: insertError } = await supabase
      .from('mock_abha_users')
      .insert(payload);

    if (insertError) throw insertError;

    successCount = payload.length;

    console.log(`✅ Successfully seeded ${successCount} patient records to the 'mock_abha_users' collection.`);
  } catch (error) {
    console.error('❌ Error seeding patient records:', error);
  }
};

/**
 * Fetch doctors by department
 */
export const fetchDoctors = async (departmentId) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*')
      .eq('department', departmentId);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
};

/**
 * Seed 30 Doctors into Supabase (5 per category) for India
 */
export const seedMockDoctors = async () => {
  console.log('Starting to seed mock doctors...');
  const DOCTORS = [
    // General
    { name: "Dr. Sanjay Gupta", exp: "15 Years", rating: 4.8, img: "SG", fee: "₹500", nextSlot: "Today, 10:00 AM", clinic: true, department: "general" },
    { name: "Dr. Anil Sharma", exp: "12 Years", rating: 4.7, img: "AS", fee: "₹400", nextSlot: "Tomorrow, 4:00 PM", clinic: false, department: "general" },
    { name: "Dr. Meera Patel", exp: "18 Years", rating: 4.9, img: "MP", fee: "₹600", nextSlot: "Today, 1:00 PM", clinic: true, department: "general" },
    { name: "Dr. Rajesh Iyer", exp: "22 Years", rating: 4.6, img: "RI", fee: "₹550", nextSlot: "Wed, 9:30 AM", clinic: true, department: "general" },
    { name: "Dr. Sneha Kapoor", exp: "8 Years", rating: 4.5, img: "SK", fee: "₹350", nextSlot: "Today, 6:00 PM", clinic: false, department: "general" },

    // Cardio
    { name: "Dr. Vivek Narang", exp: "25 Years", rating: 4.9, img: "VN", fee: "₹1500", nextSlot: "Tomorrow, 11:00 AM", clinic: true, department: "cardio" },
    { name: "Dr. Ritu Desai", exp: "20 Years", rating: 4.8, img: "RD", fee: "₹1200", nextSlot: "Today, 3:00 PM", clinic: false, department: "cardio" },
    { name: "Dr. Arvind Reddy", exp: "15 Years", rating: 4.7, img: "AR", fee: "₹1000", nextSlot: "Fri, 10:00 AM", clinic: true, department: "cardio" },
    { name: "Dr. Neha Verma", exp: "10 Years", rating: 4.6, img: "NV", fee: "₹800", nextSlot: "Today, 5:30 PM", clinic: true, department: "cardio" },
    { name: "Dr. K. N. Murthy", exp: "30 Years", rating: 4.9, img: "KM", fee: "₹2000", nextSlot: "Mon, 9:00 AM", clinic: false, department: "cardio" },

    // Neuro
    { name: "Dr. Vikram Singh", exp: "18 Years", rating: 4.6, img: "VS", fee: "₹1800", nextSlot: "Thu, 2:00 PM", clinic: true, department: "neuro" },
    { name: "Dr. Priti Joshi", exp: "12 Years", rating: 4.7, img: "PJ", fee: "₹1400", nextSlot: "Tomorrow, 12:30 PM", clinic: false, department: "neuro" },
    { name: "Dr. Suresh Menon", exp: "22 Years", rating: 4.8, img: "SM", fee: "₹1600", nextSlot: "Today, 4:00 PM", clinic: true, department: "neuro" },
    { name: "Dr. Harish Rao", exp: "28 Years", rating: 4.9, img: "HR", fee: "₹2000", nextSlot: "Wed, 11:00 AM", clinic: true, department: "neuro" },
    { name: "Dr. Ayesha Khan", exp: "15 Years", rating: 4.8, img: "AK", fee: "₹1500", nextSlot: "Fri, 3:30 PM", clinic: false, department: "neuro" },

    // Ortho
    { name: "Dr. Priya Desai", exp: "10 Years", rating: 4.8, img: "PD", fee: "₹900", nextSlot: "Tomorrow, 11:30 AM", clinic: true, department: "ortho" },
    { name: "Dr. Aman Gupta", exp: "14 Years", rating: 4.7, img: "AG", fee: "₹1000", nextSlot: "Today, 2:00 PM", clinic: true, department: "ortho" },
    { name: "Dr. Manish Sen", exp: "20 Years", rating: 4.9, img: "MS", fee: "₹1200", nextSlot: "Mon, 10:00 AM", clinic: false, department: "ortho" },
    { name: "Dr. Rohan Agarwal", exp: "18 Years", rating: 4.6, img: "RA", fee: "₹1100", nextSlot: "Today, 5:00 PM", clinic: true, department: "ortho" },
    { name: "Dr. Sunil Shetty", exp: "25 Years", rating: 4.9, img: "SS", fee: "₹1500", nextSlot: "Wed, 4:00 PM", clinic: true, department: "ortho" },

    // Pedia
    { name: "Dr. Aditi Sharma", exp: "12 Years", rating: 4.8, img: "AS", fee: "₹600", nextSlot: "Today, 9:00 AM", clinic: true, department: "pedia" },
    { name: "Dr. Rohan Das", exp: "8 Years", rating: 4.6, img: "RD", fee: "₹500", nextSlot: "Tomorrow, 3:30 PM", clinic: false, department: "pedia" },
    { name: "Dr. Swati Mishra", exp: "15 Years", rating: 4.9, img: "SM", fee: "₹800", nextSlot: "Today, 11:00 AM", clinic: true, department: "pedia" },
    { name: "Dr. Nitin Kumar", exp: "20 Years", rating: 4.7, img: "NK", fee: "₹1000", nextSlot: "Mon, 5:00 PM", clinic: true, department: "pedia" },
    { name: "Dr. Pooja Bajaj", exp: "10 Years", rating: 4.8, img: "PB", fee: "₹700", nextSlot: "Fri, 1:00 PM", clinic: false, department: "pedia" },

    // Opthalmo
    { name: "Dr. Lisa Ray", exp: "14 Years", rating: 4.7, img: "LR", fee: "₹800", nextSlot: "Fri, 10:15 AM", clinic: true, department: "opthalmo" },
    { name: "Dr. Karan Bhatia", exp: "18 Years", rating: 4.8, img: "KB", fee: "₹1000", nextSlot: "Today, 12:00 PM", clinic: true, department: "opthalmo" },
    { name: "Dr. Naveen Jindal", exp: "25 Years", rating: 4.9, img: "NJ", fee: "₹1500", nextSlot: "Tomorrow, 9:30 AM", clinic: false, department: "opthalmo" },
    { name: "Dr. Shilpa Sethi", exp: "12 Years", rating: 4.6, img: "SS", fee: "₹700", nextSlot: "Wed, 4:30 PM", clinic: true, department: "opthalmo" },
    { name: "Dr. Anil Kumble", exp: "20 Years", rating: 4.8, img: "AK", fee: "₹1200", nextSlot: "Today, 6:00 PM", clinic: true, department: "opthalmo" }
  ];

  try {
    const { error: deleteError } = await supabase
      .from('doctors')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (deleteError) {
      console.error("Warning: Error clearing doctors table:", deleteError);
    }

    const { error: insertError } = await supabase
      .from('doctors')
      .insert(DOCTORS);

    if (insertError) throw insertError;
    console.log(`✅ Successfully seeded ${DOCTORS.length} doctors to the 'doctors' table.`);
  } catch (error) {
    console.error('❌ Error seeding doctors:', error);
  }
};