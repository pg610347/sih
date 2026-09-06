import { useState, useCallback } from 'react'

export interface SavedMemory {
  id: string
  title: string
  date: string        // ISO timestamp
  duration: number    // seconds
  mood: string | null
  moodLabel: string | null
  prompt: string | null
  hasAudio: boolean
}

const META_KEY = 'smaran_memories_v1'
const DB_NAME = 'nercare-audio'
const STORE = 'blobs'
const DB_VER = 1

// ─── IndexedDB helpers ──────────────────────────────────────────────────────

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE)
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function dbPut(id: string, blob: Blob): Promise<void> {
  const db = await openDB()
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, id)
    tx.oncomplete = () => res()
    tx.onerror = () => rej(tx.error)
  })
}

async function dbGet(id: string): Promise<Blob | null> {
  try {
    const db = await openDB()
    return await new Promise((res, rej) => {
      const tx = db.transaction(STORE, 'readonly')
      const req = tx.objectStore(STORE).get(id)
      req.onsuccess = () => res(req.result ?? null)
      req.onerror = () => rej(req.error)
    })
  } catch {
    return null
  }
}

async function dbDelete(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(id)
    tx.oncomplete = () => res()
    tx.onerror = () => rej(tx.error)
  })
}

// ─── Metadata (localStorage) ─────────────────────────────────────────────────

function loadMeta(): SavedMemory[] {
  try {
    const raw = localStorage.getItem(META_KEY) || localStorage.getItem('nercare_memories_v1')
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function persistMeta(list: SavedMemory[]) {
  try { localStorage.setItem(META_KEY, JSON.stringify(list)) } catch { /* ignore */ }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useMemories() {
  const [memories, setMemories] = useState<SavedMemory[]>(loadMeta)

  const saveMemory = useCallback(async (
    meta: Omit<SavedMemory, 'id'>,
    blob?: Blob | null
  ): Promise<string> => {
    const id = `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    // Only mark hasAudio true if the blob actually persisted to IndexedDB
    let audioSaved = false
    if (blob && blob.size > 0) {
      try {
        await dbPut(id, blob)
        audioSaved = true
      } catch (err) {
        console.warn('useMemories: failed to persist audio blob to IndexedDB:', err)
      }
    }
    const full: SavedMemory = { ...meta, id, hasAudio: audioSaved }
    setMemories(prev => {
      const next = [full, ...prev]
      persistMeta(next)
      return next
    })
    return id
  }, [])

  const deleteMemory = useCallback(async (id: string): Promise<void> => {
    await dbDelete(id).catch(() => {})
    setMemories(prev => {
      const next = prev.filter(m => m.id !== id)
      persistMeta(next)
      return next
    })
  }, [])

  const getAudioUrl = useCallback(async (id: string): Promise<string | null> => {
    try {
      const blob = await dbGet(id)
      if (!blob) return null
      return URL.createObjectURL(blob)
    } catch { return null }
  }, [])

  return { memories, saveMemory, deleteMemory, getAudioUrl }
}
