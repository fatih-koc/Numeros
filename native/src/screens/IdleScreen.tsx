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
  const {engineState, statusText, subStatus, extractionParams, startExtraction, resetEngine} =
    useEngine()
  const hasNavigatedRef = useRef(false)

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
      navigation.navigate('Blueprint')
    }
  }, [navigation])

  // Handle extraction when params are set (returning from Input screen)
  useFocusEffect(
    useCallback(() => {
      // Reset navigation flag when screen focuses
      hasNavigatedRef.current = false
      contentOpacity.value = 1

      if (extractionParams && !engineState.isCalculating) {
        startStatusPulse()
        startExtraction(() => {
          stopStatusPulse()
          // Fade out content before navigating
          contentOpacity.value = withTiming(0, {duration: 1000, easing: Easing.out(Easing.ease)}, () => {
            runOnJS(navigateToBlueprint)()
          })
        })
      }
    }, [extractionParams, engineState.isCalculating]),
  )

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
    fontSize: 12,
    letterSpacing: 4,
    color: colors.textDim,
  },
  statusText: {
    fontSize: 19,
    fontWeight: '400',
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
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 3,
    color: colors.textSecondary,
  },
})
