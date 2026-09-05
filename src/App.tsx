import { useState } from 'react'
import { type Language, LANG_STORAGE_KEY } from './i18n'
import LanguageSelectView from './views/LanguageSelectView'
import HomeView from './views/HomeView'
import PatientView from './views/PatientView'
import CaregiverView from './views/CaregiverView'
import DoctorView from './views/DoctorView'

export type { Language }
export type Role = 'patient' | 'caregiver' | 'doctor'

export const LANGS: Record<Language, { name: string; nativeName: string; greeting: string; script: string }> = {
  english:  { name: 'English',   nativeName: 'English',         greeting: 'Hello',    script: 'latin'      },
  assamese: { name: 'Assamese',  nativeName: 'অসমীয়া',        greeting: 'নমস্কাৰ', script: 'brahmic'    },
  bengali:  { name: 'Bengali',   nativeName: 'বাংলা',           greeting: 'নমস্কার', script: 'brahmic'    },
  hindi:    { name: 'Hindi',     nativeName: 'हिंदी',            greeting: 'नमस्ते',  script: 'devanagari' },
  manipuri: { name: 'Manipuri',  nativeName: 'মেইতেই',          greeting: 'নমস্কার', script: 'brahmic'    },
  khasi:    { name: 'Khasi',     nativeName: 'Ka Ktien Khasi',  greeting: 'Khublei',  script: 'latin'      },
}

type AppView = 'language' | 'role'

function getSavedLanguage(): Language {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY)
    if (saved && saved in LANGS) return saved as Language
  } catch { /* ignore */ }
  return 'english'
}

function saveLanguage(lang: Language) {
  try { localStorage.setItem(LANG_STORAGE_KEY, lang) } catch { /* ignore */ }
}

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    try { return localStorage.getItem(LANG_STORAGE_KEY) ? 'role' : 'language' }
    catch { return 'language' }
  })
  const [role, setRole] = useState<Role | null>(null)
  const [language, setLanguage] = useState<Language>(getSavedLanguage)

  const handleLanguageSelect = (l: Language) => setLanguage(l)

  const handleLanguageContinue = () => {
    saveLanguage(language)
    setView('role')
  }

  const handleChangeLanguage = (l: Language) => {
    setLanguage(l)
    saveLanguage(l)
  }

  if (view === 'language') {
    return (
      <LanguageSelectView
        current={language}
        onSelect={handleLanguageSelect}
        onContinue={handleLanguageContinue}
      />
    )
  }

  if (!role) {
    return (
      <HomeView
        language={language}
        onSelectRole={setRole}
        onChangeLanguage={() => setView('language')}
      />
    )
  }
  if (role === 'patient') {
    return (
      <PatientView
        language={language}
        onChangeLanguage={handleChangeLanguage}
        onBack={() => setRole(null)}
      />
    )
  }
  if (role === 'caregiver') return <CaregiverView onBack={() => setRole(null)} />
  return <DoctorView onBack={() => setRole(null)} />
}
