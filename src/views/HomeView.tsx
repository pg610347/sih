import type { Role, Language } from '../App'
import { LANGS } from '../App'
import { LANG_OPTIONS } from '../i18n'

function NERPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden>
      <defs>
        <pattern id="ner-weave" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
          <polygon points="24,4 44,24 24,44 4,24" fill="none" stroke="#E8A838" strokeWidth="1.5" />
          <polygon points="24,14 34,24 24,34 14,24" fill="rgba(232,168,56,0.25)" stroke="#E8A838" strokeWidth="1" />
          <circle cx="0"  cy="0"  r="2.5" fill="#C4622D" opacity="0.6" />
          <circle cx="48" cy="0"  r="2.5" fill="#C4622D" opacity="0.6" />
          <circle cx="0"  cy="48" r="2.5" fill="#C4622D" opacity="0.6" />
          <circle cx="48" cy="48" r="2.5" fill="#C4622D" opacity="0.6" />
          <circle cx="24" cy="24" r="2"   fill="#E8A838" opacity="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ner-weave)" />
    </svg>
  )
}

const ROLE_CARDS: { role: Role; emoji: string; title: string; subtitle: string; bg: string; border: string; hoverBg: string }[] = [
  {
    role: 'patient',
    emoji: '🌸',
    title: 'I am a Patient',
    subtitle: 'Play games, record memories, and stay connected',
    bg: 'bg-amber/10',
    border: 'border-amber',
    hoverBg: 'hover:bg-amber/20',
  },
  {
    role: 'caregiver',
    emoji: '💛',
    title: 'I am a Caregiver',
    subtitle: 'Monitor, support, and communicate with your patient',
    bg: 'bg-terracotta/10',
    border: 'border-terracotta',
    hoverBg: 'hover:bg-terracotta/20',
  },
  {
    role: 'doctor',
    emoji: '🩺',
    title: 'I am a Doctor',
    subtitle: 'Clinical insights, treatment planning, and regional data',
    bg: 'bg-forest/10',
    border: 'border-forest',
    hoverBg: 'hover:bg-forest/20',
  },
]

interface Props {
  language: Language
  onChangeLanguage: (l: Language) => void
  onSelectRole: (r: Role) => void
  onQuickLogin?: (role: Role, name: string) => void
}

export default function HomeView({ language, onChangeLanguage, onSelectRole, onQuickLogin }: Props) {
  const lang = LANGS[language]

  return (
    <div className="min-h-full flex flex-col lg:flex-row overflow-auto bg-parchment">
      {/* Left decorative panel */}
      <div className="bg-[#094738] text-parchment lg:w-5/12 xl:w-2/5 flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden min-h-64 lg:min-h-full">
        <NERPattern />
        <div className="relative z-10">
          <div className="flex items-center gap-2.5 mb-8">
            <span className="text-2xl">🪔</span>
            <span className="text-amber font-bold text-xs tracking-[0.25em] uppercase">Smaran · स्मरण Care</span>
          </div>
          <div className="mb-6">
            <p className="text-white/80 text-sm mb-1 tracking-wide font-medium">
              {lang.greeting} —
            </p>
            <h1 className="font-serif text-white text-4xl lg:text-5xl xl:text-6xl leading-tight">
              A caring<br />
              <span className="text-amber">companion</span><br />
              for you.
            </h1>
          </div>
          <p className="text-white/80 text-base leading-relaxed max-w-sm">
            Gentle cognitive engagement, familiar reminiscence, and dignity-first habit building designed for the elders of Northeast India.
          </p>
        </div>

        <div className="relative z-10 mt-8 lg:mt-0 pt-6 border-t border-white/15">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-sage" />
            <p className="text-white/90 text-sm font-semibold">Community-Centered Dementia Care</p>
          </div>
          <p className="text-white/60 text-xs leading-relaxed">
            Assam · Meghalaya · Manipur · Mizoram · Nagaland · Sikkim · Tripura · Arunachal Pradesh
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-14 bg-parchment">
        {/* Top bar: Current language indicator + Direct preview tabs */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4 border-b border-sand pb-4">
          <div className="flex items-center gap-2 text-sm text-bark">
            <span className="font-bold">{LANGS[language].nativeName}</span>
            {LANG_OPTIONS.find(o => o.lang === language)?.romanName && (
              <span className="text-muted">· {LANG_OPTIONS.find(o => o.lang === language)?.romanName}</span>
            )}
            <button
              onClick={() => onChangeLanguage(language)}
              className="ml-2 text-forest font-semibold hover:underline flex items-center gap-1 text-sm"
            >
              🌐 Change Language
            </button>
          </div>

          {/* Quick Demo Switcher for fast evaluation */}
          {onQuickLogin && (
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted font-semibold">Instant Preview:</span>
              <button
                onClick={() => onQuickLogin('patient', 'Priya Devi Borah')}
                className="px-2.5 py-1 rounded-lg bg-white border border-sand hover:border-forest text-bark font-semibold transition-all active:scale-95"
              >
                👵 Patient
              </button>
              <button
                onClick={() => onQuickLogin('caregiver', 'Rahul Borah')}
                className="px-2.5 py-1 rounded-lg bg-white border border-sand hover:border-terracotta text-bark font-semibold transition-all active:scale-95"
              >
                🤝 Caregiver
              </button>
              <button
                onClick={() => onQuickLogin('doctor', 'Dr. Ananya Sarma')}
                className="px-2.5 py-1 rounded-lg bg-white border border-sand hover:border-plum text-bark font-semibold transition-all active:scale-95"
              >
                🩺 Doctor
              </button>
            </div>
          )}
        </div>

        {/* Role selection */}
        <div className="mb-6">
          <h2 className="font-serif text-bark text-3xl font-bold mb-1">Who are you today?</h2>
          <p className="text-muted text-base">Select your role to access your personalized workspace</p>
        </div>

        <div className="grid gap-4 max-w-lg">
          {ROLE_CARDS.map((card, i) => (
            <button
              key={card.role}
              onClick={() => onSelectRole(card.role)}
              className={`flex items-center gap-5 p-5 rounded-xl border-2 text-left transition-all duration-200 active:scale-[0.98] min-h-[72px] bg-white border-sand hover:border-forest hover:shadow-sm ${card.hoverBg}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="text-3xl w-14 h-14 flex items-center justify-center rounded-xl bg-parchment shrink-0 border border-sand">
                {card.emoji}
              </span>
              <div>
                <div className="font-bold text-bark text-lg leading-tight">{card.title}</div>
                <div className="text-muted text-sm mt-0.5">{card.subtitle}</div>
              </div>
              <span className="ml-auto text-forest font-bold text-xl shrink-0">→</span>
            </button>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-sand">
          <div className="flex flex-wrap gap-3 text-xs text-muted font-semibold">
            <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-sand">
              🔒 Private & Secure
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-sand">
              📶 Works Offline
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-xl border border-sand">
              🇮🇳 Dedicated to Northeast Indian Elders
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
