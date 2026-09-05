import { useState, useRef, useEffect } from 'react'
import type { SavedMemory } from '../hooks/useMemories'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function friendlyDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return iso }
}

// ─── Audio Player ─────────────────────────────────────────────────────────────

function AudioPlayer({ url, duration, onClose }: { url: string; duration: number; onClose: () => void }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [elapsed, setElapsed] = useState(0)
  const total = duration

  useEffect(() => {
    const audio = new Audio(url)
    audioRef.current = audio
    audio.onended = () => setPlaying(false)
    audio.ontimeupdate = () => setElapsed(Math.floor(audio.currentTime))
    audio.play().then(() => setPlaying(true)).catch(() => {})
    return () => { audio.pause(); URL.revokeObjectURL(url) }
  }, [url])

  const toggle = () => {
    const a = audioRef.current
    if (!a) return
    if (playing) { a.pause(); setPlaying(false) }
    else { a.play(); setPlaying(true) }
  }

  const progress = total > 0 ? Math.min(elapsed / total, 1) : 0

  return (
    <div className="bg-white rounded-2xl border border-forest/30 p-6 mt-4 flex flex-col gap-4">
      {/* Progress bar */}
      <div className="relative h-3 bg-sand rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full bg-forest rounded-full transition-all"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-bark/50 text-lg font-mono">
        <span>{fmt(elapsed)}</span>
        <span>{fmt(total)}</span>
      </div>
      {/* Controls */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={toggle}
          className="w-20 h-20 rounded-full bg-forest text-parchment text-4xl flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? '⏸' : '▶'}
        </button>
        <button
          onClick={onClose}
          className="text-bark/50 text-xl font-semibold py-3 px-5 rounded-2xl border border-sand active:scale-95 transition-transform"
        >
          Close
        </button>
      </div>
    </div>
  )
}

// ─── Memory Card ──────────────────────────────────────────────────────────────

function MemoryCard({ memory, onPlay, onDelete, isLoadingAudio }: {
  memory: SavedMemory
  onPlay: (id: string) => void
  onDelete: (id: string) => void
  isLoadingAudio: boolean
}) {
  const [confirmDelete, setConfirmDelete] = useState(false)

  if (confirmDelete) return (
    <div className="bg-white rounded-2xl border-2 border-rose/30 p-6 flex flex-col gap-4 animate-fadeUp">
      <p className="font-bold text-bark text-2xl text-center">Delete this memory?</p>
      <p className="text-bark/60 text-xl text-center leading-snug">
        "{memory.title}"
      </p>
      <div className="flex gap-3">
        <button
          onClick={() => setConfirmDelete(false)}
          className="flex-1 bg-parchment border-2 border-sand text-bark font-bold text-xl py-5 rounded-2xl active:scale-95 transition-transform"
        >
          Keep Memory
        </button>
        <button
          onClick={() => onDelete(memory.id)}
          className="flex-1 bg-rose/10 border-2 border-rose/30 text-rose font-bold text-xl py-5 rounded-2xl active:scale-95 transition-transform"
        >
          Delete
        </button>
      </div>
    </div>
  )

  return (
    <div className="bg-white rounded-2xl border border-[#D3D1C7] p-6 flex flex-col gap-4">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <span className="text-4xl leading-none shrink-0 mt-1">🎙️</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-bark text-2xl leading-tight">{memory.title}</p>
          <p className="text-bark/50 text-lg mt-1">
            {friendlyDate(memory.date)}
            {memory.duration > 0 && <> · {fmt(memory.duration)}</>}
          </p>
        </div>
        {memory.mood && (
          <span className="text-4xl leading-none shrink-0" title={memory.moodLabel ?? ''}>
            {memory.mood}
          </span>
        )}
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-bark/40 text-sm font-semibold">🔒 Private Memory</span>
        {memory.moodLabel && (
          <span className="bg-amber/15 text-bark/60 text-sm font-semibold px-3 py-0.5 rounded-full border border-amber/30">
            {memory.mood} {memory.moodLabel}
          </span>
        )}
      </div>

      {/* Prompt if present */}
      {memory.prompt && (
        <p className="text-bark/60 text-xl italic border-l-2 border-sand pl-4 leading-snug">
          "{memory.prompt}"
        </p>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 pt-1">
        {memory.hasAudio ? (
          <button
            onClick={() => onPlay(memory.id)}
            disabled={isLoadingAudio}
            className="flex-1 flex items-center justify-center gap-3 bg-forest text-parchment font-bold text-xl py-5 rounded-2xl shadow-sm active:scale-95 transition-transform disabled:opacity-50"
          >
            {isLoadingAudio ? (
              <>⏳ Loading…</>
            ) : (
              <>▶ Play Memory</>
            )}
          </button>
        ) : (
          <div className="flex-1 flex items-center justify-center text-bark/30 text-lg font-semibold bg-sand/40 rounded-2xl py-5 border border-sand">
            🎙️ No audio saved
          </div>
        )}
        <button
          onClick={() => setConfirmDelete(true)}
          className="w-14 h-14 self-center rounded-2xl border border-[#D3D1C7] text-bark/40 text-xl flex items-center justify-center active:scale-95 transition-transform"
          aria-label="Delete memory"
          title="Delete this memory"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onRecord }: { onRecord: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center gap-6 animate-fadeUp">
      <span className="text-[100px] leading-none">📖</span>
      <div>
        <p className="font-serif text-bark text-4xl font-bold">Your memories will appear here</p>
        <p className="text-bark/60 text-2xl mt-3 leading-relaxed max-w-xs mx-auto">
          Record a memory in Dear Diary, and you can come back to listen to it anytime.
        </p>
      </div>
      <button
        onClick={onRecord}
        className="flex items-center gap-3 bg-rose text-parchment font-bold text-2xl px-10 py-6 rounded-3xl shadow-md active:scale-95 transition-transform"
      >
        🎙️ Record a Memory
      </button>
    </div>
  )
}

// ─── Sort bar ─────────────────────────────────────────────────────────────────

type SortMode = 'recent' | 'oldest' | 'mood'

function SortBar({ mode, onChange }: { mode: SortMode; onChange: (m: SortMode) => void }) {
  const tabs: { id: SortMode; label: string }[] = [
    { id: 'recent', label: 'Recent' },
    { id: 'oldest', label: 'Oldest' },
    { id: 'mood', label: 'Mood' },
  ]
  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-5 py-2.5 rounded-full text-lg font-bold border-2 transition-all ${
            mode === tab.id
              ? 'bg-forest text-parchment border-forest'
              : 'bg-white text-bark/60 border-[#D3D1C7]'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ─── Main view ───────────────────────────────────────────────────────────────

interface Props {
  memories: SavedMemory[]
  getAudioUrl: (id: string) => Promise<string | null>
  deleteMemory: (id: string) => Promise<void>
  onBack: () => void
  onGoToDiary: () => void
}

export default function SavedMemoriesView({ memories, getAudioUrl, deleteMemory, onBack, onGoToDiary }: Props) {
  const [sort, setSort] = useState<SortMode>('recent')
  const [playingId, setPlayingId] = useState<string | null>(null)
  const [playingUrl, setPlayingUrl] = useState<string | null>(null)
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const sorted = [...memories].sort((a, b) => {
    if (sort === 'oldest') return new Date(a.date).getTime() - new Date(b.date).getTime()
    if (sort === 'mood') {
      const ma = a.moodLabel ?? 'zz', mb = b.moodLabel ?? 'zz'
      return ma.localeCompare(mb)
    }
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  const handlePlay = async (id: string) => {
    if (playingId === id) {
      setPlayingId(null)
      setPlayingUrl(null)
      return
    }
    setPlayingId(null)
    setPlayingUrl(null)
    setLoadingId(id)
    const url = await getAudioUrl(id)
    setLoadingId(null)
    if (url) {
      setPlayingId(id)
      setPlayingUrl(url)
    }
  }

  const handleDelete = async (id: string) => {
    if (playingId === id) { setPlayingId(null); setPlayingUrl(null) }
    await deleteMemory(id)
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col">
      {/* Header */}
      <div className="bg-forest-dark px-6 pt-10 pb-8 relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-10" aria-hidden>
          <defs>
            <pattern id="mem-weave" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
              <polygon points="24,4 44,24 24,44 4,24" fill="none" stroke="#E8A838" strokeWidth="1.5" />
              <circle cx="24" cy="24" r="2" fill="#E8A838" opacity="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#mem-weave)" />
        </svg>
        <button
          onClick={onBack}
          className="relative z-10 flex items-center gap-2 text-sage-light text-xl font-bold mb-5 active:opacity-70"
        >
          ← Go Back
        </button>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-4xl leading-none">📖</span>
            <h1 className="font-serif text-parchment text-4xl font-bold">Saved Memories</h1>
          </div>
          <p className="text-sage-light/70 text-xl mt-1 font-serif italic">
            "Your memories are safe here. Listen whenever you'd like."
          </p>
        </div>
      </div>

      {memories.length === 0 ? (
        <EmptyState onRecord={onGoToDiary} />
      ) : (
        <div className="flex-1 flex flex-col px-5 py-5 gap-4 overflow-auto">
          {/* Sort bar */}
          <SortBar mode={sort} onChange={setSort} />

          {/* Memory count */}
          <p className="text-bark/40 text-lg font-semibold px-1">
            {memories.length} {memories.length === 1 ? 'memory' : 'memories'} saved
          </p>

          {/* Cards */}
          {sorted.map(memory => (
            <div key={memory.id}>
              <MemoryCard
                memory={memory}
                onPlay={handlePlay}
                onDelete={handleDelete}
                isLoadingAudio={loadingId === memory.id}
              />
              {playingId === memory.id && playingUrl && (
                <AudioPlayer
                  url={playingUrl}
                  duration={memory.duration}
                  onClose={() => { setPlayingId(null); setPlayingUrl(null) }}
                />
              )}
            </div>
          ))}

          {/* Record more CTA */}
          <button
            onClick={onGoToDiary}
            className="flex items-center justify-center gap-3 mt-2 mb-4 bg-rose/10 border-2 border-rose/30 text-bark font-bold text-xl py-6 rounded-2xl active:scale-[0.98] transition-transform"
          >
            🎙️ Record a new memory
          </button>
        </div>
      )}
    </div>
  )
}
