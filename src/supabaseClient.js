import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Example: Get all records for a specific patient
export const fetchPatientRecords = async (patientId) => {
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
  try {
    const { data, error } = await supabase
      .from('records')
      .insert([{ patientId, ...recordData }])
      .select();
    if (error) throw error;
    // Assuming the table 'records' has an auto-increment or UUID 'id' column
    return data[0].id;
  } catch (error) {
    console.error("Error adding patient record:", error);
    throw error;
  }
};

// Example: Upload file to Supabase Storage
export const uploadReport = async (file, patientId) => {
  try {
    // Note: ensure 'medivault-bucket' bucket exists and is public in Supabase Storage!
    const filePath = `reports/${patientId}/${Date.now()}_${file.name}`;
    
    const { error } = await supabase.storage
      .from('medivault-bucket')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
      
    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('medivault-bucket')
      .getPublicUrl(filePath);
      
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error("Error uploading report:", error);
    throw error;
  }
};

export const deletePatientRecord = async (recordId, fileURL) => {
  try {
    // 1. Delete from table
    const { error: dbError } = await supabase
      .from('records')
      .delete()
      .eq('id', recordId);
      
    if (dbError) throw dbError;
    
    // 2. Delete from storage if it exists
    if (fileURL && fileURL.includes('medivault-bucket')) {
      const pathParts = fileURL.split('/medivault-bucket/');
      if (pathParts.length > 1) {
        const filePath = pathParts[1];
        const { error: storageError } = await supabase.storage
          .from('medivault-bucket')
          .remove([filePath]);
          
        if (storageError) {
          console.error("Warning: Failed to delete file physically from storage:", storageError);
        }
      }
    }
  } catch (error) {
    console.error("Error deleting record:", error);
    throw error;
  }
};

export const fetchConsultations = async (patientId) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('patientId', patientId);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching consultations:", error);
    return [];
  }
};

export const addConsultation = async (patientId, consultData) => {
  try {
    const { data, error } = await supabase
      .from('consultations')
      .insert([{ patientId, ...consultData }])
      .select();
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error adding consultation:", error);
    throw error;
  }
};

export const updatePatient = async (patientId, updates) => {
  try {
    const { data, error } = await supabase
      .from('mock_abha_users')
      .update(updates)
      .eq('abhaId', patientId);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating patient:", error);
    return false;
  }
};
