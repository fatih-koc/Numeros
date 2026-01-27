import React, {useState} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Image, useWindowDimensions, Alert} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../navigation/types'
import Animated, {FadeIn} from 'react-native-reanimated'
import Svg, {Circle} from 'react-native-svg'
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

const MOCK_MATCHES: Match[] = [
  {
    id: 1,
    name: 'Sarah',
    age: 28,
    matchPercentage: 92,
    reason1: 'Life Path 5 x 3',
    reason2: 'Venus \u25B3 Moon',
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    unlockTimeMs: 0,
  },
  {
    id: 2,
    name: 'Emma',
    age: 26,
    matchPercentage: 89,
    reason1: 'Soul Urge 7 x 9',
    reason2: 'Mars \u25B3 Mars',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    unlockTimeMs: 3 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
  {
    id: 3,
    name: 'Olivia',
    age: 29,
    matchPercentage: 87,
    reason1: 'Expression 1 x 5',
    reason2: 'Sun \u25B3 Moon',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
    unlockTimeMs: 7 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
  {
    id: 4,
    name: 'Ava',
    age: 27,
    matchPercentage: 85,
    reason1: 'Life Path 2 x 6',
    reason2: 'Mercury \u25B3 Venus',
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400',
    unlockTimeMs: 11 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
  {
    id: 5,
    name: 'Mia',
    age: 25,
    matchPercentage: 84,
    reason1: 'Soul Urge 2 x 4',
    reason2: 'Jupiter \u25B3 Sun',
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
    unlockTimeMs: 15 * 60 * 60 * 1000 + 59 * 60 * 1000,
  },
  {
    id: 6,
    name: 'Sophia',
    age: 30,
    matchPercentage: 82,
    reason1: 'Life Path 3 x 5',
    reason2: 'Venus \u25B3 Moon',
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

function TimerCircle({timeMs}: {timeMs: number}) {
  const totalTime = 4 * 60 * 60 * 1000
  const progress = 1 - timeMs / totalTime
  const circumference = 2 * Math.PI * 10
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1))

  return (
    <View style={timerStyles.container}>
      <Svg width={24} height={24} style={timerStyles.svg}>
        <Circle cx={12} cy={12} r={10} stroke="rgba(255, 255, 255, 0.15)" strokeWidth={2} fill="none" />
        <Circle
          cx={12}
          cy={12}
          r={10}
          stroke="rgba(139, 92, 246, 0.6)"
          strokeWidth={2}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin="12, 12"
        />
      </Svg>
      <Text style={timerStyles.icon}>C</Text>
    </View>
  )
}

const timerStyles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  svg: {
    transform: [{rotate: '-90deg'}],
  },
  icon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: fonts.mono,
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.4)',
  },
})

interface MatchCardProps {
  match: Match
  onReveal: () => void
  onShowModal: () => void
  cardWidth: number
}

function MatchCard({match, onReveal, onShowModal, cardWidth}: MatchCardProps) {
  const isReady = match.unlockTimeMs === 0

  return (
    <View style={[cardStyles.container, {width: cardWidth}]}>
      {/* Photo Area - Blurred */}
      <View style={cardStyles.photoContainer}>
        <Image source={{uri: match.photoUrl}} style={cardStyles.photo} blurRadius={20} />
      </View>

      {/* Info Section */}
      <View style={cardStyles.infoContainer}>
        <Text style={cardStyles.nameAge}>
          {match.name}, {match.age}
        </Text>
        <Text style={cardStyles.matchPercent}>{match.matchPercentage}% Match</Text>

        <View style={cardStyles.reasons}>
          <Text style={cardStyles.reasonText}>{match.reason1}</Text>
          <Text style={cardStyles.reasonText}>{match.reason2}</Text>
        </View>

        <View style={cardStyles.spacer} />

        {/* Timer/Button Area */}
        <View style={cardStyles.actionArea}>
          {isReady ? (
            <TouchableOpacity style={cardStyles.revealButton} onPress={onReveal} activeOpacity={0.7}>
              <Text style={cardStyles.revealButtonText}>REVEAL</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={cardStyles.timerContainer} onPress={onShowModal} activeOpacity={0.7}>
              <TimerCircle timeMs={match.unlockTimeMs} />
              <Text style={cardStyles.timerText}>{formatTime(match.unlockTimeMs)}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  )
}

const cardStyles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  photoContainer: {
    height: 80,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
    transform: [{scale: 1.1}],
  },
  infoContainer: {
    flex: 1,
    padding: 12,
  },
  nameAge: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
  matchPercent: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.accentViolet,
    marginTop: 4,
  },
  reasons: {
    marginTop: 8,
    gap: 2,
  },
  reasonText: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textDim,
    lineHeight: 14,
  },
  spacer: {
    flex: 1,
  },
  actionArea: {
    height: 36,
    marginTop: 8,
  },
  revealButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  revealButtonText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textPrimary,
  },
  timerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  timerText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
})

export function ResonanceResultsScreen() {
  const navigation = useNavigation<ResonanceNavigationProp>()
  const {width: screenWidth} = useWindowDimensions()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)

  const containerWidth = Math.min(screenWidth - 32, 390)
  const cardWidth = (containerWidth - 12) / 2

  const handleReveal = (match: Match) => {
    // Navigate to HumanReveal with match data
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
  }

  const handleContinue = () => {
    navigation.navigate('Blueprint')
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 16,
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
    marginTop: 40,
    paddingVertical: 8,
  },
  continueText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
})
