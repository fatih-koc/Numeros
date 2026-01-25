import React, {useCallback, useEffect, useRef} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Image} from 'react-native'
import {useNavigation, useFocusEffect} from '@react-navigation/native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {LoveEngine} from '../components/LoveEngine'
import {useEngine} from '../contexts'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

export function IdleScreen() {
  const navigation = useNavigation()
  const {
    engineState,
    animationValues,
    statusText,
    subStatus,
    extractionParams,
    startExtraction,
    resetEngine,
    idleButtonEnabled,
    enableIdleButton,
    disableIdleButton,
  } = useEngine()
  const hasNavigatedRef = useRef(false)
  // Track if extraction is in progress to prevent premature reset
  const isExtractingRef = useRef(false)

  // Set extraction flag immediately when params exist (before useFocusEffect runs)
  // This prevents resetEngine from being called when arriving from Input with params
  if (extractionParams && !isExtractingRef.current) {
    isExtractingRef.current = true
  }

  // Status text pulse animation
  const statusOpacity = useSharedValue(1)
  // Content fade for smooth transition
  const contentOpacity = useSharedValue(1)

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

  const contentStyle = useAnimatedStyle(() => ({
    opacity: contentOpacity.value,
  }))

  const navigateToBlueprint = useCallback(() => {
    if (!hasNavigatedRef.current) {
      hasNavigatedRef.current = true
      // Navigate first - BlueprintScreen will reset engine state on focus
      // This prevents the idle UI from flickering during transition
      navigation.navigate('Blueprint')
    }
  }, [navigation])

  // Handle focus events - reset engine only when returning from another screen
  // NOTE: This callback must NOT access SharedValues directly to avoid worklet conversion
  useFocusEffect(
    useCallback(() => {
      // Reset navigation flag on focus
      hasNavigatedRef.current = false

      // Only reset engine if not currently extracting
      // We check isExtractingRef which is set true when extraction starts
      // and set false on blur cleanup - this prevents reset during extraction->Blueprint transition
      if (!isExtractingRef.current) {
        resetEngine()
        enableIdleButton()
      }

      // CRITICAL: Cleanup on blur
      return () => {
        disableIdleButton()
        // Clear extraction flag on blur for safety (handles edge cases)
        isExtractingRef.current = false
      }
    }, [resetEngine, enableIdleButton, disableIdleButton]),
  )

  // Reset content opacity when screen gains focus (separate from useFocusEffect to avoid worklet issues)
  useFocusEffect(
    useCallback(() => {
      contentOpacity.value = 1
    }, [contentOpacity]),
  )

  // Separate effect for handling extraction - runs when extractionParams changes
  // Note: isExtractingRef is set to true in render phase when params exist
  useEffect(() => {
    if (extractionParams && !engineState.isCalculating) {
      // Ref is already true from render phase
      disableIdleButton()
      startStatusPulse()
      startExtraction(() => {
        stopStatusPulse()
        // Fade out content before navigating
        contentOpacity.value = withTiming(0, {duration: 1000, easing: Easing.out(Easing.ease)}, () => {
          runOnJS(navigateToBlueprint)()
        })
      })
    }
  }, [extractionParams, engineState.isCalculating, disableIdleButton, startStatusPulse, startExtraction, stopStatusPulse, contentOpacity, navigateToBlueprint])

  // Start pulse when calculating
  useEffect(() => {
    if (engineState.isCalculating) {
      startStatusPulse()
    } else {
      stopStatusPulse()
    }
  }, [engineState.isCalculating])

  const handleBeginAlignment = () => {
    navigation.navigate('Input')
  }

  const handleLogoPress = () => {
    resetEngine()
  }

  return (
    <ScreenWrapper>
      <Animated.View style={[styles.content, contentStyle]}>
        {/* Logo */}
        <TouchableOpacity
          onPress={handleLogoPress}
          activeOpacity={0.7}
          style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/numeros_text.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Animated.View entering={FadeIn.duration(500)} style={styles.screenContainer}>
          <LoveEngine
            isCalculating={engineState.isCalculating}
            resultNumber={engineState.resultNumber}
            currentPhase={animationValues.currentPhase}
            intensity={animationValues.intensity}
            extractionProgress={animationValues.extractionProgress}
            resultOpacity={animationValues.resultOpacity}
            resultScale={animationValues.resultScale}
          />

          <View style={styles.statusContainer}>
            <Text style={styles.statusLabel}>LOVE ENGINE</Text>
            <Animated.Text style={[styles.statusText, statusTextStyle]}>
              {statusText}
            </Animated.Text>
            <Text style={styles.subStatus}>{subStatus}</Text>
          </View>

          {idleButtonEnabled && (
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
      </Animated.View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
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
    gap: 12,
  },
  statusLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 4,
    color: colors.textDim,
  },
  statusText: {
    fontSize: 17,
    color: colors.textSecondary,
    fontFamily: fonts.serif,
  },
  subStatus: {
    fontSize: 16,
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
    fontFamily: fonts.monoSemiBold,
    fontSize: 15,
    letterSpacing: 3,
    color: colors.textSecondary,
  },
})
