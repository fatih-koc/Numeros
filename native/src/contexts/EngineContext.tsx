import React, {createContext, useContext, useState, useCallback, useRef, ReactNode} from 'react'
import {generateScan} from '../lib/generateScan'
import type {UserInput} from '../lib/scanOutput'
import {useNumerology} from './NumerologyContext'

export interface EngineState {
  isCalculating: boolean
  isIntense: boolean
  resultNumber: number | null
  showResult: boolean
  activeNumber: number | null
  currentPhase: number | null
  showSigils: {
    life_path: boolean
    soul_urge: boolean
    expression: boolean
    personality: boolean
  }
}

interface EngineContextValue {
  engineState: EngineState
  statusText: string
  subStatus: string
  extractionParams: UserInput | null
  setExtractionParams: (params: UserInput | null) => void
  startExtraction: (onComplete: () => void) => void
  resetEngine: () => void
}

const initialEngineState: EngineState = {
  isCalculating: false,
  isIntense: false,
  resultNumber: null,
  showResult: false,
  activeNumber: null,
  currentPhase: null,
  showSigils: {
    life_path: false,
    soul_urge: false,
    expression: false,
    personality: false,
  },
}

const EngineContext = createContext<EngineContextValue | null>(null)

interface EngineProviderProps {
  children: ReactNode
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export function EngineProvider({children}: EngineProviderProps) {
  const [engineState, setEngineState] = useState<EngineState>(initialEngineState)
  const [statusText, setStatusText] = useState('numEros is idle')
  const [subStatus, setSubStatus] = useState('Your love field is unaligned')
  const [extractionParams, setExtractionParams] = useState<UserInput | null>(null)
  const {setScanOutput} = useNumerology()
  const isRunningRef = useRef(false)

  const startExtraction = useCallback(
    async (onComplete: () => void) => {
      if (!extractionParams || isRunningRef.current) return
      isRunningRef.current = true

      const phases = [
        {text: 'Extracting Life Path...', duration: 2000, sigil: 'life_path' as const},
        {text: 'Decoding Soul Urge...', duration: 2000, sigil: 'soul_urge' as const},
        {text: 'Mapping Expression...', duration: 2000, sigil: 'expression' as const},
        {text: 'Calculating Personality...', duration: 2000, sigil: 'personality' as const},
        {text: 'Assembling Love Blueprint...', duration: 2000, sigil: null},
      ]

      setEngineState(prev => ({
        ...prev,
        isCalculating: true,
        showSigils: {life_path: false, soul_urge: false, expression: false, personality: false},
      }))
      setSubStatus('Reading your signature')

      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i]
        setStatusText(phase.text)

        // Reset all sigils, then show only the current one
        setEngineState(prev => ({
          ...prev,
          showSigils: {
            life_path: phase.sigil === 'life_path',
            soul_urge: phase.sigil === 'soul_urge',
            expression: phase.sigil === 'expression',
            personality: phase.sigil === 'personality',
          },
          activeNumber: i,
          currentPhase: i,
        }))

        await sleep(phase.duration)
      }

      // Intensify for final calculation
      setEngineState(prev => ({...prev, isIntense: true}))
      await sleep(1500)

      // Generate unified scan output
      const scan = generateScan(extractionParams)
      setScanOutput(scan)

      // Show result number briefly
      setEngineState(prev => ({
        ...prev,
        resultNumber: scan.numerology.life_path,
        showResult: true,
      }))
      await sleep(1500)

      // Reset and transition
      setEngineState(initialEngineState)
      setStatusText('numEros is idle')
      setSubStatus('Your love field is unaligned')
      setExtractionParams(null)
      isRunningRef.current = false

      onComplete()
    },
    [extractionParams, setScanOutput],
  )

  const resetEngine = useCallback(() => {
    setEngineState(initialEngineState)
    setStatusText('numEros is idle')
    setSubStatus('Your love field is unaligned')
    setExtractionParams(null)
    isRunningRef.current = false
  }, [])

  return (
    <EngineContext.Provider
      value={{
        engineState,
        statusText,
        subStatus,
        extractionParams,
        setExtractionParams,
        startExtraction,
        resetEngine,
      }}>
      {children}
    </EngineContext.Provider>
  )
}

export function useEngine() {
  const context = useContext(EngineContext)
  if (!context) {
    throw new Error('useEngine must be used within an EngineProvider')
  }
  return context
}
