import React, {useState, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  PanResponderGestureState,
} from 'react-native'
import {Feather} from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

const {width: SCREEN_WIDTH} = Dimensions.get('window')
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 32, 358)
const CARD_HEIGHT = 520
const SWIPE_THRESHOLD = 100
const VERTICAL_THRESHOLD = 80

export interface Profile {
  id: string
  name: string
  age: number
  distance: string
  matchPercentage: number
  matchLabel: string
  imageUrl: string
  highlights: {text: string; checked: boolean}[]
}

const MOCK_PROFILES: Profile[] = [
  {
    id: '1',
    name: 'Sarah',
    age: 28,
    distance: '2.4 km away',
    matchPercentage: 94,
    matchLabel: 'Magnetic',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600',
    highlights: [
      {text: 'LP 5 x 3', checked: true},
      {text: 'Venus trine Moon', checked: true},
    ],
  },
  {
    id: '2',
    name: 'Marcus',
    age: 31,
    distance: '5.1 km away',
    matchPercentage: 88,
    matchLabel: 'Strong',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600',
    highlights: [
      {text: 'Sun opposite Mars', checked: false},
      {text: 'LP 7 x 7', checked: true},
    ],
  },
  {
    id: '3',
    name: 'Elena',
    age: 26,
    distance: '1.8 km away',
    matchPercentage: 82,
    matchLabel: 'Good',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600',
    highlights: [
      {text: 'Merc conj Jup', checked: true},
      {text: 'Moon sq Sat', checked: false},
    ],
  },
]

interface DiscoverTabProps {
  onViewProfile?: (profileId: string) => void
  onResonate?: (profileId: string) => void
}

export function DiscoverTab({onViewProfile, onResonate}: DiscoverTabProps) {
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES)
  const [swipesRemaining, setSwipesRemaining] = useState(7)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  const activeProfile = profiles[0]
  const nextProfile = profiles[1]

  const showToast = (message: string) => {
    setToastMessage(message)
    setTimeout(() => setToastMessage(null), 2000)
  }

  const handleRemoveProfile = (id: string) => {
    setProfiles(prev => prev.filter(p => p.id !== id))
  }

  const handleSwipeLeft = () => {
    if (swipesRemaining > 0 && activeProfile) {
      setSwipesRemaining(prev => prev - 1)
      handleRemoveProfile(activeProfile.id)
    }
  }

  const handleSwipeRight = () => {
    if (swipesRemaining > 0 && activeProfile) {
      setSwipesRemaining(prev => prev - 1)
      handleRemoveProfile(activeProfile.id)
      showToast('Resonance Sent')
      if (onResonate) onResonate(activeProfile.id)
    }
  }

  const handleStar = () => {
    if (activeProfile) {
      handleRemoveProfile(activeProfile.id)
      showToast('Saved to Stars')
    }
  }

  const handlePullDown = () => {
    if (onViewProfile && activeProfile) onViewProfile(activeProfile.id)
  }

  if (!activeProfile || swipesRemaining <= 0) {
    return <EmptyState limitReached={swipesRemaining <= 0} />
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discover</Text>
        <View style={styles.counterContainer}>
          <Text style={styles.counterValue}>{swipesRemaining} of 11</Text>
          <Text style={styles.counterLabel}>remaining today</Text>
        </View>
      </View>

      {/* Card Stack */}
      <View style={styles.cardStack}>
        {/* Background Card (Next) */}
        {nextProfile && (
          <View style={styles.backCard}>
            <Image
              source={{uri: nextProfile.imageUrl}}
              style={styles.backCardImage}
            />
            <View style={styles.backCardOverlay} />
          </View>
        )}

        {/* Active Card */}
        <SwipeableCard
          profile={activeProfile}
          onSwipeLeft={handleSwipeLeft}
          onSwipeRight={handleSwipeRight}
          onPullUp={handleStar}
          onPullDown={handlePullDown}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {/* Pass Button */}
        <TouchableOpacity
          style={styles.passButton}
          onPress={handleSwipeLeft}
          activeOpacity={0.7}>
          <Feather name="x" size={24} color="rgba(255, 255, 255, 0.6)" />
        </TouchableOpacity>

        {/* Star Button */}
        <TouchableOpacity
          style={styles.starButton}
          onPress={handleStar}
          activeOpacity={0.7}>
          <Feather name="star" size={20} color="#FBBF24" />
        </TouchableOpacity>

        {/* Resonate Button */}
        <TouchableOpacity
          style={styles.resonateButton}
          onPress={handleSwipeRight}
          activeOpacity={0.8}>
          <LinearGradient
            colors={['#8B5CF6', '#EC4899']}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={StyleSheet.absoluteFill}
          />
          <Feather name="heart" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Toast */}
      {toastMessage && (
        <Animated.View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}
    </View>
  )
}

interface SwipeableCardProps {
  profile: Profile
  onSwipeLeft: () => void
  onSwipeRight: () => void
  onPullUp: () => void
  onPullDown: () => void
}

function SwipeableCard({
  profile,
  onSwipeLeft,
  onSwipeRight,
  onPullUp,
  onPullDown,
}: SwipeableCardProps) {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        translateX.value = gestureState.dx
        translateY.value = gestureState.dy
      },
      onPanResponderRelease: (_, gestureState: PanResponderGestureState) => {
        const {dx, dy, vx, vy} = gestureState

        // Check horizontal vs vertical dominance
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > SWIPE_THRESHOLD || vx > 0.5) {
            translateX.value = withTiming(SCREEN_WIDTH * 1.5, {duration: 300}, () => {
              runOnJS(onSwipeRight)()
            })
            return
          } else if (dx < -SWIPE_THRESHOLD || vx < -0.5) {
            translateX.value = withTiming(-SCREEN_WIDTH * 1.5, {duration: 300}, () => {
              runOnJS(onSwipeLeft)()
            })
            return
          }
        } else {
          // Vertical swipe
          if (dy < -VERTICAL_THRESHOLD || vy < -0.5) {
            translateY.value = withTiming(-500, {duration: 300}, () => {
              runOnJS(onPullUp)()
            })
            return
          } else if (dy > VERTICAL_THRESHOLD || vy > 0.5) {
            runOnJS(onPullDown)()
          }
        }

        // Snap back
        translateX.value = withSpring(0)
        translateY.value = withSpring(0)
      },
    })
  ).current

  const cardStyle = useAnimatedStyle(() => {
    const rotate = interpolate(
      translateX.value,
      [-200, 200],
      [-15, 15],
      Extrapolation.CLAMP
    )

    return {
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
        {rotate: `${rotate}deg`},
      ],
    }
  })

  const passIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [-100, -20], [1, 0], Extrapolation.CLAMP),
  }))

  const resonateIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateX.value, [20, 100], [0, 1], Extrapolation.CLAMP),
  }))

  const starIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [-100, -20], [1, 0], Extrapolation.CLAMP),
  }))

  const viewProfileIndicatorStyle = useAnimatedStyle(() => ({
    opacity: interpolate(translateY.value, [20, 100], [0, 1], Extrapolation.CLAMP),
  }))

  const matchColor =
    profile.matchPercentage >= 90
      ? '#10B981'
      : profile.matchPercentage >= 80
        ? '#F59E0B'
        : 'white'

  return (
    <Animated.View
      style={[styles.card, cardStyle]}
      {...panResponder.panHandlers}>
      {/* Photo Area */}
      <View style={styles.photoArea}>
        <Image source={{uri: profile.imageUrl}} style={styles.photo} />

        {/* Gradient Overlay */}
        <LinearGradient
          colors={['transparent', 'rgba(0, 0, 0, 0.9)']}
          style={styles.photoGradient}
        />

        {/* Photo Indicators */}
        <View style={styles.photoIndicators}>
          <View style={[styles.photoDot, styles.photoDotActive]} />
          <View style={styles.photoDot} />
          <View style={styles.photoDot} />
          <View style={styles.photoDot} />
        </View>

        {/* Match Badge */}
        <View style={styles.matchBadge}>
          <Text style={[styles.matchPercent, {color: matchColor}]}>
            {profile.matchPercentage}%
          </Text>
          <Text style={styles.matchLabel}>{profile.matchLabel}</Text>
        </View>

        {/* Info Overlay */}
        <View style={styles.infoOverlay}>
          <Text style={styles.nameAge}>
            {profile.name}, {profile.age}
          </Text>
          <View style={styles.distanceRow}>
            <Feather name="map-pin" size={12} color="rgba(255, 255, 255, 0.7)" />
            <Text style={styles.distance}>{profile.distance}</Text>
          </View>
        </View>

        {/* Swipe Indicators */}
        <Animated.View style={[styles.passIndicator, passIndicatorStyle]}>
          <Text style={styles.passIndicatorText}>PASS</Text>
        </Animated.View>

        <Animated.View style={[styles.resonateIndicator, resonateIndicatorStyle]}>
          <Text style={styles.resonateIndicatorText}>RESONATE</Text>
        </Animated.View>

        <Animated.View style={[styles.starIndicator, starIndicatorStyle]}>
          <Feather name="star" size={60} color="#FBBF24" />
        </Animated.View>

        <Animated.View style={[styles.viewProfileIndicator, viewProfileIndicatorStyle]}>
          <Text style={styles.viewProfileText}>VIEW PROFILE</Text>
        </Animated.View>
      </View>

      {/* Compatibility Strip */}
      <View style={styles.compatibilityStrip}>
        <View style={styles.highlightsRow}>
          {profile.highlights.map((item, i) => (
            <View key={i} style={styles.highlightChip}>
              <Text style={styles.highlightText}>{item.text}</Text>
              {item.checked && <Text style={styles.checkmark}>check</Text>}
            </View>
          ))}
        </View>
      </View>
    </Animated.View>
  )
}

function EmptyState({limitReached}: {limitReached: boolean}) {
  return (
    <View style={styles.emptyState}>
      {limitReached ? (
        <>
          <View style={styles.emptyIconContainer}>
            <View style={styles.emptyGlow} />
            <Feather name="moon" size={80} color="#F59E0B" />
          </View>
          <Text style={styles.emptyTitle}>
            You've discovered everyone for today
          </Text>
          <Text style={styles.emptySubtitle}>
            Come back tomorrow for 11 fresh profiles aligned with your energy.
          </Text>
          <View style={styles.resetTimer}>
            <Text style={styles.resetTimerText}>Resets in 8h 42m</Text>
          </View>
          <TouchableOpacity style={styles.premiumButton} activeOpacity={0.7}>
            <Text style={styles.premiumButtonText}>Explore Premium</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Feather name="compass" size={80} color="rgba(255, 255, 255, 0.2)" />
          <Text style={styles.emptyTitle}>Expanding your universe...</Text>
          <Text style={styles.emptySubtitle}>
            We're finding more aligned souls. Check back soon.
          </Text>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  counterContainer: {
    alignItems: 'flex-end',
  },
  counterValue: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  counterLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.3)',
    textTransform: 'uppercase',
  },
  cardStack: {
    flex: 1,
    alignItems: 'center',
    marginTop: 8,
  },
  backCard: {
    position: 'absolute',
    top: 16,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    opacity: 0.6,
    transform: [{scale: 0.95}],
  },
  backCardImage: {
    width: '100%',
    height: '70%',
    opacity: 0.5,
  },
  backCardOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '30%',
    backgroundColor: colors.bgMid,
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  photoArea: {
    height: '70%',
    width: '100%',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoGradient: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 150,
  },
  photoIndicators: {
    position: 'absolute',
    top: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  photoDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  photoDotActive: {
    backgroundColor: 'white',
  },
  matchBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  matchPercent: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '600',
  },
  matchLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 16,
    paddingBottom: 24,
  },
  nameAge: {
    fontFamily: fonts.serif,
    fontSize: 28,
    fontWeight: '500',
    color: 'white',
  },
  distanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  distance: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  passIndicator: {
    position: 'absolute',
    top: 40,
    right: 40,
    transform: [{rotate: '12deg'}],
    borderWidth: 4,
    borderColor: '#EF4444',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  passIndicatorText: {
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
    letterSpacing: 3,
  },
  resonateIndicator: {
    position: 'absolute',
    top: 40,
    left: 40,
    transform: [{rotate: '-12deg'}],
    borderWidth: 4,
    borderColor: '#10B981',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resonateIndicatorText: {
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    letterSpacing: 3,
  },
  starIndicator: {
    position: 'absolute',
    top: 80,
    alignSelf: 'center',
  },
  viewProfileIndicator: {
    position: 'absolute',
    bottom: 80,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  viewProfileText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  compatibilityStrip: {
    height: '30%',
    backgroundColor: colors.bgMid,
    padding: 16,
    paddingTop: 8,
  },
  highlightsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  highlightChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  highlightText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  checkmark: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: '#10B981',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 24,
    alignItems: 'center',
    marginBottom: 120,
    marginTop: 24,
  },
  passButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resonateButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 20,
  },
  toast: {
    position: 'absolute',
    bottom: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toastText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'white',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    paddingBottom: 100,
  },
  emptyIconContainer: {
    marginBottom: 24,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyGlow: {
    position: 'absolute',
    width: 100,
    height: 100,
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 50,
  },
  emptyTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 24,
    maxWidth: 260,
  },
  resetTimer: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 32,
  },
  resetTimerText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.accentViolet,
  },
  premiumButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: 4,
  },
  premiumButtonText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: '#FBBF24',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
})
