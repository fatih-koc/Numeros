import React, {useState, useCallback} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native'
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context'
import {useFonts} from 'expo-font'
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated'

import {Background} from './src/components/Background'
import {Particles} from './src/components/Particles'
import {LoveEngine} from './src/components/LoveEngine'
import {InputForm} from './src/components/InputForm'
import {Blueprint} from './src/components/Blueprint'
import {calculateNumerology, type NumerologyData} from './src/lib/numerology'
import {colors} from './src/lib/colors'
import {fonts, fontAssets} from './src/lib/fonts'

type Screen = 'idle' | 'input' | 'blueprint'

interface EngineState {
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

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function App() {
  const [fontsLoaded] = useFonts(fontAssets)
  const [currentScreen, setCurrentScreen] = useState<Screen>('idle')
  const [statusText, setStatusText] = useState('numEros is idle')
  const [subStatus, setSubStatus] = useState('Your love field is unaligned')
  const [numerologyData, setNumerologyData] = useState<NumerologyData | null>(null)
  const [engineState, setEngineState] = useState<EngineState>(initialEngineState)

  // Status text pulse animation
  const statusOpacity = useSharedValue(1)

  const startStatusPulse = useCallback(() => {
    statusOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, {duration: 750, easing: Easing.inOut(Easing.ease)}),
        withTiming(1, {duration: 750, easing: Easing.inOut(Easing.ease)}),
      ),
      -1,
      true,
    )
  }, [statusOpacity])

  const stopStatusPulse = useCallback(() => {
    statusOpacity.value = withTiming(1, {duration: 300})
  }, [statusOpacity])

  const statusTextStyle = useAnimatedStyle(() => ({
    opacity: statusOpacity.value,
  }))

  const runExtraction = async (name: string, dob: string) => {
    const phases = [
      {text: 'Extracting Life Path...', duration: 2000, sigil: null},
      {text: 'Decoding Desire...', duration: 2000, sigil: 'desire' as const},
      {text: 'Mapping Bond Pattern...', duration: 2000, sigil: 'bond' as const},
      {text: 'Calculating Friction...', duration: 2000, sigil: 'friction' as const},
      {text: 'Assembling Love Blueprint...', duration: 2000, sigil: 'core' as const},
    ]

    setEngineState((prev) => ({
      ...prev,
      isCalculating: true,
      showSigils: {core: false, desire: false, bond: false, friction: false},
    }))
    setSubStatus('Reading your signature')
    startStatusPulse()

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]
      setStatusText(phase.text)

      if (phase.sigil) {
        setEngineState((prev) => ({
          ...prev,
          showSigils: {
            ...prev.showSigils,
            [phase.sigil]: true,
          },
        }))
      }

      setEngineState((prev) => ({...prev, activeNumber: i, currentPhase: i}))
      await sleep(phase.duration)
    }

    // Intensify for final calculation
    setEngineState((prev) => ({...prev, isIntense: true}))
    await sleep(1500)

    // Calculate results
    const data = calculateNumerology(name, dob)
    setNumerologyData(data)

    // Show result number briefly
    setEngineState((prev) => ({
      ...prev,
      resultNumber: data.core,
      showResult: true,
    }))
    await sleep(1500)

    // Reset and transition
    stopStatusPulse()
    setEngineState(initialEngineState)
    setCurrentScreen('blueprint')
  }

  const handleBeginAlignment = () => {
    setCurrentScreen('input')
  }

  const handleFormSubmit = async (name: string, dob: string) => {
    setCurrentScreen('idle')
    await sleep(500)
    await runExtraction(name, dob)
  }

  const handleSearchResonance = () => {
    Alert.alert(
      'Coming Soon',
      'Universe scan would begin here...\n\nThis prototype shows the extraction ritual. The full app would continue to the scanning and matching screens.',
      [{text: 'OK'}],
    )
  }

  const handleBackToIdle = () => {
    setCurrentScreen('idle')
    setStatusText('numEros is idle')
    setSubStatus('Your love field is unaligned')
    setNumerologyData(null)
  }

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accentViolet} />
      </View>
    )
  }

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* Background layer - z-index 0 */}
        <Background />

        {/* Particles layer - z-index 1, behind content */}
        <View style={styles.particlesLayer}>
          <Particles />
        </View>

        {/* Content layer - z-index 10, above particles */}
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.content}>
            {/* Logo */}
            <TouchableOpacity
              onPress={handleBackToIdle}
              activeOpacity={0.7}
              style={styles.logoContainer}>
              <Image
                source={require('./assets/images/numeros_text.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Screen: Idle */}
            {currentScreen === 'idle' && (
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(300)}
                style={styles.screenContainer}>
                <LoveEngine {...engineState} />

                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>LOVE ENGINE</Text>
                  <Animated.Text style={[styles.statusText, statusTextStyle]}>
                    {statusText}
                  </Animated.Text>
                  <Text style={styles.subStatus}>{subStatus}</Text>
                </View>

                {!engineState.isCalculating && (
                  <Animated.View entering={FadeIn.delay(300).duration(500)}>
                    <TouchableOpacity
                      onPress={handleBeginAlignment}
                      style={styles.primaryButton}
                      activeOpacity={0.8}>
                      <Text style={styles.primaryButtonText}>BEGIN ALIGNMENT</Text>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </Animated.View>
            )}

            {/* Screen: Input */}
            {currentScreen === 'input' && (
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(300)}
                style={styles.screenContainer}>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>IDENTITY INPUT</Text>
                  <Text style={styles.statusText}>Enter your human signature</Text>
                  <Text style={styles.subStatus}>
                    These values encode how you love
                  </Text>
                </View>

                <InputForm onSubmit={handleFormSubmit} />
              </Animated.View>
            )}

            {/* Screen: Blueprint */}
            {currentScreen === 'blueprint' && numerologyData && (
              <Animated.View
                entering={FadeIn.duration(500)}
                exiting={FadeOut.duration(300)}
                style={styles.screenContainer}>
                <Blueprint data={numerologyData} onSearch={handleSearchResonance} />
              </Animated.View>
            )}
          </View>
        </SafeAreaView>
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.bgDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  particlesLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    elevation: 1,
  },
  safeArea: {
    flex: 1,
    zIndex: 10,
    elevation: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 20,
  },
  logoContainer: {
    marginBottom: 24,
    opacity: 0.4,
  },
  logo: {
    width: 96,
    height: 32,
    tintColor: colors.textPrimary,
  },
  screenContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
    width: '100%',
  },
  statusContainer: {
    alignItems: 'center',
    minHeight: 80,
  },
  statusLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 4,
    color: colors.textDim,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 17,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: fonts.serif,
  },
  subStatus: {
    fontSize: 14,
    color: colors.textDim,
    fontFamily: fonts.serifItalic,
  },
  primaryButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 50,
    paddingHorizontal: 48,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.textPrimary,
  },
})
