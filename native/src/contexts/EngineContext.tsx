import React, {createContext, useContext, useState, useCallback, useRef, ReactNode} from 'react'
import {calculateNumerology} from '../lib/numerology'
import {useNumerology} from './NumerologyContext'

export interface EngineState {
  isCalculating: boolean
  isIntense: boolean
  resultNumber: number | null
  showResult: boolean
  activeNumber: number | null
  currentPhase: number | null
  showSigils: {
    core: boolean
    desire: boolean
    bond: boolean
    friction: boolean
  }
}

interface ExtractionParams {
  name: string
  dob: string
}

interface EngineContextValue {
  engineState: EngineState
  statusText: string
  subStatus: string
  extractionParams: ExtractionParams | null
  setExtractionParams: (params: ExtractionParams | null) => void
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
    core: false,
    desire: false,
    bond: false,
    friction: false,
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
  const [extractionParams, setExtractionParams] = useState<ExtractionParams | null>(null)
  const {setNumerologyData} = useNumerology()
  const isRunningRef = useRef(false)

  const startExtraction = useCallback(
    async (onComplete: () => void) => {
      if (!extractionParams || isRunningRef.current) return
      isRunningRef.current = true

      const {name, dob} = extractionParams

      const phases = [
        {text: 'Extracting Life Path...', duration: 2000, sigil: null},
        {text: 'Decoding Desire...', duration: 2000, sigil: 'desire' as const},
        {text: 'Mapping Bond Pattern...', duration: 2000, sigil: 'bond' as const},
        {text: 'Calculating Friction...', duration: 2000, sigil: 'friction' as const},
        {text: 'Assembling Love Blueprint...', duration: 2000, sigil: 'core' as const},
      ]

      setEngineState(prev => ({
        ...prev,
        isCalculating: true,
        showSigils: {core: false, desire: false, bond: false, friction: false},
      }))
      setSubStatus('Reading your signature')

      for (let i = 0; i < phases.length; i++) {
        const phase = phases[i]
        setStatusText(phase.text)

        if (phase.sigil) {
          setEngineState(prev => ({
            ...prev,
            showSigils: {
              ...prev.showSigils,
              [phase.sigil!]: true,
            },
          }))
        }

        setEngineState(prev => ({...prev, activeNumber: i, currentPhase: i}))
        await sleep(phase.duration)
      }

      // Intensify for final calculation
      setEngineState(prev => ({...prev, isIntense: true}))
      await sleep(1500)

      // Calculate results
      const data = calculateNumerology(name, dob)
      setNumerologyData(data)

      // Show result number briefly
      setEngineState(prev => ({
        ...prev,
        resultNumber: data.core,
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
    [extractionParams, setNumerologyData],
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
