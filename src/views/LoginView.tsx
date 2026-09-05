import { useState, useEffect } from 'react'
import type { Role, Language } from '../App'

interface LoginViewProps {
  role: Role
  language: Language
  onLogin: (name: string) => void
  onBack: () => void
  onChangeLanguage: () => void
}

const DEMO_ACCOUNTS: Record<Role, { userId: string; password: string; name: string }> = {
  patient: { userId: 'P001', password: 'care123', name: 'Priya' },
  caregiver: { userId: 'C001', password: 'care123', name: 'Anjali' },
  doctor: { userId: 'D001', password: 'care123', name: 'Dr. Sharma' },
}

export default function LoginView({ role, language, onLogin, onBack, onChangeLanguage }: LoginViewProps) {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    const savedRemember = localStorage.getItem('nercare_remember') === 'true'
    setRemember(savedRemember)
    if (savedRemember) {
      const savedUser = localStorage.getItem('nercare_last_user')
      if (savedUser) setUserId(savedUser)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password, role }),
      })

      if (res.ok) {
        const data = await res.json()
        if (remember) {
          localStorage.setItem('nercare_remember', 'true')
          localStorage.setItem('nercare_last_user', userId)
        } else {
          localStorage.removeItem('nercare_remember')
          localStorage.removeItem('nercare_last_user')
        }
        onLogin(data.name || DEMO_ACCOUNTS[role].name)
        return
      }

      if (res.status === 401) {
        setError(true)
        setLoading(false)
        return
      }

      // If server error or API unavailable, check demo credentials
      const demoAccount = DEMO_ACCOUNTS[role]
      if (userId === demoAccount.userId && password === demoAccount.password) {
        if (remember) {
          localStorage.setItem('nercare_remember', 'true')
          localStorage.setItem('nercare_last_user', userId)
        }
        onLogin(demoAccount.name)
        return
      }

      setError(true)
      setLoading(false)
    } catch (err) {
      console.warn('API call failed, checking local credentials:', err)
      const demoAccount = DEMO_ACCOUNTS[role]
      if (userId === demoAccount.userId && password === demoAccount.password) {
        if (remember) {
          localStorage.setItem('nercare_remember', 'true')
          localStorage.setItem('nercare_last_user', userId)
        }
        onLogin(demoAccount.name)
      } else {
        setError(true)
        setLoading(false)
      }
    }
  }

  const roleLabels = {
    patient: 'Patient Login',
    caregiver: 'Caregiver Login',
    doctor: 'Doctor Login'
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col p-6">
      <div className="flex items-center justify-between mb-8">
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

      <div className="flex-1 flex flex-col max-w-md mx-auto w-full">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4" aria-hidden="true">🪔</div>
          <h1 className="text-2xl font-bold text-[#1A1A1A] mb-2">{roleLabels[role]}</h1>
          <p className="text-base text-[#5F5E5A]">Enter your details to continue.</p>
        </div>

        {error && (
          <div className="mb-6 bg-[#BA7517]/10 border border-[#BA7517]/20 rounded-xl p-4 flex items-start gap-3">
            <span className="text-xl" aria-hidden="true">⚠️</span>
            <p className="text-[#1A1A1A] text-sm mt-0.5">
              We couldn't sign you in. Please check your details and try again.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="userId" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              User ID
            </label>
            <input
              id="userId"
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter your User ID"
              className="w-full h-12 px-4 rounded-lg border-2 border-[#D3D1C7] text-base text-[#1A1A1A] placeholder-[#5F5E5A] bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-[#1A1A1A] mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-12 px-4 pr-12 rounded-lg border-2 border-[#D3D1C7] text-base text-[#1A1A1A] placeholder-[#5F5E5A] bg-[#FFFFFF] focus:outline-none focus:border-[#0F6E56] focus:ring-1 focus:ring-[#0F6E56]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded text-xl text-[#5F5E5A] hover:bg-[#F9F8F6] focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
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
              className="w-6 h-6 rounded border-2 border-[#D3D1C7] text-[#0F6E56] focus:ring-2 focus:ring-[#0F6E56] focus:ring-offset-2 accent-[#0F6E56]"
            />
            <label htmlFor="remember" className="ml-3 text-base text-[#1A1A1A]">
              Remember this device
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 mt-8 bg-[#0F6E56] text-[#FFFFFF] font-semibold text-lg rounded-xl flex items-center justify-center hover:bg-[#0F6E56]/90 focus:outline-none focus:ring-4 focus:ring-[#0F6E56]/30 disabled:opacity-70 transition-colors"
          >
            {loading ? (
              <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              "Log In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => alert('Contact your care team for help.')}
            className="text-base text-[#5F5E5A] hover:text-[#0F6E56] font-medium focus:outline-none focus:underline"
          >
            Forgot Password?
          </button>
        </div>
      </div>
    </div>
  )
}
