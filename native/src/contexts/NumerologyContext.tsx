import React, {createContext, useContext, useState, useCallback, ReactNode} from 'react'
import type {NumerologyData} from '../lib/numerology'

interface NumerologyContextValue {
  numerologyData: NumerologyData | null
  setNumerologyData: (data: NumerologyData | null) => void
  clearNumerologyData: () => void
}

const NumerologyContext = createContext<NumerologyContextValue | null>(null)

interface NumerologyProviderProps {
  children: ReactNode
}

export function NumerologyProvider({children}: NumerologyProviderProps) {
  const [numerologyData, setNumerologyDataState] = useState<NumerologyData | null>(null)

  const setNumerologyData = useCallback((data: NumerologyData | null) => {
    setNumerologyDataState(data)
  }, [])

  const clearNumerologyData = useCallback(() => {
    setNumerologyDataState(null)
  }, [])

  return (
    <NumerologyContext.Provider
      value={{
        numerologyData,
        setNumerologyData,
        clearNumerologyData,
      }}>
      {children}
    </NumerologyContext.Provider>
  )
}

export function useNumerology() {
  const context = useContext(NumerologyContext)
  if (!context) {
    throw new Error('useNumerology must be used within a NumerologyProvider')
  }
  return context
}
