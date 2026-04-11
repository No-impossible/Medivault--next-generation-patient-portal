# MediVault 🏥

MediVault is a cutting-edge patient portal and medical registry system meticulously designed to streamline healthcare access, enhance document management, and empower both patients and healthcare providers.

## 🌟 Key Features

- **Document Management & AI Summarization**: State-of-the-art medical record management allowing patients to upload diverse document types. Integrated AI-driven summarization generates brief, actionable clinical insights from medical reports to improve clinical efficiency.
- **Multilingual Support (i18n)**: Fully translated and localized into English, Hindi, Marathi, and Tamil to ensure maximum accessibility for a diverse user base.
- **ABHA Patient Registry Integration**: Seamlessly connects with the ABHA (Ayushman Bharat Health Account) registry for verified patient sign-ups, accurate healthcare records, and robust identity verification.
- **Dynamic Doctor Database**: A comprehensive, real-time doctor directory showcasing diverse medical specialists across India with mock data seeding capability.
- **Consultation Booking System**: Intuitive UI for patients to search, filter, and book appointments with the right specialists.
- **Secure Authentication & Backend**: Built on Supabase (PostgreSQL) for reliable data persistence, featuring Row Level Security (RLS) policies for strict privacy and data protection.

## 🛠️ Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React (Icons)
- **Backend & Database**: Supabase (PostgreSQL, Authentication, Realtime)
- **Internationalization**: `i18next`, `react-i18next`
- **Routing**: React Router DOM

## 🚀 Getting Started

To run the MediVault project locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Avenger11764/medivault.git
   cd medivault
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and configure your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```

## 📜 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License
This project is licensed under the MIT License.
