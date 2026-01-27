import React from 'react'
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, Share} from 'react-native'
import {Feather} from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import {colors, energyColors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface YourDayTabProps {
  onShare?: () => void
  onUnlockPremium?: () => void
}

// Calculate universal day number from date
function calculateDayNumber(date: Date): number {
  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()

  const sum = day + month + year
  let result = sum
  while (result > 9) {
    result = String(result)
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit, 10), 0)
  }
  return result
}

// Energy data for each day number
const ENERGY_DATA: Record<number, {title: string; subtitle: string}> = {
  1: {title: 'New Beginnings', subtitle: 'A day for fresh starts and bold initiatives'},
  2: {title: 'Harmony & Balance', subtitle: 'Focus on partnerships and cooperation'},
  3: {title: 'Creative Expression', subtitle: 'Let your creativity flow freely'},
  4: {title: 'Building Foundations', subtitle: 'A day for practical work and stability'},
  5: {title: 'Dynamic Change', subtitle: 'Embrace adventure and unexpected shifts'},
  6: {title: 'Love & Nurturing', subtitle: 'Focus on family, home, and relationships'},
  7: {title: 'Introspection Peak', subtitle: 'A day for inner reflection and deep thinking'},
  8: {title: 'Abundance Flow', subtitle: 'Material success and recognition await'},
  9: {title: 'Completion & Release', subtitle: 'Let go and prepare for transformation'},
}

// Mock forecast text
const FORECAST_TEXT: Record<number, string> = {
  1: 'The 1 energy today empowers you to take initiative. Be bold in expressing your feelings. First impressions are powerful now.',
  2: 'The 2 energy today emphasizes connection and sensitivity. Listen more than you speak. Subtle gestures matter.',
  3: 'The 3 energy today sparks joy and playfulness. Flirt freely, laugh often. Creative dates will be memorable.',
  4: 'The 4 energy today calls for authenticity. Show your reliable side. Practical plans impress more than grand gestures.',
  5: 'The 5 energy today brings excitement. Be spontaneous, try something new. Adventure creates chemistry.',
  6: 'The 6 energy today deepens emotional bonds. Nurture those you care about. Home-based dates feel special.',
  7: 'The 7 energy today invites you to pause and look inward. Trust your intuition in matters of the heart. Meaningful connections happen when you share your deeper thoughts.',
  8: 'The 8 energy today attracts success. Your confidence is magnetic. Invest in quality experiences.',
  9: 'The 9 energy today inspires compassion. Give freely without expectation. Universal love flows through you.',
}

// Mock transits
const TRANSITS = [
  {
    aspect: 'Moon △ Venus',
    color: '#10B981',
    time: '3:42 PM',
    description: 'Emotional warmth flows easily. Ideal for heartfelt conversations.',
  },
  {
    aspect: 'Mars □ Pluto',
    color: '#F59E0B',
    time: '8:15 PM',
    description: 'Intense energy may trigger power struggles. Channel this into passion or physical activity.',
  },
]

// Connection tips
const CONNECTION_TIPS = [
  "Ask deeper questions today—surface-level chat won't satisfy either of you.",
  "Share something personal you've been reflecting on.",
  "Give matches space to open up; don't rush intimacy.",
]

export function YourDayTab({onShare}: YourDayTabProps) {
  const today = new Date()
  const dayNumber = calculateDayNumber(today)
  const energy = ENERGY_DATA[dayNumber] || ENERGY_DATA[7]
  const forecast = FORECAST_TEXT[dayNumber] || FORECAST_TEXT[7]
  const dayColor = energyColors[dayNumber] || energyColors[7]

  // Breathing animation for the day number
  const scale = useSharedValue(1)

  React.useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.02, {duration: 2000, easing: Easing.inOut(Easing.ease)}),
      -1,
      true
    )
  }, [])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }))

  const handleShare = async () => {
    if (onShare) {
      onShare()
      return
    }

    try {
      await Share.share({
        message: `My day number is ${dayNumber} - ${energy.title}. ${energy.subtitle}`,
      })
    } catch (error) {
      // Silently fail
    }
  }

  const formatDate = (date: Date) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${days[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}>
      {/* Date Header */}
      <View style={styles.dateHeader}>
        <Text style={styles.dateText}>Today: {formatDate(today)}</Text>
      </View>

      {/* Day Number (Hero) */}
      <View style={styles.dayNumberContainer}>
        <Animated.Text
          style={[
            styles.dayNumber,
            animatedStyle,
            {color: dayColor, textShadowColor: dayColor},
          ]}>
          {dayNumber}
        </Animated.Text>
      </View>

      {/* Energy Title */}
      <View style={styles.energySection}>
        <Text style={styles.energyTitle}>{energy.title}</Text>
        <Text style={styles.energySubtitle}>{energy.subtitle}</Text>
      </View>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShare} activeOpacity={0.7}>
        <Feather name="share-2" size={14} color="rgba(139, 92, 246, 0.8)" />
        <Text style={styles.shareButtonText}>Share Your Day</Text>
      </TouchableOpacity>

      {/* Numerology Forecast Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionDot} />
          <Text style={styles.sectionTitle}>Numerology Forecast</Text>
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.forecastCard}>
          <Text style={styles.forecastText}>{forecast}</Text>
        </View>
      </View>

      {/* Transits Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="sun" size={12} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.sectionTitle}>Today's Transits</Text>
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.transitsContainer}>
          {TRANSITS.map((transit, index) => (
            <View key={index} style={styles.transitCard}>
              <View style={styles.transitHeader}>
                <Text style={styles.transitAspect}>
                  {transit.aspect.split(' ')[0]}{' '}
                  <Text style={{color: transit.color}}>{transit.aspect.split(' ')[1]}</Text>{' '}
                  {transit.aspect.split(' ')[2]}
                </Text>
                <Text style={styles.transitTime}>Peak: {transit.time}</Text>
              </View>
              <Text style={styles.transitDescription}>{transit.description}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Connection Tips Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Feather name="heart" size={12} color="rgba(255, 255, 255, 0.5)" />
          <Text style={styles.sectionTitle}>Connection Tips</Text>
          <View style={styles.sectionLine} />
        </View>
        <View style={styles.tipsContainer}>
          {CONNECTION_TIPS.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <LinearGradient
                colors={['rgba(139, 92, 246, 0.05)', 'transparent']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={StyleSheet.absoluteFill}
              />
              <Text style={styles.tipNumber}>{index + 1}</Text>
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  dateHeader: {
    paddingTop: 60,
    alignItems: 'center',
  },
  dateText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  dayNumberContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  dayNumber: {
    fontFamily: fonts.serif,
    fontSize: 96,
    fontWeight: '600',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 40,
  },
  energySection: {
    marginTop: 8,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  energyTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  energySubtitle: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 300,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'center',
    marginTop: 16,
    borderRadius: 20,
  },
  shareButtonText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(139, 92, 246, 0.8)',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  forecastCard: {
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 20,
  },
  forecastText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 22,
  },
  transitsContainer: {
    gap: 8,
  },
  transitCard: {
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 16,
  },
  transitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  transitAspect: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  transitTime: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  transitDescription: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 19,
  },
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    gap: 12,
    borderLeftWidth: 3,
    borderLeftColor: colors.accentViolet,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    padding: 16,
    overflow: 'hidden',
  },
  tipNumber: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '600',
    color: colors.accentViolet,
  },
  tipText: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    lineHeight: 20,
  },
})
