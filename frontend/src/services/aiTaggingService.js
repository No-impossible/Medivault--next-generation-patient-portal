/**
 * AI Tagging Service
 * Analyzes uploaded medical documents and generates meaningful tags
 * based on file name, type, category, and content patterns.
 */

// Tag color mappings for UI display
export const TAG_STYLES = {
  // Specialty tags
  HEART:       { bg: 'bg-red-100 dark:bg-red-900/30',       text: 'text-red-700 dark:text-red-300',       border: 'border-red-200 dark:border-red-800'       },
  EYE:         { bg: 'bg-blue-100 dark:bg-blue-900/30',      text: 'text-blue-700 dark:text-blue-300',      border: 'border-blue-200 dark:border-blue-800'      },
  BLOOD:       { bg: 'bg-rose-100 dark:bg-rose-900/30',      text: 'text-rose-700 dark:text-rose-300',      border: 'border-rose-200 dark:border-rose-800'      },
  BONE:        { bg: 'bg-amber-100 dark:bg-amber-900/30',    text: 'text-amber-700 dark:text-amber-300',    border: 'border-amber-200 dark:border-amber-800'    },
  BRAIN:       { bg: 'bg-purple-100 dark:bg-purple-900/30',  text: 'text-purple-700 dark:text-purple-300',  border: 'border-purple-200 dark:border-purple-800'  },
  LUNG:        { bg: 'bg-cyan-100 dark:bg-cyan-900/30',      text: 'text-cyan-700 dark:text-cyan-300',      border: 'border-cyan-200 dark:border-cyan-800'      },
  KIDNEY:      { bg: 'bg-orange-100 dark:bg-orange-900/30',  text: 'text-orange-700 dark:text-orange-300',  border: 'border-orange-200 dark:border-orange-800'  },
  LIVER:       { bg: 'bg-yellow-100 dark:bg-yellow-900/30',  text: 'text-yellow-700 dark:text-yellow-300',  border: 'border-yellow-200 dark:border-yellow-800'  },
  DENTAL:      { bg: 'bg-teal-100 dark:bg-teal-900/30',     text: 'text-teal-700 dark:text-teal-300',     border: 'border-teal-200 dark:border-teal-800'     },
  SKIN:        { bg: 'bg-pink-100 dark:bg-pink-900/30',      text: 'text-pink-700 dark:text-pink-300',      border: 'border-pink-200 dark:border-pink-800'      },
  // Report type tags
  XRAY:        { bg: 'bg-slate-100 dark:bg-slate-800',       text: 'text-slate-700 dark:text-slate-300',    border: 'border-slate-200 dark:border-slate-700'    },
  SCAN:        { bg: 'bg-indigo-100 dark:bg-indigo-900/30',  text: 'text-indigo-700 dark:text-indigo-300',  border: 'border-indigo-200 dark:border-indigo-800'  },
  PRESCRIPTION:{ bg: 'bg-violet-100 dark:bg-violet-900/30',  text: 'text-violet-700 dark:text-violet-300',  border: 'border-violet-200 dark:border-violet-800'  },
  LAB:         { bg: 'bg-emerald-100 dark:bg-emerald-900/30',text: 'text-emerald-700 dark:text-emerald-300',border: 'border-emerald-200 dark:border-emerald-800' },
  REPORT:      { bg: 'bg-green-100 dark:bg-green-900/30',    text: 'text-green-700 dark:text-green-300',    border: 'border-green-200 dark:border-green-800'    },
  CHECKUP:     { bg: 'bg-lime-100 dark:bg-lime-900/30',      text: 'text-lime-700 dark:text-lime-300',      border: 'border-lime-200 dark:border-lime-800'      },
  VACCINE:     { bg: 'bg-sky-100 dark:bg-sky-900/30',        text: 'text-sky-700 dark:text-sky-300',        border: 'border-sky-200 dark:border-sky-800'        },
  SURGERY:     { bg: 'bg-red-200 dark:bg-red-900/50',        text: 'text-red-800 dark:text-red-200',        border: 'border-red-300 dark:border-red-700'        },
  DIABETES:    { bg: 'bg-orange-100 dark:bg-orange-900/30',  text: 'text-orange-700 dark:text-orange-300',  border: 'border-orange-200 dark:border-orange-800'  },
  GENERAL:     { bg: 'bg-slate-100 dark:bg-slate-800',       text: 'text-slate-600 dark:text-slate-400',    border: 'border-slate-200 dark:border-slate-700'    },
  // Temporal tags
  RECENT:      { bg: 'bg-green-100 dark:bg-green-900/30',    text: 'text-green-700 dark:text-green-300',    border: 'border-green-200 dark:border-green-800'    },
  THIS_MONTH:  { bg: 'bg-blue-100 dark:bg-blue-900/30',      text: 'text-blue-700 dark:text-blue-300',      border: 'border-blue-200 dark:border-blue-800'      },
  OLDER:       { bg: 'bg-gray-100 dark:bg-gray-800',         text: 'text-gray-600 dark:text-gray-400',      border: 'border-gray-200 dark:border-gray-700'      },
  // Urgency tags
  CRITICAL:    { bg: 'bg-red-200 dark:bg-red-900/60',        text: 'text-red-800 dark:text-red-200',        border: 'border-red-400 dark:border-red-700'        },
  NORMAL:      { bg: 'bg-green-100 dark:bg-green-900/30',    text: 'text-green-700 dark:text-green-300',    border: 'border-green-200 dark:border-green-800'    },
  // File type tags
  IMAGE:       { bg: 'bg-blue-50 dark:bg-blue-900/20',       text: 'text-blue-600 dark:text-blue-400',      border: 'border-blue-100 dark:border-blue-900'      },
  PDF:         { bg: 'bg-red-50 dark:bg-red-900/20',         text: 'text-red-600 dark:text-red-400',        border: 'border-red-100 dark:border-red-900'        },
};

// Keyword-to-tag mapping for AI analysis
const TAG_KEYWORD_MAP = [
  // Cardiology / Heart
  { tag: 'HEART',       keywords: ['heart', 'cardio', 'ecg', 'ekg', 'echo', 'angiogram', 'angiography', 'holter', 'cardiac', 'coronary', 'artery', 'ventricle', 'atrium', 'bp', 'blood pressure', 'hypertension', 'cholesterol', 'lipid'] },
  // Ophthalmology / Eye
  { tag: 'EYE',         keywords: ['eye', 'ocular', 'vision', 'opthal', 'ophthal', 'retina', 'cornea', 'glaucoma', 'cataract', 'optic', 'fundus', 'slit lamp', 'visual acuity', 'refraction'] },
  // Hematology / Blood
  { tag: 'BLOOD',       keywords: ['blood', 'cbc', 'hemoglobin', 'hematology', 'rbc', 'wbc', 'platelet', 'hba1c', 'haematology', 'coagulation', 'bleeding', 'clotting', 'iron', 'ferritin', 'esr', 'crp'] },
  // Orthopedics / Bone
  { tag: 'BONE',        keywords: ['bone', 'fracture', 'ortho', 'xray', 'x-ray', 'mri', 'joint', 'spine', 'ligament', 'tendon', 'arthritis', 'osteoporosis', 'calcium', 'skeletal', 'hip', 'knee', 'shoulder'] },
  // Neurology / Brain
  { tag: 'BRAIN',       keywords: ['brain', 'neuro', 'mri brain', 'ct scan head', 'seizure', 'epilepsy', 'stroke', 'eeg', 'headache', 'migraine', 'alzheimer', 'parkinson', 'nerve', 'spinal'] },
  // Pulmonology / Lung
  { tag: 'LUNG',        keywords: ['lung', 'pulmonary', 'respiratory', 'chest', 'spirometry', 'asthma', 'bronchitis', 'pneumonia', 'tuberculosis', 'tb', 'copd', 'oxygen', 'sputum', 'pfts'] },
  // Nephrology / Kidney
  { tag: 'KIDNEY',      keywords: ['kidney', 'renal', 'nephro', 'urine', 'creatinine', 'urea', 'bun', 'dialysis', 'gfr', 'proteinuria', 'urinalysis', 'uti', 'urinary'] },
  // Hepatology / Liver
  { tag: 'LIVER',       keywords: ['liver', 'hepatic', 'hepato', 'bilirubin', 'alt', 'ast', 'sgot', 'sgpt', 'jaundice', 'cirrhosis', 'hepatitis', 'ggt', 'albumin', 'lft'] },
  // Dental
  { tag: 'DENTAL',      keywords: ['dental', 'teeth', 'tooth', 'oral', 'gum', 'root canal', 'cavity', 'braces', 'orthodontic', 'periapical', 'panoramic'] },
  // Dermatology / Skin
  { tag: 'SKIN',        keywords: ['skin', 'derma', 'rash', 'acne', 'eczema', 'psoriasis', 'biopsy', 'allergy', 'patch test', 'lesion'] },
  // Endocrinology / Diabetes
  { tag: 'DIABETES',    keywords: ['diabetes', 'insulin', 'glucose', 'sugar', 'thyroid', 'tsh', 't3', 't4', 'endocrine', 'hormones', 'hba1c'] },
  // Radiology / Scan
  { tag: 'SCAN',        keywords: ['ct scan', 'mri', 'ultrasound', 'usg', 'pet scan', 'sonography', 'doppler', 'mammography', 'dexa'] },
  // Prescription
  { tag: 'PRESCRIPTION',keywords: ['prescription', 'rx', 'medication', 'medicine', 'tablet', 'capsule', 'dosage', 'dose', 'drug', 'pharmacy'] },
  // Surgery
  { tag: 'SURGERY',     keywords: ['surgery', 'operation', 'operative', 'post op', 'pre op', 'surgical', 'anesthesia', 'laparoscopy', 'discharge summary'] },
  // Vaccine
  { tag: 'VACCINE',     keywords: ['vaccine', 'vaccination', 'immunization', 'covid', 'booster', 'flu shot', 'tetanus'] },
  // General checkup
  { tag: 'CHECKUP',     keywords: ['checkup', 'check-up', 'annual', 'routine', 'physical', 'wellness', 'preventive', 'general health'] },
  // Lab report
  { tag: 'LAB',         keywords: ['lab', 'laboratory', 'pathology', 'test report', 'panel', 'assay'] },
  // XRAY
  { tag: 'XRAY',        keywords: ['xray', 'x-ray', 'radiograph', 'radiograph'] },
];

// Category-to-tag shortcut mapping
const CATEGORY_TAG_MAP = {
  'Cardiology (Heart)':      ['HEART'],
  'Ophthalmology (Eye)':     ['EYE'],
  'Laboratory (Blood/Tests)': ['BLOOD', 'LAB'],
  'Radiology (X-Ray/Scan)':  ['XRAY', 'SCAN'],
  'Orthopedics (Bones)':     ['BONE'],
  'Prescription':            ['PRESCRIPTION'],
  'General':                 ['CHECKUP'],
};

/**
 * Generates a temporal tag based on the upload date
 */
const getTemporalTag = (uploadDate = new Date()) => {
  const now = new Date();
  const date = new Date(uploadDate);
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7)  return 'RECENT';
  if (diffDays <= 30) return 'THIS_MONTH';
  return 'OLDER';
};

/**
 * Generates file type tag
 */
const getFileTypeTag = (fileType = '') => {
  if (fileType.includes('image')) return 'IMAGE';
  if (fileType.includes('pdf'))   return 'PDF';
  return null;
};

/**
 * Main AI tagging function
 * Analyzes filename, category, file type and returns a deduplicated array of tag strings
 */
export const generateAITags = ({ fileName = '', category = 'General', fileType = '', uploadDate = new Date() }) => {
  const tags = new Set();
  const combined = `${fileName} ${category}`.toLowerCase();

  // Match keywords to tags
  for (const { tag, keywords } of TAG_KEYWORD_MAP) {
    if (keywords.some(kw => combined.includes(kw))) {
      tags.add(tag);
    }
  }

  // Add category-based tags
  const categoryTags = CATEGORY_TAG_MAP[category] || [];
  categoryTags.forEach(t => tags.add(t));

  // Add file type tag
  const fileTypeTag = getFileTypeTag(fileType);
  if (fileTypeTag) tags.add(fileTypeTag);

  // Add temporal tag
  tags.add(getTemporalTag(uploadDate));

  // Fallback: if no medical specialty tag found, add GENERAL
  const medicalTags = ['HEART','EYE','BLOOD','BONE','BRAIN','LUNG','KIDNEY','LIVER','DENTAL','SKIN','DIABETES'];
  const hasMedicalTag = medicalTags.some(t => tags.has(t));
  if (!hasMedicalTag) tags.add('GENERAL');

  return Array.from(tags);
};

/**
 * Gets the display style for a tag
 */
export const getTagStyle = (tag) => {
  return TAG_STYLES[tag] || TAG_STYLES['GENERAL'];
};

/**
 * Updates temporal tags on existing records (call this when loading records)
 * Changes "THIS_MONTH" or "RECENT" to "OLDER" if enough time has passed
 */
export const refreshTemporalTags = (records) => {
  return records.map(record => {
    if (!record.tags || record.tags.length === 0) return record;
    const temporalTags = ['RECENT', 'THIS_MONTH', 'OLDER'];
    const nonTemporalTags = record.tags.filter(t => !temporalTags.includes(t));
    const freshTemporalTag = getTemporalTag(record.uploadedAt || record.date);
    return {
      ...record,
      tags: [...nonTemporalTags, freshTemporalTag]
    };
  });
};

export default generateAITags;
