<div align="center">
  <h1>MediVault 🏥</h1>
  <p><strong>Next-Generation Patient Portal & Medical Registry System</strong></p>
  <p>
    <a href="https://medivault-ashy.vercel.app/">🚀 <b>Live Demo</b></a> •
    <a href="#-key-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-getting-started">Getting Started</a>
  </p>
</div>

---

MediVault is a cutting-edge patient portal and medical registry system meticulously designed to streamline healthcare access, enhance document management, and empower both patients and healthcare providers. It bridges the gap between doctors and patients through AI-driven insights, secure records, and a premium modern interface.

## 🌟 Key Features

- **🤖 AI-Powered Medical Analysis**: Integrated with **Google Gemini Vision** to analyze uploaded medical documents (PDFs/Images) and automatically generate clinical summaries, key findings, and intelligent tags (e.g., `HEART`, `BLOOD`).
- **⚡ Instant Patient Overviews**: Powered by **Groq API (Llama 3)**, generating lightning-fast, unified medical reports aggregating a patient's entire medical history for doctors.
- **🪪 ABHA & QR Integration**: Seamless connection with mock ABHA (Ayushman Bharat Health Account) IDs, complete with **QR Code Generation and Scanning** for rapid profile retrieval.
- **🌐 Multilingual Support (i18n)**: Fully translated and localized into English, Hindi, Marathi, and Tamil to ensure maximum accessibility across India.
- **👨‍⚕️ Dynamic Doctor Database & Booking**: A comprehensive directory allowing patients to search, filter, and book consultations with medical specialists seamlessly.
- **🔐 Secure Infrastructure**: Built on **Supabase** (PostgreSQL, Auth, and Storage) ensuring strict privacy, robust authentication, and persistent data protection.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4, Framer Motion (Animations), Lucide React (Icons)
- **Routing**: React Router DOM v7
- **Features**: `tesseract.js` (OCR), `html5-qrcode` & `react-qr-code` (QR functionality), `react-i18next` (Translations)

### Backend & AI
- **Database & Storage**: Supabase (PostgreSQL & Supabase Storage)
- **AI Models**: 
  - `@google/genai` (Gemini 2.5 Flash for Vision/Document Analysis)
  - Groq API (Llama-3.3-70b-versatile for rapid text summarization)

## 🚀 Getting Started

To run the MediVault project locally:

### 1. Clone the repository
```bash
git clone https://github.com/Avenger11764/medivault.git
cd medivault
```

### 2. Install dependencies
```bash
# This will install both root and frontend dependencies
npm run install-all
```

### 3. Environment Setup
Create a `.env` file in the `frontend/` directory (or use the one in `supabase/`) and configure your credentials:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI Integration Keys
VITE_GEMINI_API_KEY=your_google_gemini_key
VITE_GROQ_API_KEY=your_groq_api_key
```

### 4. Start the Development Server
```bash
npm run dev
```

## 📜 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page and submit pull requests.

## 📄 License
This project is licensed under the MIT License.
