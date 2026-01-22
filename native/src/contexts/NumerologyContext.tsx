import React, {createContext, useContext, useState, useCallback, ReactNode} from 'react'
import type {ScanOutput} from '../lib/scanOutput'

interface NumerologyContextValue {
  scanOutput: ScanOutput | null
  setScanOutput: (data: ScanOutput | null) => void
  clearScanOutput: () => void
}

const NumerologyContext = createContext<NumerologyContextValue | null>(null)

interface NumerologyProviderProps {
  children: ReactNode
}

export function NumerologyProvider({children}: NumerologyProviderProps) {
  const [scanOutput, setScanOutputState] = useState<ScanOutput | null>(null)

  const setScanOutput = useCallback((data: ScanOutput | null) => {
    setScanOutputState(data)
  }, [])

  const clearScanOutput = useCallback(() => {
    setScanOutputState(null)
  }, [])

  return (
    <NumerologyContext.Provider
      value={{
        scanOutput,
        setScanOutput,
        clearScanOutput,
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
