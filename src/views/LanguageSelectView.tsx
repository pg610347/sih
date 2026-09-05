import { LANG_OPTIONS, type Language } from '../i18n'

function speakLanguage(text: string, lang: string) {
  if (!('speechSynthesis' in window)) return
  window.speechSynthesis.cancel()
  const utt = new SpeechSynthesisUtterance(text)
  utt.lang = lang
  utt.rate = 0.78
  utt.pitch = 1.05
  utt.volume = 1
  window.speechSynthesis.speak(utt)
}

interface Props {
  current: Language
  onSelect: (l: Language) => void
  onContinue: () => void
  /** When true, show a compact inline version for the Settings screen */
  compact?: boolean
}

export default function LanguageSelectView({ current, onSelect, onContinue, compact = false }: Props) {
  return (
    <div className={`flex flex-col ${compact ? '' : 'min-h-screen bg-parchment'}`}>

      {/* Header — only in full-screen mode */}
      {!compact && (
        <div className="bg-forest-dark px-6 pt-12 pb-10 text-center relative overflow-hidden">
          {/* Subtle NER textile pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden>
            <defs>
              <pattern id="ls-weave" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                <polygon points="24,4 44,24 24,44 4,24" fill="none" stroke="#E8A838" strokeWidth="1.5" />
                <circle cx="24" cy="24" r="2" fill="#E8A838" opacity="0.6" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ls-weave)" />
          </svg>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-2xl">🪔</span>
              <span className="text-amber text-xs font-bold tracking-[0.25em] uppercase">NER Dementia Care</span>
            </div>
            <h1 className="font-serif text-parchment text-4xl font-bold leading-tight">
              Choose your language
            </h1>
            <p className="text-sage-light text-xl mt-2 font-serif italic">
              ভাষা বাছি লওক · भाषा चुनें
            </p>
            <p className="text-sage-light/50 text-base mt-2">
              You can change this anytime from Settings.
            </p>
          </div>
        </div>
      )}

      {/* Language list */}
      <div className={`flex-1 overflow-auto px-5 space-y-3 ${compact ? 'py-2' : 'py-6'}`}>
        {LANG_OPTIONS.map(opt => {
          const selected = current === opt.lang
          return (
            <div
              key={opt.lang}
              className={`flex items-center gap-4 px-6 rounded-2xl border-2 min-h-[72px] transition-all ${
                selected
                  ? 'bg-forest/10 border-forest shadow-sm'
                  : 'bg-white border-[#D3D1C7]'
              }`}
            >
              {/* Radio circle */}
              <div
                className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                  selected ? 'bg-forest border-forest' : 'border-[#C8C5BB]'
                }`}
              >
                {selected && <span className="text-parchment text-sm font-bold leading-none">✓</span>}
              </div>

              {/* Label — tappable */}
              <button className="flex-1 text-left py-5" onClick={() => onSelect(opt.lang)}>
                <div className="font-bold text-bark text-2xl leading-tight">{opt.nativeName}</div>
                {opt.romanName && (
                  <div className="text-bark/50 text-base mt-0.5">{opt.romanName}</div>
                )}
              </button>

              {/* 🔊 speaker */}
              <button
                onClick={() => speakLanguage(opt.speechText, opt.speechLang)}
                className="w-12 h-12 rounded-full bg-sand border border-[#D3D1C7] flex items-center justify-center text-xl shrink-0 active:scale-95 transition-transform"
                aria-label={`Hear ${opt.romanName || opt.nativeName}`}
              >
                🔊
              </button>
            </div>
          )
        })}
      </div>

      {/* Continue button — only in full-screen mode */}
      {!compact && (
        <div className="px-5 pb-10 pt-5 bg-parchment border-t border-sand">
          <button
            onClick={onContinue}
            className="w-full bg-forest text-parchment font-bold text-2xl py-6 rounded-2xl active:scale-[0.98] transition-transform shadow-md"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
