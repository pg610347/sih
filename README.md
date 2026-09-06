# 🪔 Smaran (स्मरण)
### Dementia Care & Cognitive Wellness Platform

**Smaran** (*स्मरण* — Sanskrit & Hindi for *remembrance, mindful memory, and gentle recall*) is an accessible, failure-free digital care companion designed to support elderly individuals living with Alzheimer's disease, mild cognitive impairment (MCI), and dementia, alongside their families and clinicians.

---

## 🌟 Key Features

### 1. 👵 Patient Care Companion
- **Multilingual Native Language Support**:
  - Full support across **8 languages**: English, Assamese (অসমীয়া), Bengali (বাংলা), Hindi (हिंदी), Bhojpuri (भोजपुरी), Konkani (कोंकणी), Manipuri (মেইতেই), and Khasi.
- **Multilingual Music Therapy & Sing-Along Jukebox**:
  - 50+ classic regional and folk songs with synchronized multi-verse lyrics, Roman transliteration, and English meanings.
  - *Twinkle Twinkle Little Star* culturally adapted into all 8 languages.
  - **Embedded YouTube Video Player**: Listen to authentic recordings or paste custom YouTube URLs on the fly.
  - **Angry Birds Theme Songs**: Includes the original high-energy theme by Ari Pulkkinen, the London Philharmonic Orchestra symphonic edition, and the remastered studio version with whistle lyrics and Web Audio marimba notes.
- **Accessible Cognitive Brain Games**:
  - **🃏 Memory Pairs**: 3 difficulty levels (2, 3, 4 pairs) with a "💡 Peek Cards" lifeline to eliminate cognitive fatigue, moves counter, and gentle chime sound effects.
  - **🧺 Kitchen or Field (Category Sort)**: 16 regional household and outdoor objects with streaks and gentle clues.
  - **🔄 What Comes Next (Pattern Recognition)**: 12 rhythm sequences with glowing animated slots and clue assistance.
  - **📋 Put in Order (Step Sequence Game)**: 8 daily routines (Morning Chai, Diya Puja, Cooking Rice, Grinding Spices on Silbatta, Tulsi Altar, Festive Thali Meal, Weaving Gamosa, Bedtime Routine) with a dedicated **"↩ Undo Last Step"** button.
  - **🌍 Reality Orientation**: Real-time dynamic day of the week, time of day, and current month awareness questions with compassionate, non-punitive affirmation.
  - **🖼️ Reminiscence Therapy ("Remember This")**: Displays cultural treasures with a **"🔊 Listen"** button so Devi warmly narrates stories and sensory cues aloud.
- **🌸 AI Companion (Devi / Arjun / Saathi)**:
  - Powered by Gemini with culturally grounded personas, conversational voice interaction, and natural speech synthesis.

### 2. 🤝 Caregiver Dashboard
- Real-time **SOS emergency alerts** from the patient with timestamp and resolution workflow.
- Daily diary logs and emotional mood tracker.
- Medication adherence checklists (Donepezil, Memantine, Vitamins).
- Activity and cognitive engagement breakdown.
- Secure chat connection with treating physicians.

### 3. 🩺 Clinical / Doctor Portal
- Multi-patient cognitive monitoring and risk stratification.
- Longitudinal engagement score trends (8-week progress graphs).
- Diary emotional sentiment analysis.
- Regional health insights across Northeast India and broader regions.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 5.7, Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`)
- **Sensory & Audio**: Web Audio API (custom synthesizers & chimes), Web Speech API (`SpeechSynthesis`)
- **Backend & Database**: Vercel Serverless Functions (`api/login.ts`, `api/register.ts`, `api/init-db.ts`), PostgreSQL (`@vercel/postgres`, Neon Serverless)
- **AI**: Google Gemini API (`gemini-3.5-flash`, `gemini-3.8-flash`)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm or npm

### Installation & Development
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev

# Type check
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 📄 License
MIT License. Dedicated to the health, dignity, and joyful memories of our elders.
