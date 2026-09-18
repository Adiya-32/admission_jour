import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { emptyProfile, type Profile } from '../types'

const STORAGE_KEY = 'kompas.v1'

interface StoredState {
  profile: Profile
  profileCompleted: boolean
  comparedIds: string[]
  completedSteps: string[]
  previousTopIds: string[]
}

const defaultState: StoredState = {
  profile: emptyProfile,
  profileCompleted: false,
  comparedIds: [],
  completedSteps: [],
  previousTopIds: [],
}

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState
    const parsed = JSON.parse(raw)
    return { ...defaultState, ...parsed, profile: { ...emptyProfile, ...parsed.profile } }
  } catch {
    return defaultState
  }
}

interface AppContextValue {
  profile: Profile
  profileCompleted: boolean
  comparedIds: string[]
  completedSteps: string[]
  previousTopIds: string[]
  setProfile: (p: Profile) => void
  markProfileCompleted: () => void
  toggleCompared: (id: string) => void
  toggleStepCompleted: (id: string) => void
  setPreviousTopIds: (ids: string[]) => void
  submitProfile: (p: Profile, previousTopIds: string[]) => void
  resetAll: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoredState>(loadState)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [state])

  const value = useMemo<AppContextValue>(
    () => ({
      profile: state.profile,
      profileCompleted: state.profileCompleted,
      comparedIds: state.comparedIds,
      completedSteps: state.completedSteps,
      previousTopIds: state.previousTopIds,
      setProfile: (p) => setState((s) => ({ ...s, profile: p })),
      markProfileCompleted: () => setState((s) => ({ ...s, profileCompleted: true })),
      toggleCompared: (id) =>
        setState((s) => ({
          ...s,
          comparedIds: s.comparedIds.includes(id)
            ? s.comparedIds.filter((x) => x !== id)
            : s.comparedIds.length >= 3
              ? s.comparedIds
              : [...s.comparedIds, id],
        })),
      toggleStepCompleted: (id) =>
        setState((s) => ({
          ...s,
          completedSteps: s.completedSteps.includes(id)
            ? s.completedSteps.filter((x) => x !== id)
            : [...s.completedSteps, id],
        })),
      setPreviousTopIds: (ids) => setState((s) => ({ ...s, previousTopIds: ids })),
      submitProfile: (p, previousTopIds) =>
        setState((s) => ({
          ...s,
          profile: p,
          profileCompleted: true,
          previousTopIds,
          comparedIds: [],
        })),
      resetAll: () => setState(defaultState),
    }),
    [state]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
