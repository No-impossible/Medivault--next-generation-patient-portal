# MediVault

MediVault is a comprehensive patient portal and medical registry system designed to streamline healthcare access and document management.

## Features

- **Multilingual Support**: Fully translated into English, Hindi, Marathi, and Tamil using `i18next`.
- **Authentication & Backend**: Powered by Supabase, migrating away from Firebase for robust data persistence and PostgreSQL capabilities.
- **Patient Registry**: Integrates ABHA registry search for easy sign-ups and verification.
- **Consultation Booking**: Dynamic doctor database showcasing diverse medical specialists for users to book appointments.
- **Document Management**: Allows upload of medical reports and documents with AI-driven summarization for clinical insights.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend & Database**: Supabase (PostgreSQL), with Row Level Security (RLS) policies
- **Internationalization**: `i18next`, `react-i18next`

## Getting Started

To run the project locally:

1. Clone the repository.
2. Install dependencies: `npm install`
3. Set up your `.env` file with your Supabase credentials.
4. Start the development server: `npm run dev`
