import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_key';

const isPlaceholder = supabaseUrl.includes('placeholder.supabase.co');

// Native Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);

// Intercept queries if using placeholders to prevent ERR_NAME_NOT_RESOLVED
const MOCK_RECORDS = [];
const MOCK_CONSULTATIONS = [];

/**
 * Fetch a patient record with fallback to mock data
 */
export const fetchPatientRecords = async (patientId) => {
  if (isPlaceholder) {
    console.warn("Using placeholder Supabase URL. Returning mock patient records.");
    return [
      { id: 1, name: 'Initial Checkup', date: '2024-03-10', size: '2.4 MB', type: 'PDF', tags: ['CHECKUP', 'GENERAL', 'OLDER'], aiSummary: { brief: 'Standard vitals are normal.' } },
      { id: 2, name: 'Blood Lab Report', date: '2024-04-01', size: '1.1 MB', type: 'IMAGE', tags: ['BLOOD', 'LAB', 'OLDER'], aiSummary: { brief: 'Hemoglobin levels slightly low.' } }
    ];
  }
  try {
    const { data, error } = await supabase
      .from('records')
      .select('*')
      .eq('patientId', patientId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching patient records:", error);
    return [];
  }
};

export const addPatientRecord = async (patientId, recordData) => {
  if (isPlaceholder) {
    return Math.floor(Math.random() * 1000000);
  }
  try {
    const { data, error } = await supabase
      .from('records')
      .insert([{ patientId, ...recordData }])
      .select();
    if (error) throw error;
    return data[0].id;
  } catch (error) {
    console.error("Error adding patient record:", error);
    throw error;
  }
};

export const updateRecordTags = async (recordId, tags) => {
  if (isPlaceholder) return true;
  try {
    const { error } = await supabase
      .from('records')
      .update({ tags })
      .eq('id', recordId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating record tags:", error);
    return false;
  }
};

export const uploadReport = async (file, patientId) => {
  if (isPlaceholder) {
    return URL.createObjectURL(file);
  }
  try {
    const filePath = `reports/${patientId}/${Date.now()}_${file.name}`;
    const { error } = await supabase.storage.from('medivault-bucket').upload(filePath, file);
    if (error) throw error;
    const { data: publicUrlData } = supabase.storage.from('medivault-bucket').getPublicUrl(filePath);
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading report:", error);
    throw error;
  }
};

export const deletePatientRecord = async (recordId, fileURL) => {
  if (isPlaceholder) return;
  try {
    await supabase.from('records').delete().eq('id', recordId);
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

export const fetchConsultations = async (patientId) => {
  if (isPlaceholder) return [];
  try {
    const { data, error } = await supabase.from('consultations').select('*').eq('patientId', patientId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return [];
  }
};

export const addConsultation = async (patientId, consultData) => {
  if (isPlaceholder) return { id: Date.now(), ...consultData };
  try {
    const { data, error } = await supabase.from('consultations').insert([{ patientId, ...consultData }]).select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error adding consultation:", error);
    throw error;
  }
};

export const updatePatient = async (patientId, updates) => {
  if (isPlaceholder) return true;
  try {
    const { error } = await supabase.from('mock_abha_users').update(updates).eq('abhaId', patientId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating patient:", error);
    return false;
  }
};

/**
 * Fetch all records for a patient, optionally filtered by tags (used by doctor UI)
 */
export const fetchPatientRecordsByTags = async (patientId, tags = []) => {
  if (isPlaceholder) {
    const allRecords = await fetchPatientRecords(patientId);
    if (!tags.length) return allRecords;
    return allRecords.filter(r => r.tags && tags.some(t => r.tags.includes(t)));
  }
  try {
    let query = supabase.from('records').select('*').eq('patientId', patientId);
    if (tags.length > 0) {
      query = query.overlaps('tags', tags);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching patient records by tags:", error);
    return [];
  }
};
