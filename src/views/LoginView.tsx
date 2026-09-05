import { useState, useEffect } from 'react'
import type { Role, Language } from '../App'
import { LANGS } from '../App'

export interface UserProfile {
  name: string
  role: Role
  userId?: string
  language?: Language
  region?: string
}

interface LoginViewProps {
  role: Role
  language: Language
  onLogin: (profile: UserProfile) => void
  onBack: () => void
  onChangeLanguage: () => void
}

const DEMO_ACCOUNTS: Record<Role, { userId: string; password: string; name: string }> = {
  patient: { userId: 'P001', password: 'care123', name: 'Priya' },
  caregiver: { userId: 'C001', password: 'care123', name: 'Anjali' },
  doctor: { userId: 'D001', password: 'care123', name: 'Dr. Sharma' },
}

export default function LoginView({ role: initialRole, language: currentLanguage, onLogin, onBack, onChangeLanguage }: LoginViewProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [selectedRole, setSelectedRole] = useState<Role>(initialRole)

  // Sign In fields
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)

  // Sign Up fields
  const [name, setName] = useState('')
  const [signupUserId, setSignupUserId] = useState('')
  const [signupPassword, setSignupPassword] = useState('')
  const [preferredLang, setPreferredLang] = useState<Language>(currentLanguage)
  const [region, setRegion] = useState('Assam')

  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    const savedRemember = localStorage.getItem('nercare_remember') === 'true'
    setRemember(savedRemember)
    if (savedRemember) {
      const savedUser = localStorage.getItem('nercare_last_user')
      if (savedUser) setUserId(savedUser)
    }
  }, [])

  // Auto-fill demo credentials
  const fillDemo = (r: Role) => {
    setSelectedRole(r)
    setUserId(DEMO_ACCOUNTS[r].userId)
    setPassword(DEMO_ACCOUNTS[r].password)
    setErrorMsg(null)
  }

  // Handle Sign In
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, role: selectedRole }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        if (remember) {
          localStorage.setItem('nercare_remember', 'true')
          localStorage.setItem('nercare_last_user', userId)
        } else {
          localStorage.removeItem('nercare_remember')
          localStorage.removeItem('nercare_last_user')
        }

        const profile: UserProfile = {
          name: data.user?.name || data.name || DEMO_ACCOUNTS[selectedRole].name,
          role: data.user?.role || selectedRole,
          userId: data.user?.userId || userId,
          language: data.user?.language as Language || currentLanguage,
          region: data.user?.region || 'Assam',
        }
        onLogin(profile)
        return
      }

      if (res.status === 401) {
        setErrorMsg(data.error || 'Invalid User ID or password. Please try again.')
        setLoading(false)
        return
      }

      // Offline / local fallback for demo credentials
      const demoAccount = DEMO_ACCOUNTS[selectedRole]
      if (userId.trim().toUpperCase() === demoAccount.userId && password === demoAccount.password) {
        if (remember) {
          localStorage.setItem('nercare_remember', 'true')
          localStorage.setItem('nercare_last_user', userId)
        }
        onLogin({
          name: demoAccount.name,
          role: selectedRole,
          userId: demoAccount.userId,
          language: selectedRole === 'patient' ? 'assamese' : 'english',
          region: 'Assam',
        })
        return
      }

      setErrorMsg(data.error || 'Sign in failed. Please check your credentials.')
      setLoading(false)
    } catch (err: any) {
      console.warn('Network error during login, attempting local validation:', err)
      const demoAccount = DEMO_ACCOUNTS[selectedRole]
      if (userId.trim().toUpperCase() === demoAccount.userId && password === demoAccount.password) {
        if (remember) {
          localStorage.setItem('nercare_remember', 'true')
          localStorage.setItem('nercare_last_user', userId)
        }
        onLogin({
          name: demoAccount.name,
          role: selectedRole,
          userId: demoAccount.userId,
          language: selectedRole === 'patient' ? 'assamese' : 'english',
          region: 'Assam',
        })
      } else {
        setErrorMsg('Unable to connect to server. Please try demo accounts or check your connection.')
        setLoading(false)
      }
    }
  }

  // Handle Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg(null)

    if (!name.trim() || !signupUserId.trim() || !signupPassword.trim()) {
      setErrorMsg('Please fill in all required fields.')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          userId: signupUserId.trim(),
          password: signupPassword,
          role: selectedRole,
          language: preferredLang,
          region: region.trim() || 'Assam',
        }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok && data.success) {
        setSuccessMsg('Account created successfully! Signing you in...')
        setTimeout(() => {
          onLogin({
            name: data.user.name,
            role: data.user.role,
            userId: data.user.userId,
            language: data.user.language as Language,
            region: data.user.region,
          })
        }, 800)
        return
      }

      setErrorMsg(data.error || 'Failed to create account. Please try a different User ID.')
      setLoading(false)
    } catch (err: any) {
      console.warn('Network error during signup, creating local profile:', err)
      // Local fallback if database is not reachable
      const profile: UserProfile = {
        name: name.trim(),
        role: selectedRole,
        userId: signupUserId.trim(),
        language: preferredLang,
        region: region.trim() || 'Assam',
      }
      setSuccessMsg('Account created locally! Welcome aboard...')
      setTimeout(() => {
        onLogin(profile)
      }, 800)
    }
  }

  const roleLabels: Record<Role, string> = {
    patient: 'Patient',
    caregiver: 'Caregiver',
    doctor: 'Doctor',
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col p-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="text-[#1A1A1A] p-2 -ml-2 rounded-lg hover:bg-[#F9F8F6] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
          aria-label="Go back"
        >
          ← Back
        </button>
        <button 
          onClick={onChangeLanguage}
          className="text-[#0F6E56] font-medium p-2 rounded-lg hover:bg-[#F9F8F6] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
        >
          Change Language
        </button>
      </div>

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full pb-10">
        {/* Header Branding */}
        <div className="text-center mb-6">
          <div className="text-4xl mb-3" aria-hidden="true">🪔</div>
          <h1 className="text-3xl font-bold text-[#1A1A1A] mb-1">NerCare</h1>
          <p className="text-base text-[#5F5E5A]">
            Dementia Care & Cognitive Wellness for Northeast India
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="bg-[#F3F1EC] p-1.5 rounded-2xl flex gap-1 mb-6 border border-[#E5E3DC]">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); setSuccessMsg(null) }}
            className={`flex-1 py-3 rounded-xl font-bold text-base transition-all ${
              mode === 'signin'
                ? 'bg-[#FFFFFF] text-[#0F6E56] shadow-sm'
                : 'text-[#5F5E5A] hover:text-[#1A1A1A]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); setSuccessMsg(null) }}
            className={`flex-1 py-3 rounded-xl font-bold text-base transition-all ${
              mode === 'signup'
                ? 'bg-[#FFFFFF] text-[#0F6E56] shadow-sm'
                : 'text-[#5F5E5A] hover:text-[#1A1A1A]'
            }`}
          >
            Create Account ✨
          </button>
        </div>

        {/* Role Selector Badges */}
        <div className="mb-6">
          <p className="text-xs font-bold text-[#5F5E5A] uppercase tracking-wider mb-2">Select Your Role</p>
          <div className="grid grid-cols-3 gap-2">
            {(['patient', 'caregiver', 'doctor'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setSelectedRole(r)}
                className={`py-2.5 px-2 rounded-xl text-sm font-semibold border-2 transition-all capitalize ${
                  selectedRole === r
                    ? 'border-[#0F6E56] bg-[#0F6E56]/10 text-[#0F6E56]'
                    : 'border-[#D3D1C7] bg-[#FFFFFF] text-[#5F5E5A] hover:border-[#0F6E56]/40'
                }`}
              >
                {r === 'patient' && '👵 '}
                {r === 'caregiver' && '🤝 '}
                {r === 'doctor' && '🩺 '}
                {roleLabels[r]}
              </button>
            ))}
          </div>
        </div>

        {/* Alerts */}
        {errorMsg && (
          <div className="mb-5 bg-[#BA7517]/10 border border-[#BA7517]/30 rounded-xl p-4 flex items-start gap-3 animate-fadeUp">
            <span className="text-xl shrink-0" aria-hidden="true">⚠️</span>
            <p className="text-[#1A1A1A] text-sm mt-0.5">{errorMsg}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 bg-[#0F6E56]/10 border border-[#0F6E56]/30 rounded-xl p-4 flex items-start gap-3 animate-fadeUp">
            <span className="text-xl shrink-0" aria-hidden="true">✅</span>
            <p className="text-[#0F6E56] font-medium text-sm mt-0.5">{successMsg}</p>
          </div>
        )}

        {/* ── MODE: SIGN IN ──────────────────────────────────────────────── */}
        {mode === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                User ID / Username
              </label>
              <input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="e.g. P001 or your username"
                className="w-full h-12 px-4 rounded-xl border-2 border-[#D3D1C7] text-base text-[#1A1A1A] placeholder-[#5F5E5A]/50 bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-[#D3D1C7] text-base text-[#1A1A1A] placeholder-[#5F5E5A]/50 bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded text-xl text-[#5F5E5A] hover:bg-[#F9F8F6] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-[#D3D1C7] text-[#0F6E56] focus:ring-[#0F6E56] accent-[#0F6E56]"
              />
              <label htmlFor="remember" className="ml-2.5 text-sm text-[#1A1A1A]">
                Remember this device
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 mt-6 bg-[#0F6E56] text-[#FFFFFF] font-semibold text-lg rounded-xl flex items-center justify-center hover:bg-[#0F6E56]/90 focus:outline-none focus:ring-4 focus:ring-[#0F6E56]/30 disabled:opacity-70 transition-colors shadow-sm"
            >
              {loading ? (
                <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                `Sign In as ${roleLabels[selectedRole]}`
              )}
            </button>

            {/* Quick Demo Fillers */}
            <div className="pt-6 border-t border-[#E5E3DC] mt-6">
              <p className="text-xs font-bold text-[#5F5E5A] uppercase tracking-wider mb-2 text-center">
                Or Use Demo Accounts
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  type="button"
                  onClick={() => fillDemo('patient')}
                  className="px-3 py-1.5 rounded-lg bg-[#F9F8F6] border border-[#D3D1C7] text-xs font-semibold text-[#1A1A1A] hover:border-[#0F6E56]"
                >
                  👵 Priya (P001)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('caregiver')}
                  className="px-3 py-1.5 rounded-lg bg-[#F9F8F6] border border-[#D3D1C7] text-xs font-semibold text-[#1A1A1A] hover:border-[#0F6E56]"
                >
                  🤝 Anjali (C001)
                </button>
                <button
                  type="button"
                  onClick={() => fillDemo('doctor')}
                  className="px-3 py-1.5 rounded-lg bg-[#F9F8F6] border border-[#D3D1C7] text-xs font-semibold text-[#1A1A1A] hover:border-[#0F6E56]"
                >
                  🩺 Dr. Sharma (D001)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── MODE: CREATE ACCOUNT (SIGN UP) ─────────────────────────────── */}
        {mode === 'signup' && (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Full Name *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ramesh Baruah"
                className="w-full h-12 px-4 rounded-xl border-2 border-[#D3D1C7] text-base text-[#1A1A1A] placeholder-[#5F5E5A]/50 bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
                required
              />
            </div>

            <div>
              <label htmlFor="signupUserId" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Choose a User ID / Username *
              </label>
              <input
                id="signupUserId"
                type="text"
                value={signupUserId}
                onChange={(e) => setSignupUserId(e.target.value)}
                placeholder="e.g. ramesh99"
                className="w-full h-12 px-4 rounded-xl border-2 border-[#D3D1C7] text-base text-[#1A1A1A] placeholder-[#5F5E5A]/50 bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
                required
              />
            </div>

            <div>
              <label htmlFor="signupPassword" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Create Password *
              </label>
              <div className="relative">
                <input
                  id="signupPassword"
                  type={showPassword ? "text" : "password"}
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full h-12 px-4 pr-12 rounded-xl border-2 border-[#D3D1C7] text-base text-[#1A1A1A] placeholder-[#5F5E5A]/50 bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded text-xl text-[#5F5E5A] hover:bg-[#F9F8F6] focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Preferred Language for Personalization */}
            <div>
              <label htmlFor="preferredLang" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Preferred Language
              </label>
              <select
                id="preferredLang"
                value={preferredLang}
                onChange={(e) => setPreferredLang(e.target.value as Language)}
                className="w-full h-12 px-4 rounded-xl border-2 border-[#D3D1C7] text-base text-[#1A1A1A] bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
              >
                {Object.entries(LANGS).map(([key, item]) => (
                  <option key={key} value={key}>
                    {item.name} ({item.nativeName})
                  </option>
                ))}
              </select>
            </div>

            {/* Region for Cultural Relevance */}
            <div>
              <label htmlFor="region" className="block text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Region / State
              </label>
              <select
                id="region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full h-12 px-4 rounded-xl border-2 border-[#D3D1C7] text-base text-[#1A1A1A] bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
              >
                <option value="Assam">Assam (অসম)</option>
                <option value="Meghalaya">Meghalaya</option>
                <option value="Manipur">Manipur (মণিপুর)</option>
                <option value="Nagaland">Nagaland</option>
                <option value="Tripura">Tripura</option>
                <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                <option value="Mizoram">Mizoram</option>
                <option value="Sikkim">Sikkim</option>
                <option value="Other">Other Region</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-13 mt-6 bg-[#0F6E56] text-[#FFFFFF] font-semibold text-lg rounded-xl flex items-center justify-center hover:bg-[#0F6E56]/90 focus:outline-none focus:ring-4 focus:ring-[#0F6E56]/30 disabled:opacity-70 transition-colors shadow-sm"
            >
              {loading ? (
                <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                `Complete Sign Up & Enter`
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
