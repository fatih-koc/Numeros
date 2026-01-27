import React, {createContext, useContext, useState, useCallback, useRef, ReactNode} from 'react'
import {
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  runOnJS,
  cancelAnimation,
  SharedValue,
} from 'react-native-reanimated'
import {generateScan} from '../lib/generateScan'
import type {UserInput} from '../lib/scanOutput'
import {useNumerology} from './NumerologyContext'

export interface EngineState {
  isCalculating: boolean
  resultNumber: number | null
  showResult: boolean
}

// Shared values exposed by context for UI-thread animations
export interface EngineAnimationValues {
  extractionProgress: SharedValue<number>
  currentPhase: SharedValue<number>
  intensity: SharedValue<number>
  resultOpacity: SharedValue<number>
  resultScale: SharedValue<number>
}

interface EngineContextValue {
  engineState: EngineState
  animationValues: EngineAnimationValues
  statusText: string
  subStatus: string
  extractionParams: UserInput | null
  setExtractionParams: (params: UserInput | null) => void
  startExtraction: (onComplete: () => void) => void
  resetEngine: () => void
  idleButtonEnabled: boolean
  enableIdleButton: () => void
  disableIdleButton: () => void
  setStatusText: (text: string) => void
  setSubStatus: (text: string) => void
}

const initialEngineState: EngineState = {
  isCalculating: false,
  resultNumber: null,
  showResult: false,
}

const EngineContext = createContext<EngineContextValue | null>(null)

interface EngineProviderProps {
  children: ReactNode
}

// Phase configuration
const PHASE_DURATION = 2000
const INTENSIFY_DURATION = 1500
const RESULT_DURATION = 1500
const TOTAL_PHASES = 5

export function EngineProvider({children}: EngineProviderProps) {
  const [engineState, setEngineState] = useState<EngineState>(initialEngineState)
  const [statusText, setStatusText] = useState('numEros is idle')
  const [subStatus, setSubStatus] = useState('Your love field is unaligned')
  const [extractionParams, setExtractionParams] = useState<UserInput | null>(null)
  const [idleButtonEnabled, setIdleButtonEnabled] = useState(false)
  const {setScanOutput} = useNumerology()
  const isRunningRef = useRef(false)
  const onCompleteRef = useRef<(() => void) | null>(null)

  // Shared values for UI-thread animations
  const extractionProgress = useSharedValue(0)
  const currentPhase = useSharedValue(-1)
  const intensity = useSharedValue(0)
  const resultOpacity = useSharedValue(0)
  const resultScale = useSharedValue(0.5)

  const enableIdleButton = useCallback(() => setIdleButtonEnabled(true), [])
  const disableIdleButton = useCallback(() => setIdleButtonEnabled(false), [])

  // Callbacks for runOnJS during animation
  const handlePhaseChange = useCallback((phase: number) => {
    const phaseTexts = [
      'Extracting Life Path...',
      'Decoding Soul Urge...',
      'Mapping Expression...',
      'Calculating Personality...',
      'Assembling Love Blueprint...',
    ]
    if (phase >= 0 && phase < phaseTexts.length) {
      setStatusText(phaseTexts[phase])
    }
  }, [])

  const handleExtractionComplete = useCallback(() => {
      if (!extractionParams) return

      // Generate scan output
      const scan = generateScan(extractionParams)
      setScanOutput(scan)

      // Update state for result display
      setEngineState(prev => ({
        ...prev,
        resultNumber: scan.numerology.life_path,
        showResult: true,
      }))

      // Show result animation
      resultScale.value = withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.back(1.5)),
      })
      resultOpacity.value = withTiming(1, {duration: 400})

      // After result display, trigger navigation
      setTimeout(() => {
        setExtractionParams(null)
        isRunningRef.current = false
        // Call the stored callback from ref
        onCompleteRef.current?.()
        onCompleteRef.current = null
      }, RESULT_DURATION)
    },
    [extractionParams, setScanOutput, resultScale, resultOpacity],
  )

  const startExtraction = useCallback(
    (onComplete: () => void) => {
      if (!extractionParams || isRunningRef.current) return
      isRunningRef.current = true

      // Store callback in ref so it can be accessed from handleExtractionComplete
      onCompleteRef.current = onComplete

      // Mark as calculating
      setEngineState(prev => ({...prev, isCalculating: true, showResult: false}))
      setSubStatus('Reading your signature')

      // Reset animation values
      extractionProgress.value = 0
      currentPhase.value = -1
      intensity.value = 0
      resultOpacity.value = 0
      resultScale.value = 0.5

      // Start phase sequence on UI thread
      // Each phase triggers a callback to update status text
      currentPhase.value = withSequence(
        // Phase 0: Life Path
        withTiming(0, {duration: 0}, finished => {
          if (finished) runOnJS(handlePhaseChange)(0)
        }),
        // Phase 1: Soul Urge
        withDelay(
          PHASE_DURATION,
          withTiming(1, {duration: 0}, finished => {
            if (finished) runOnJS(handlePhaseChange)(1)
          }),
        ),
        // Phase 2: Expression
        withDelay(
          PHASE_DURATION,
          withTiming(2, {duration: 0}, finished => {
            if (finished) runOnJS(handlePhaseChange)(2)
          }),
        ),
        // Phase 3: Personality
        withDelay(
          PHASE_DURATION,
          withTiming(3, {duration: 0}, finished => {
            if (finished) runOnJS(handlePhaseChange)(3)
          }),
        ),
        // Phase 4: Assembling
        withDelay(
          PHASE_DURATION,
          withTiming(4, {duration: 0}, finished => {
            if (finished) runOnJS(handlePhaseChange)(4)
          }),
        ),
      )

      // Overall progress (0 to 1) for smooth interpolations
      extractionProgress.value = withTiming(1, {
        duration: PHASE_DURATION * TOTAL_PHASES,
        easing: Easing.linear,
      })

      // Intensity ramps up after all phases complete
      intensity.value = withDelay(
        PHASE_DURATION * TOTAL_PHASES,
        withTiming(1, {duration: INTENSIFY_DURATION}, finished => {
          if (finished) {
            // Extraction complete, generate results
            runOnJS(handleExtractionComplete)()
          }
        }),
      )
    },
    [
      extractionParams,
      extractionProgress,
      currentPhase,
      intensity,
      resultOpacity,
      resultScale,
      handlePhaseChange,
      handleExtractionComplete,
    ],
  )

  const resetEngine = useCallback(() => {
    // Cancel any running animations
    cancelAnimation(extractionProgress)
    cancelAnimation(currentPhase)
    cancelAnimation(intensity)
    cancelAnimation(resultOpacity)
    cancelAnimation(resultScale)

    // Reset shared values
    extractionProgress.value = 0
    currentPhase.value = -1
    intensity.value = 0
    resultOpacity.value = 0
    resultScale.value = 0.5

    // Reset JS state
    setEngineState(initialEngineState)
    setStatusText('numEros is idle')
    setSubStatus('Your love field is unaligned')
    setExtractionParams(null)
    setIdleButtonEnabled(false)
    isRunningRef.current = false
  }, [extractionProgress, currentPhase, intensity, resultOpacity, resultScale])

  const animationValues: EngineAnimationValues = {
    extractionProgress,
    currentPhase,
    intensity,
    resultOpacity,
    resultScale,
  }

  return (
    <EngineContext.Provider
      value={{
        engineState,
        animationValues,
        statusText,
        subStatus,
        extractionParams,
        setExtractionParams,
        startExtraction,
        resetEngine,
        idleButtonEnabled,
        enableIdleButton,
        disableIdleButton,
        setStatusText,
        setSubStatus,
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
