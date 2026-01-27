import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  useWindowDimensions,
  Alert,
  Pressable,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../navigation/types'
import Animated, {FadeIn} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import Svg, {Path, Circle} from 'react-native-svg'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {TimerGateModal} from '../components/TimerGateModal'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface Match {
  id: number
  name: string
  age: number
  matchPercentage: number
  reason1: string
  reason2: string
  photoUrl: string
  unlockTimeMs: number
}

type ResonanceNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ResonanceResults'>

// Clock icon component
function ClockIcon({size = 14, color = '#8B5CF6'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Circle cx={12} cy={12} r={10} stroke={color} strokeWidth={2} />
      <Path d="M12 6v6l4 2" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

// X icon component
function XIcon({size = 24, color = 'rgba(255, 255, 255, 0.4)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M18 6L6 18M6 6l12 12" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

const MOCK_MATCHES: Match[] = [
  {
    id: 1,
    name: 'Sarah',
    age: 28,
    matchPercentage: 92,
    reason1: 'Life Path 5 × 3',
    reason2: 'Venus △ Moon',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    unlockTimeMs: 0,
  },
  {
    id: 2,
    name: 'Emma',
    age: 26,
    matchPercentage: 89,
    reason1: 'Soul Urge 7 × 9',
    reason2: 'Mars △ Mars',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    unlockTimeMs: 3 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
  {
    id: 3,
    name: 'Olivia',
    age: 29,
    matchPercentage: 87,
    reason1: 'Expression 1 × 5',
    reason2: 'Sun △ Moon',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    unlockTimeMs: 7 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
  {
    id: 4,
    name: 'Ava',
    age: 27,
    matchPercentage: 85,
    reason1: 'Life Path 2 × 6',
    reason2: 'Mercury △ Venus',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    unlockTimeMs: 11 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
  {
    id: 5,
    name: 'Mia',
    age: 25,
    matchPercentage: 84,
    reason1: 'Soul Urge 2 × 4',
    reason2: 'Jupiter △ Sun',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    unlockTimeMs: 15 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
  {
    id: 6,
    name: 'Sophia',
    age: 30,
    matchPercentage: 82,
    reason1: 'Life Path 3 × 5',
    reason2: 'Venus △ Moon',
    photoUrl: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400',
    unlockTimeMs: 19 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
]

const NEXT_SCAN_TIME_MS = 23 * 60 * 60 * 1000 + 42 * 60 * 1000

function formatTime(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

interface MatchCardProps {
  match: Match
  onReveal: () => void
  onShowModal: () => void
  cardWidth: number
}

function MatchCard({match, onReveal, onShowModal, cardWidth}: MatchCardProps) {
  const isReady = match.unlockTimeMs === 0

  return (
    <Pressable
      onPress={isReady ? onReveal : onShowModal}
      style={({pressed}) => [
        cardStyles.container,
        {width: cardWidth},
        pressed && cardStyles.containerPressed,
      ]}
    >
      {/* Full-bleed Background Image */}
      <ImageBackground
        source={{uri: match.photoUrl}}
        style={cardStyles.backgroundImage}
        imageStyle={[
          cardStyles.image,
          !isReady && cardStyles.imageBlurred,
        ]}
        blurRadius={isReady ? 0 : 12}
      >
        {/* Timer Badge - Top Center (only if locked) */}
        {!isReady && (
          <View style={cardStyles.timerBadgeContainer}>
            <View style={cardStyles.timerBadge}>
              <ClockIcon />
              <Text style={cardStyles.timerText}>{formatTime(match.unlockTimeMs)}</Text>
            </View>
          </View>
        )}

        {/* Bottom Gradient Overlay with Info */}
        <LinearGradient
          colors={['transparent', 'rgba(26, 21, 51, 0.6)', 'rgba(26, 21, 51, 0.95)']}
          locations={[0, 0.3, 1]}
          style={cardStyles.gradientOverlay}
        >
          {/* Name + Age Row */}
          <View style={cardStyles.nameRow}>
            <Text style={cardStyles.nameAge}>
              {match.name}, {match.age}
            </Text>
            <Text style={[cardStyles.matchPercent, isReady && cardStyles.matchPercentReady]}>
              {match.matchPercentage}%
            </Text>
          </View>

          {/* Match Reasons */}
          <View style={cardStyles.reasons}>
            <Text style={cardStyles.reasonText}>{match.reason1}</Text>
            <Text style={cardStyles.reasonText}>{match.reason2}</Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </Pressable>
  )
}

const cardStyles = StyleSheet.create({
  container: {
    height: 200,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  containerPressed: {
    transform: [{translateY: -2}],
    shadowColor: '#8B5CF6',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'space-between',
  },
  image: {
    resizeMode: 'cover',
    transform: [{scale: 1.1}],
  },
  imageBlurred: {
    opacity: 0.6,
  },
  timerBadgeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  timerText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 0.5,
  },
  gradientOverlay: {
    padding: 12,
    paddingTop: 24,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  nameAge: {
    fontFamily: fonts.mono,
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  matchPercent: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: {width: 0, height: 2},
    textShadowRadius: 4,
  },
  matchPercentReady: {
    color: '#A78BFA',
  },
  reasons: {
    gap: 2,
  },
  reasonText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 13,
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: {width: 0, height: 1},
    textShadowRadius: 2,
  },
})

export function ResonanceResultsScreen() {
  const navigation = useNavigation<ResonanceNavigationProp>()
  const insets = useSafeAreaInsets()
  const {width: screenWidth} = useWindowDimensions()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const containerWidth = Math.min(screenWidth - 32, 390)
  const cardWidth = (containerWidth - 12) / 2

  const handleReveal = (match: Match) => {
    navigation.navigate('HumanReveal', {
      match: {
        name: match.name,
        age: match.age,
        photoUrl: match.photoUrl,
        matchPercentage: match.matchPercentage,
      },
    })
  }

  const handleShowModal = (match: Match) => {
    setSelectedMatch(match)
  }

  const handleDismissModal = () => {
    setSelectedMatch(null)
  }

  const handleSetReminder = () => {
    Alert.alert('Reminder Set', `We'll notify you when ${selectedMatch?.name}'s profile is ready to view.`)
    setSelectedMatch(null)
  }

  const handleClose = () => {
    navigation.goBack()
  }

  const handleContinue = () => {
    navigation.navigate('Blueprint')
  }

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, {paddingTop: insets.top + 24}]}
        showsVerticalScrollIndicator={false}
      >
        {/* Close Button */}
        <Pressable style={styles.closeButton} onPress={handleClose}>
          <XIcon />
        </Pressable>

        <Animated.View entering={FadeIn.duration(400)} style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Your Daily Resonances</Text>
            <Text style={styles.subtitle}>6 of 19 strongest connections</Text>
            <Text style={styles.nextScan}>Next scan available: {formatTime(NEXT_SCAN_TIME_MS)}</Text>
          </View>

          {/* Match Grid */}
          <View style={[styles.grid, {maxWidth: containerWidth}]}>
            {MOCK_MATCHES.map(match => (
              <MatchCard
                key={match.id}
                match={match}
                onReveal={() => handleReveal(match)}
                onShowModal={() => handleShowModal(match)}
                cardWidth={cardWidth}
              />
            ))}
          </View>

          {/* Continue Link */}
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.7}>
            <Text style={styles.continueText}>Continue exploring</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Timer Gate Modal */}
      <TimerGateModal
        visible={selectedMatch !== null && selectedMatch.unlockTimeMs > 0}
        unlockTimeMs={selectedMatch?.unlockTimeMs ?? 0}
        onDismiss={handleDismissModal}
        onSetReminder={handleSetReminder}
      />
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
    paddingBottom: 80,
    paddingHorizontal: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 8,
    zIndex: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textDim,
    marginBottom: 16,
  },
  nextScan: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  continueButton: {
    marginTop: 20,
    paddingVertical: 8,
  },
  continueText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
})
