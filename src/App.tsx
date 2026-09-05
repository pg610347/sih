import { useState } from 'react'
import { type Language, LANG_STORAGE_KEY } from './i18n'
import LanguageSelectView from './views/LanguageSelectView'
import HomeView from './views/HomeView'
import LoginView, { type UserProfile } from './views/LoginView'
import WelcomeView from './views/WelcomeView'
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
  bhojpuri: { name: 'Bhojpuri',  nativeName: 'भोजपुरी',        greeting: 'प्रणाम',   script: 'devanagari' },
  konkani:  { name: 'Konkani',   nativeName: 'कोंकणी',         greeting: 'नमस्कार', script: 'devanagari' },
}

// Persistence keys
const AUTH_KEY = 'nercare_auth_v1'

type AppView = 'language' | 'role' | 'login' | 'welcome' | 'app'

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

export interface AuthState {
  role: Role
  name: string
  userId?: string
  language?: Language
  region?: string
}

function getSavedAuth(): AuthState | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && parsed.role && parsed.name) return parsed as AuthState
  } catch { /* ignore */ }
  return null
}

function saveAuth(state: AuthState) {
  try { localStorage.setItem(AUTH_KEY, JSON.stringify(state)) } catch { /* ignore */ }
}

function clearAuth() {
  try { localStorage.removeItem(AUTH_KEY) } catch { /* ignore */ }
}

// ─── Initial view logic ─────────────────────────────────────────────────────

function getInitialView(): AppView {
  try {
    // If user has a remembered session, go straight to login
    const hasLang = !!localStorage.getItem(LANG_STORAGE_KEY)
    const hasRemember = localStorage.getItem('nercare_remember') === 'true'
    if (hasLang && hasRemember) return 'login'
    if (hasLang) return 'role'
  } catch { /* ignore */ }
  return 'language'
}

function getInitialRole(): Role | null {
  try {
    const auth = getSavedAuth()
    if (auth) return auth.role
  } catch { /* ignore */ }
  return null
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const initialAuth = getSavedAuth()
  const [view, setView] = useState<AppView>(getInitialView)
  const [role, setRole] = useState<Role | null>(initialAuth ? initialAuth.role : getInitialRole)
  const [language, setLanguage] = useState<Language>(() => {
    if (initialAuth?.language && initialAuth.language in LANGS) return initialAuth.language
    return getSavedLanguage()
  })
  const [userName, setUserName] = useState<string>(initialAuth ? initialAuth.name : '')

  // ─── Language selection handlers ───

  const handleLanguageSelect = (l: Language) => setLanguage(l)

  const handleLanguageContinue = () => {
    saveLanguage(language)
    setView('role')
  }

  const handleChangeLanguage = (l: Language) => {
    setLanguage(l)
    saveLanguage(l)
  }

  // ─── Role selection handler ───

  const handleSelectRole = (r: Role) => {
    setRole(r)
    setView('login')
  }

  // ─── Login handler ───

  const handleLogin = (profile: UserProfile | string) => {
    const userProfile: UserProfile = typeof profile === 'string'
      ? { name: profile, role: role || 'patient' }
      : profile

    setUserName(userProfile.name)
    if (userProfile.role) setRole(userProfile.role)
    if (userProfile.language && userProfile.language in LANGS) {
      setLanguage(userProfile.language)
      saveLanguage(userProfile.language)
    }

    saveAuth({
      role: userProfile.role || role || 'patient',
      name: userProfile.name,
      userId: userProfile.userId,
      language: userProfile.language,
      region: userProfile.region,
    })

    setView('welcome')
  }

  // ─── Welcome → Dashboard ───

  const handleWelcomeContinue = () => {
    setView('app')
  }

  // ─── Back / logout handlers ───

  const handleBackToRole = () => {
    setRole(null)
    clearAuth()
    setView('role')
  }

  const handleLogout = () => {
    setRole(null)
    setUserName('')
    clearAuth()
    setView('role')
  }

  // ─── View rendering ───

  if (view === 'language') {
    return (
      <LanguageSelectView
        current={language}
        onSelect={handleLanguageSelect}
        onContinue={handleLanguageContinue}
      />
    )
  }

  if (view === 'role' || (view === 'login' && !role)) {
    return (
      <HomeView
        language={language}
        onSelectRole={handleSelectRole}
        onChangeLanguage={() => setView('language')}
      />
    )
  }

  if (view === 'login' && role) {
    return (
      <LoginView
        role={role}
        language={language}
        onLogin={handleLogin}
        onBack={handleBackToRole}
        onChangeLanguage={() => setView('language')}
      />
    )
  }

  if (view === 'welcome' && role) {
    return (
      <WelcomeView
        role={role}
        name={userName}
        onContinue={handleWelcomeContinue}
      />
    )
  }

  // ─── Authenticated dashboard views ───

  if (role === 'patient') {
    return (
      <PatientView
        language={language}
        onChangeLanguage={handleChangeLanguage}
        onBack={handleLogout}
        userName={userName}
      />
    )
  }
  if (role === 'caregiver') return <CaregiverView onBack={handleLogout} userName={userName} />
  return <DoctorView onBack={handleLogout} userName={userName} />
}
