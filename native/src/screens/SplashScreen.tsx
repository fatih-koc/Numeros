import React, {useEffect} from 'react'
import {StyleSheet, View, Image} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

const SPLASH_DURATION = 2000

export function SplashScreen() {
  const navigation = useNavigation()

  // Logo scale animation (0.95 -> 1)
  const logoScale = useSharedValue(0.95)
  const logoOpacity = useSharedValue(0)

  // Text breathing animation (opacity cycles)
  const textOpacity = useSharedValue(0)

  useEffect(() => {
    // Logo entrance animation
    logoOpacity.value = withTiming(1, {duration: 400, easing: Easing.out(Easing.ease)})
    logoScale.value = withTiming(1, {duration: 400, easing: Easing.out(Easing.ease)})

    // Text breathing animation - starts after a short delay
    textOpacity.value = withSequence(
      withTiming(0, {duration: 200}), // initial delay
      withRepeat(
        withSequence(
          withTiming(0.8, {duration: 600, easing: Easing.inOut(Easing.ease)}),
          withTiming(0.4, {duration: 600, easing: Easing.inOut(Easing.ease)}),
          withTiming(0.8, {duration: 600, easing: Easing.inOut(Easing.ease)}),
        ),
        -1, // infinite
        false,
      ),
    )

    // Auto-navigate to Idle after splash duration
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{name: 'Idle'}],
      })
    }, SPLASH_DURATION)

    return () => clearTimeout(timer)
  }, [navigation, logoOpacity, logoScale, textOpacity])

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{scale: logoScale.value}],
  }))

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }))

  return (
    <ScreenWrapper>
      <View style={styles.content}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image
            source={require('../../assets/images/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Status Text */}
        <Animated.Text style={[styles.statusText, textStyle]}>
          Aligning energies...
        </Animated.Text>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 128,
    height: 128,
    opacity: 0.4,
  },
  statusText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '300',
    color: colors.textSecondary,
    textAlign: 'center',
  },
})
