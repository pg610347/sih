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
}

export default function HomeView({ language, onChangeLanguage, onSelectRole }: Props) {
  const lang = LANGS[language]

  return (
    <div className="min-h-full flex flex-col lg:flex-row overflow-auto">
      {/* Left decorative panel */}
      <div className="bg-forest-dark lg:w-5/12 xl:w-2/5 flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden min-h-64 lg:min-h-full">
        <NERPattern />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="text-2xl">🪔</span>
            <span className="text-amber text-xs font-bold tracking-[0.25em] uppercase">Smaran · Dementia Care</span>
          </div>
          <div className="mb-6">
            <p className="text-sage-light text-sm mb-1 tracking-wide">
              {lang.greeting} —
            </p>
            <h1 className="font-serif text-parchment text-4xl lg:text-5xl xl:text-6xl leading-tight">
              A caring<br />
              <span className="text-amber">companion</span><br />
              for you.
            </h1>
          </div>
          <p className="text-sage-light/80 text-base leading-relaxed max-w-xs">
            Joyful activities, memory care, and connection — designed for the grandmothers and grandfathers of Northeast India.
          </p>
        </div>

        <div className="relative z-10 mt-8 lg:mt-0">
          <div className="flex gap-5 text-3xl mb-5">
            <span title="Oil lamp — Diya">🪔</span>
            <span title="Bamboo basket — Jhapi">🧺</span>
            <span title="Grinding stone — Silbatta">🪨</span>
            <span title="Traditional music">🎵</span>
            <span title="Rice — staple of NER">🌾</span>
          </div>
          <p className="text-sage-light/40 text-xs tracking-widest">
            Assam · Meghalaya · Manipur · Mizoram<br />
            Nagaland · Sikkim · Tripura · Arunachal Pradesh
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center p-8 lg:p-14 bg-parchment">
        {/* Current language indicator with change link */}
        <div className="mb-10 flex items-center gap-3">
          <span className="text-bark/50 text-sm font-bold">
            {LANGS[language].nativeName}
          </span>
          {LANG_OPTIONS.find(o => o.lang === language)?.romanName && (
            <span className="text-bark/30 text-sm">
              · {LANG_OPTIONS.find(o => o.lang === language)?.romanName}
            </span>
          )}
          <button
            onClick={() => onChangeLanguage(language)}
            className="ml-1 text-forest/70 text-sm font-semibold hover:text-forest transition-colors flex items-center gap-1"
          >
            🌐 Change
          </button>
        </div>

        {/* Role selection */}
        <div className="mb-6">
          <h2 className="font-serif text-bark text-2xl mb-1">Who are you today?</h2>
          <p className="text-bark/50 text-sm">Select your role to continue</p>
        </div>

        <div className="grid gap-4 max-w-lg">
          {ROLE_CARDS.map((card, i) => (
            <button
              key={card.role}
              onClick={() => onSelectRole(card.role)}
              className={`flex items-center gap-5 p-5 rounded-2xl border-2 text-left transition-all duration-200 active:scale-95 animate-fadeUp ${card.bg} ${card.border} ${card.hoverBg}`}
              style={{ animationDelay: `${i * 0.1}s`, opacity: 0 }}
            >
              <span className="text-4xl w-16 h-16 flex items-center justify-center rounded-xl bg-white shrink-0 border border-sand/60">
                {card.emoji}
              </span>
              <div>
                <div className="font-bold text-bark text-lg leading-tight">{card.title}</div>
                <div className="text-bark/60 text-sm mt-0.5">{card.subtitle}</div>
              </div>
              <span className="ml-auto text-bark/30 text-xl shrink-0">→</span>
            </button>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-sand">
          <div className="flex flex-wrap gap-4 text-xs text-bark/40 font-semibold tracking-wider">
            <span>🔒 HIPAA-COMPLIANT</span>
            <span>🌐 OFFLINE-CAPABLE</span>
            <span>🗣 NER MULTILINGUAL</span>
            <span>🛡 DATA STORED IN INDIA</span>
          </div>
        </div>
      </div>
    </div>
  )
}
