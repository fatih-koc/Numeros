import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../navigation/types'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  interpolate,
} from 'react-native-reanimated'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {useNumerology} from '../contexts'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import {ZODIAC_SYMBOLS} from '../lib/planetMeanings'

const NUMBER_COLORS = {
  life: '#F59E0B',
  soul: '#06B6D4',
  expression: '#10B981',
  personality: '#F472B6',
}

interface ProfileCardProps {
  numbers: {life: number; soul: number; expression: number; personality: number}
  placeholderColor: string
  size: number
}

function ProfileCard({numbers, placeholderColor, size}: ProfileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const rotation = useSharedValue(0)

  const handleFlip = () => {
    const newValue = isFlipped ? 0 : 180
    rotation.value = withTiming(newValue, {
      duration: 700,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    })
    setIsFlipped(!isFlipped)
  }

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [0, 180])
    return {
      transform: [{perspective: 1000}, {rotateY: `${rotateY}deg`}],
      backfaceVisibility: 'hidden',
    }
  })

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(rotation.value, [0, 180], [180, 360])
    return {
      transform: [{perspective: 1000}, {rotateY: `${rotateY}deg`}],
      backfaceVisibility: 'hidden',
    }
  })

  return (
    <Pressable onPress={handleFlip} style={[profileStyles.container, {width: size, height: size}]}>
      {/* Front - Numbers Grid */}
      <Animated.View style={[profileStyles.face, frontAnimatedStyle]}>
        <View style={profileStyles.numbersGrid}>
          <View style={[profileStyles.quadrant, {backgroundColor: `${NUMBER_COLORS.life}18`}]}>
            <Text
              style={[
                profileStyles.number,
                {
                  color: NUMBER_COLORS.life,
                  textShadowColor: NUMBER_COLORS.life,
                },
              ]}>
              {numbers.life}
            </Text>
          </View>
          <View style={[profileStyles.quadrant, {backgroundColor: `${NUMBER_COLORS.soul}18`}]}>
            <Text
              style={[
                profileStyles.number,
                {
                  color: NUMBER_COLORS.soul,
                  textShadowColor: NUMBER_COLORS.soul,
                },
              ]}>
              {numbers.soul}
            </Text>
          </View>
          <View style={[profileStyles.quadrant, {backgroundColor: `${NUMBER_COLORS.expression}18`}]}>
            <Text
              style={[
                profileStyles.number,
                {
                  color: NUMBER_COLORS.expression,
                  textShadowColor: NUMBER_COLORS.expression,
                },
              ]}>
              {numbers.expression}
            </Text>
          </View>
          <View style={[profileStyles.quadrant, {backgroundColor: `${NUMBER_COLORS.personality}18`}]}>
            <Text
              style={[
                profileStyles.number,
                {
                  color: NUMBER_COLORS.personality,
                  textShadowColor: NUMBER_COLORS.personality,
                },
              ]}>
              {numbers.personality}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Back - Placeholder */}
      <Animated.View style={[profileStyles.face, profileStyles.backFace, backAnimatedStyle]}>
        <View style={[profileStyles.placeholder, {backgroundColor: `${placeholderColor}20`}]}>
          <View style={[profileStyles.placeholderIcon, {backgroundColor: `${placeholderColor}40`}]}>
            <Text style={[profileStyles.placeholderText, {color: placeholderColor}]}>?</Text>
          </View>
        </View>
      </Animated.View>
    </Pressable>
  )
}

const profileStyles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  backFace: {
    // Back face is initially rotated 180deg
  },
  numbersGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: 'rgba(10, 8, 20, 0.6)',
  },
  quadrant: {
    width: '50%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontFamily: fonts.serif,
    fontSize: 42,
    fontWeight: '600',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 30,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontFamily: fonts.serif,
    fontSize: 32,
    fontWeight: '500',
  },
})

const MOCK_PROFILES = [
  {
    numbers: {life: 7, soul: 2, expression: 9, personality: 4},
    placeholderColor: '#6366F1',
  },
  {
    numbers: {life: 3, soul: 6, expression: 5, personality: 8},
    placeholderColor: '#F59E0B',
  },
  {
    numbers: {life: 5, soul: 1, expression: 7, personality: 3},
    placeholderColor: '#10B981',
  },
  {
    numbers: {life: 1, soul: 9, expression: 2, personality: 6},
    placeholderColor: '#EC4899',
  },
]

type SoftGateNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SoftGate'>

export function SoftGateScreen() {
  const navigation = useNavigation<SoftGateNavigationProp>()
  const {scanOutput} = useNumerology()
  const {width: screenWidth} = useWindowDimensions()

  // Calculate card size: container max 400, padding 24*2, gap 12
  const containerWidth = Math.min(screenWidth - 48, 400) - 48
  const cardSize = (containerWidth - 12) / 2

  if (!scanOutput) {
    navigation.goBack()
    return null
  }

  const {life_path, soul_urge, expression, personality} = scanOutput.numerology
  const sunSign = scanOutput.astrology?.planets?.sun?.sign || 'Aries'
  const fullName = scanOutput.computed?.name_full || 'You'

  const handleCreateAccount = () => {
    navigation.navigate('ProfileSetup')
  }

  const handleSkip = () => {
    navigation.navigate('UniverseScan')
  }

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
          {/* Header Text */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Your signature is ready.</Text>
            <Text style={styles.headerSubtitle}>One step to find resonance.</Text>
          </View>

          {/* User Name / Sign */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{fullName}</Text>
            <View style={styles.signRow}>
              <Text style={styles.signSymbol}>{ZODIAC_SYMBOLS[sunSign]}</Text>
              <Text style={styles.signName}>{sunSign}</Text>
            </View>
          </View>

          {/* User Numbers - 4 Equal Columns */}
          <View style={styles.numbersGrid}>
            <View style={[styles.numberBox, {backgroundColor: `${NUMBER_COLORS.life}15`, borderColor: `${NUMBER_COLORS.life}30`}]}>
              <Text style={[styles.numberValue, {color: NUMBER_COLORS.life}]}>{life_path}</Text>
              <Text style={styles.numberLabel}>Life</Text>
            </View>
            <View style={[styles.numberBox, {backgroundColor: `${NUMBER_COLORS.soul}15`, borderColor: `${NUMBER_COLORS.soul}30`}]}>
              <Text style={[styles.numberValue, {color: NUMBER_COLORS.soul}]}>{soul_urge}</Text>
              <Text style={styles.numberLabel}>Soul</Text>
            </View>
            <View style={[styles.numberBox, {backgroundColor: `${NUMBER_COLORS.expression}15`, borderColor: `${NUMBER_COLORS.expression}30`}]}>
              <Text style={[styles.numberValue, {color: NUMBER_COLORS.expression}]}>{expression}</Text>
              <Text style={styles.numberLabel}>Expr</Text>
            </View>
            <View style={[styles.numberBox, {backgroundColor: `${NUMBER_COLORS.personality}15`, borderColor: `${NUMBER_COLORS.personality}30`}]}>
              <Text style={[styles.numberValue, {color: NUMBER_COLORS.personality}]}>{personality}</Text>
              <Text style={styles.numberLabel}>Self</Text>
            </View>
          </View>

          {/* Souls Awaiting Resonance */}
          <View style={styles.soulsSection}>
            <Text style={styles.soulsTitle}>Souls Awaiting Resonance</Text>
            <View style={styles.profilesGrid}>
              {MOCK_PROFILES.map((profile, index) => (
                <ProfileCard key={index} numbers={profile.numbers} placeholderColor={profile.placeholderColor} size={cardSize} />
              ))}
            </View>
          </View>

          {/* Social Proof */}
          <Text style={styles.socialProof}>12,847 resonances today</Text>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateAccount}
            activeOpacity={0.8}>
            <Text style={styles.createButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Skip Link */}
          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}>
            <Text style={styles.skipButtonText}>Skip and explore</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(26, 21, 51, 0.6)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontFamily: fonts.serifLight,
    fontSize: 24,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  signRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signSymbol: {
    fontFamily: fonts.symbols,
    fontSize: 16,
    color: colors.textDim,
  },
  signName: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textDim,
  },
  numbersGrid: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
    marginBottom: 20,
  },
  numberBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  numberValue: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 32,
  },
  numberLabel: {
    fontFamily: fonts.mono,
    fontSize: 8,
    color: colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  soulsSection: {
    alignItems: 'center',
    gap: 12,
    width: '100%',
    marginBottom: 12,
  },
  soulsTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  profilesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  socialProof: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.35)',
    letterSpacing: 0.5,
    marginBottom: 16,
  },
  createButton: {
    width: '100%',
    height: 52,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  createButtonText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    letterSpacing: 3,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
  skipButton: {
    paddingVertical: 8,
  },
  skipButtonText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
    letterSpacing: 0.5,
  },
})
