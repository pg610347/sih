import { useEffect } from 'react'
import type { Role } from '../App'

interface WelcomeViewProps {
  role: Role
  name: string
  onContinue: () => void
}

export default function WelcomeView({ role, name, onContinue }: WelcomeViewProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue()
    }, 2000)

    return () => clearTimeout(timer)
  }, [onContinue])

  const roleEmoji = {
    patient: '👴',
    caregiver: '👨‍👩‍👧',
    doctor: '👨‍⚕️'
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex flex-col items-center justify-center p-6 text-center animate-fadeUp">
      <div className="max-w-md w-full flex flex-col items-center">
        <div className="text-8xl mb-8" aria-hidden="true">
          {roleEmoji[role]}
        </div>
        
        <h1 className="text-3xl font-bold text-[#1A1A1A] mb-4">
          {role === 'patient' ? `Welcome back, ${name}!` : `Welcome back, ${name}`}
        </h1>
        
        <p className="text-xl text-[#5F5E5A] mb-12">
          Taking you to your dashboard...
        </p>

        <button
          onClick={onContinue}
          className="w-full h-14 bg-[#0F6E56] text-[#FFFFFF] font-semibold text-lg rounded-xl flex items-center justify-center hover:bg-[#0F6E56]/90 focus:outline-none focus:ring-4 focus:ring-[#0F6E56]/30 transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  )
}
