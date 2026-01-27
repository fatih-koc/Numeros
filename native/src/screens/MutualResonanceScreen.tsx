import React, {useEffect, useState, useMemo} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Image, Dimensions} from 'react-native'
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Feather} from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import type {RootStackParamList} from '../navigation/types'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window')

type Phase = 'collision' | 'orbit' | 'merge' | 'celebration' | 'reveal'

type MutualNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MutualResonance'>
type MutualRouteProp = RouteProp<RootStackParamList, 'MutualResonance'>

// Confetti particle type
interface ConfettiParticle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  delay: number
}

export function MutualResonanceScreen() {
  const navigation = useNavigation<MutualNavigationProp>()
  const route = useRoute<MutualRouteProp>()
  const insets = useSafeAreaInsets()

  const {matchName = 'Sarah', matchPercentage = 94} = route.params || {}

  const [phase, setPhase] = useState<Phase>('collision')

  const userPhoto = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300'
  const targetPhoto = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300'

  // Generate confetti
  const confetti = useMemo<ConfettiParticle[]>(
    () =>
      Array.from({length: 40}).map((_, i) => ({
        id: i,
        x: Math.random() * 300 - 150,
        y: Math.random() * 300 - 150,
        color: ['#FBBF24', '#8B5CF6', '#EC4899', '#ffffff'][Math.floor(Math.random() * 4)],
        size: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        delay: Math.random() * 200,
      })),
    []
  )

  // Animation values
  const flashOpacity = useSharedValue(0)
  const ringScale = useSharedValue(0)
  const ringOpacity = useSharedValue(1)
  const revealOpacity = useSharedValue(0)

  useEffect(() => {
    // Phase 1: Collision (0-2000ms)
    setPhase('collision')

    // Phase 2: Orbit (2000ms)
    const t2 = setTimeout(() => setPhase('orbit'), 2000)

    // Phase 3: Merge (3000ms) - Flash
    const t3 = setTimeout(() => {
      setPhase('merge')
      flashOpacity.value = withSequence(
        withTiming(1, {duration: 100}),
        withTiming(0, {duration: 200})
      )
    }, 3000)

    // Phase 4: Celebration (3500ms)
    const t4 = setTimeout(() => {
      setPhase('celebration')
      ringScale.value = withTiming(4, {duration: 1000, easing: Easing.out(Easing.ease)})
      ringOpacity.value = withTiming(0, {duration: 1000})
    }, 3500)

    // Phase 5: Reveal (4500ms)
    const t5 = setTimeout(() => {
      setPhase('reveal')
      revealOpacity.value = withTiming(1, {duration: 800})
    }, 4500)

    return () => {
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [])

  const flashStyle = useAnimatedStyle(() => ({
    opacity: flashOpacity.value,
  }))

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{scale: ringScale.value}],
    opacity: ringOpacity.value,
  }))

  const revealStyle = useAnimatedStyle(() => ({
    opacity: revealOpacity.value,
    transform: [{translateY: interpolate(revealOpacity.value, [0, 1], [20, 0])}],
  }))

  const handleConversation = () => {
    navigation.navigate('Conversation', {
      conversationId: '1',
      name: matchName,
      imageUrl: targetPhoto,
    })
  }

  const handleViewProfile = () => {
    navigation.navigate('FullProfile', {profileId: '1'})
  }

  const handleClose = () => {
    navigation.goBack()
  }

  const matchColor = matchPercentage >= 90 ? '#10B981' : '#F59E0B'

  return (
    <View style={styles.container}>
      {/* Background Stars */}
      <View style={styles.starsContainer}>
        {Array.from({length: 50}).map((_, i) => (
          <BackgroundStar key={i} index={i} />
        ))}
      </View>

      {/* Flash Effect */}
      <Animated.View style={[styles.flash, flashStyle]} pointerEvents="none" />

      {/* Celebration Effects */}
      {(phase === 'celebration' || phase === 'reveal') && (
        <View style={styles.celebrationContainer} pointerEvents="none">
          {/* Expanding Ring */}
          <Animated.View style={[styles.ring, ringStyle]} />

          {/* Confetti */}
          {confetti.map(particle => (
            <ConfettiPiece key={particle.id} particle={particle} />
          ))}
        </View>
      )}

      {/* Reveal Content */}
      {phase === 'reveal' && (
        <Animated.View style={[styles.revealContent, revealStyle, {paddingTop: insets.top + 40}]}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Feather name="x" size={20} color="rgba(255, 255, 255, 0.5)" />
          </TouchableOpacity>

          {/* Header */}
          <Text style={styles.header}>Eros Activated</Text>

          {/* Photos */}
          <View style={styles.photosContainer}>
            <View style={styles.photoWrapper}>
              <View style={[styles.photoBorder, {borderColor: colors.accentViolet}]}>
                <Image source={{uri: userPhoto}} style={styles.photo} />
              </View>
              <Text style={styles.photoLabel}>You</Text>
            </View>

            <View style={styles.starIcon}>
              <Feather name="star" size={32} color="#FBBF24" />
            </View>

            <View style={styles.photoWrapper}>
              <View style={[styles.photoBorder, {borderColor: colors.accentPink}]}>
                <Image source={{uri: targetPhoto}} style={styles.photo} />
              </View>
              <Text style={styles.photoLabel}>{matchName}</Text>
            </View>
          </View>

          {/* Match Percentage */}
          <View style={styles.matchSection}>
            <Text style={[styles.matchPercent, {color: matchColor}]}>{matchPercentage}%</Text>
            <Text style={styles.matchLabel}>Cosmic Compatibility</Text>
          </View>

          {/* Compatibility Bars */}
          <View style={styles.barsContainer}>
            {[
              {val: 18, max: 20, color: '#F59E0B'},
              {val: 17, max: 20, color: '#06B6D4'},
              {val: 14, max: 20, color: '#10B981'},
              {val: 12, max: 20, color: '#F472B6'},
            ].map((bar, i) => (
              <View key={i} style={styles.barItem}>
                <View style={styles.barTrack}>
                  <Animated.View
                    style={[
                      styles.barFill,
                      {
                        width: `${(bar.val / bar.max) * 100}%`,
                        backgroundColor: bar.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barValue}>{bar.val}</Text>
              </View>
            ))}
          </View>

          {/* Magnetic Reasons */}
          <View style={styles.reasonsCard}>
            <Text style={styles.reasonsTitle}>Why you're magnetic</Text>
            <View style={styles.reasonsList}>
              {[
                'Your 7 depth meets her 5 adventure',
                'Venus trine Moon: Emotional harmony',
                'Low friction, high spark',
              ].map((reason, i) => (
                <View key={i} style={styles.reasonItem}>
                  <Text style={styles.reasonStar}>*</Text>
                  <Text style={styles.reasonText}>{reason}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.conversationButton} onPress={handleConversation}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.conversationButtonText}>BEGIN CONVERSATION</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.viewProfileButton} onPress={handleViewProfile}>
              <Text style={styles.viewProfileButtonText}>View Profile</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      )}

      {/* Pre-reveal animation states */}
      {phase !== 'reveal' && (
        <View style={styles.animationContainer}>
          {phase === 'collision' && <CollisionAnimation />}
          {phase === 'orbit' && <OrbitAnimation />}
        </View>
      )}
    </View>
  )
}

function BackgroundStar({index}: {index: number}) {
  const opacity = useSharedValue(Math.random() * 0.4 + 0.1)

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(Math.random() * 0.2 + 0.1, {duration: 2000 + Math.random() * 2000}),
      -1,
      true
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }))

  const size = Math.random() * 2 + 1

  return (
    <Animated.View
      style={[
        styles.bgStar,
        {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          width: size,
          height: size,
        },
        style,
      ]}
    />
  )
}

function ConfettiPiece({particle}: {particle: ConfettiParticle}) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const opacity = useSharedValue(1)
  const scale = useSharedValue(0)

  useEffect(() => {
    translateX.value = withDelay(particle.delay, withTiming(particle.x, {duration: 1500}))
    translateY.value = withDelay(particle.delay, withTiming(particle.y + 100, {duration: 1500}))
    opacity.value = withDelay(particle.delay, withTiming(0, {duration: 1500}))
    scale.value = withDelay(particle.delay, withTiming(1, {duration: 200}))
  }, [])

  const style = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}, {translateY: translateY.value}, {scale: scale.value}],
    opacity: opacity.value,
  }))

  return (
    <Animated.View
      style={[
        styles.confetti,
        {
          backgroundColor: particle.color,
          width: particle.size,
          height: particle.size,
        },
        style,
      ]}
    />
  )
}

function CollisionAnimation() {
  const userX = useSharedValue(-150)
  const userY = useSharedValue(150)
  const targetX = useSharedValue(150)
  const targetY = useSharedValue(-150)

  useEffect(() => {
    userX.value = withTiming(-20, {duration: 2000, easing: Easing.in(Easing.ease)})
    userY.value = withTiming(20, {duration: 2000, easing: Easing.in(Easing.ease)})
    targetX.value = withTiming(20, {duration: 2000, easing: Easing.in(Easing.ease)})
    targetY.value = withTiming(-20, {duration: 2000, easing: Easing.in(Easing.ease)})
  }, [])

  const userStyle = useAnimatedStyle(() => ({
    transform: [{translateX: userX.value}, {translateY: userY.value}],
  }))

  const targetStyle = useAnimatedStyle(() => ({
    transform: [{translateX: targetX.value}, {translateY: targetY.value}],
  }))

  return (
    <View style={styles.collisionContainer}>
      <Animated.View style={[styles.constellation, userStyle]}>
        <View style={styles.constellationCircle}>
          <Text style={[styles.sigil, {color: '#F59E0B'}]}>7</Text>
        </View>
      </Animated.View>
      <Animated.View style={[styles.constellation, targetStyle]}>
        <View style={styles.constellationCircle}>
          <Text style={[styles.sigil, {color: '#FBBF24'}]}>5</Text>
        </View>
      </Animated.View>
    </View>
  )
}

function OrbitAnimation() {
  const rotation = useSharedValue(0)
  const scale = useSharedValue(1)

  const numbers = [
    {val: 7, color: '#F59E0B'},
    {val: 4, color: '#06B6D4'},
    {val: 8, color: '#10B981'},
    {val: 2, color: '#F472B6'},
    {val: 5, color: '#F59E0B'},
    {val: 9, color: '#06B6D4'},
    {val: 3, color: '#10B981'},
    {val: 6, color: '#F472B6'},
  ]

  useEffect(() => {
    rotation.value = withTiming(360, {duration: 1000, easing: Easing.linear})
    scale.value = withTiming(0.5, {duration: 1000, easing: Easing.in(Easing.ease)})
  }, [])

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}, {scale: scale.value}],
  }))

  return (
    <Animated.View style={[styles.orbitContainer, containerStyle]}>
      {numbers.map((num, i) => {
        const angle = (i / 8) * 2 * Math.PI
        const r = 60
        const x = Math.cos(angle) * r
        const y = Math.sin(angle) * r

        return (
          <View
            key={i}
            style={[
              styles.orbitNumber,
              {
                left: 60 + x - 12,
                top: 60 + y - 12,
              },
            ]}>
            <Text style={[styles.orbitNumberText, {color: num.color}]}>{num.val}</Text>
          </View>
        )
      })}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  starsContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  bgStar: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
  },
  flash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    zIndex: 50,
  },
  celebrationContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  ring: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FBBF24',
    position: 'absolute',
  },
  confetti: {
    position: 'absolute',
    borderRadius: 10,
  },
  animationContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  collisionContainer: {
    width: 300,
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  constellation: {
    position: 'absolute',
  },
  constellationCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sigil: {
    fontFamily: fonts.serif,
    fontSize: 32,
    fontWeight: '600',
  },
  orbitContainer: {
    width: 120,
    height: 120,
  },
  orbitNumber: {
    position: 'absolute',
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  orbitNumberText: {
    fontFamily: fonts.serif,
    fontSize: 14,
    fontWeight: 'bold',
  },
  revealContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    zIndex: 30,
  },
  closeButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: '600',
    color: '#FBBF24',
    marginBottom: 32,
    textShadowColor: 'rgba(251, 191, 36, 0.6)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
  },
  photosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  photoWrapper: {
    alignItems: 'center',
    gap: 8,
  },
  photoBorder: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 2,
    padding: 2,
  },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    resizeMode: 'cover',
  },
  photoLabel: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  starIcon: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  matchPercent: {
    fontFamily: fonts.serif,
    fontSize: 56,
    fontWeight: '600',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 30,
  },
  matchLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginTop: 4,
  },
  barsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 32,
  },
  barItem: {
    alignItems: 'center',
    gap: 4,
  },
  barTrack: {
    width: 70,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  barValue: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  reasonsCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 32,
  },
  reasonsTitle: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  reasonsList: {
    gap: 12,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  reasonStar: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: '#FBBF24',
  },
  reasonText: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 18,
  },
  actionButtons: {
    width: '100%',
    maxWidth: 340,
    gap: 12,
  },
  conversationButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  conversationButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
  },
  viewProfileButton: {
    width: '100%',
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProfileButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
  },
})
