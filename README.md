<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Q-Cars - Premium Car Rental Platform

A modern, premium car rental marketplace built with React, Vite, Supabase, and Google Gemini AI.

**[View Deployment Guide →](DEPLOYMENT.md)**

## Features

- 🚗 Premium car fleet with bilingual support (English/Arabic)
- 🤖 AI-powered car recommendations using Google Gemini
- 💾 Real-time data with Supabase backend
- 📱 Fully responsive, mobile-first design
- 🎨 Modern UI with smooth animations
- 🔒 Secure booking system
- 🌐 Multi-language support

## Quick Start

### Local Development

**Prerequisites:** Node.js 18+

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and add your:
   - Supabase URL and anon key
   - Google Gemini API key

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit http://localhost:3000

### Production Deployment

This application is designed to be deployed on:
- **Backend/Database**: Supabase
- **Frontend Hosting**: Netlify

**[Follow the complete deployment guide →](DEPLOYMENT.md)**

## Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Hosting**: Netlify

## Project Structure

```
q-cars/
├── components/          # React components
├── pages/               # Page components
├── context/             # React Context providers
├── services/            # API services (Gemini)
├── lib/                 # Utilities (Supabase client)
├── supabase/            # Database schema & seed files
├── public/              # Static assets
└── constants.ts         # App constants & configurations
```

## Environment Variables

See [`.env.example`](.env.example) for required environment variables.

## License

© 2024 Q Cars Inc. All rights reserved.

---

**Need help?** Check out [DEPLOYMENT.md](DEPLOYMENT.md) for detailed setup instructions.
