import React, {useState, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Share,
  Alert,
  PanResponder,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {useNumerology} from '../contexts'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

const CARD_STYLES = ['numbers', 'stars', 'combined'] as const
type CardStyle = (typeof CARD_STYLES)[number]

interface DayEnergyData {
  title: string
  description: string
  color: string
  glow: string
}

const DAY_ENERGY_DATA: Record<number, DayEnergyData> = {
  1: {
    title: 'New Beginnings',
    description:
      "Today marks a powerful start. Your energy radiates independence and initiative. Trust your instincts and take that first step toward what you've been contemplating.",
    color: '#EF4444',
    glow: 'rgba(239, 68, 68, 0.5)',
  },
  2: {
    title: 'Partnership Flow',
    description:
      'Harmony and cooperation define your day. Your sensitivity to others is heightened, making this ideal for collaboration and deepening connections.',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.5)',
  },
  3: {
    title: 'Creative Expression',
    description:
      'Your creative channels are wide open today. Express yourself through any medium that calls to you. Communication flows effortlessly.',
    color: '#10B981',
    glow: 'rgba(16, 185, 129, 0.5)',
  },
  4: {
    title: 'Foundation Building',
    description:
      'Stability and structure are your allies today. Focus on practical matters and long-term planning. Build something that will last.',
    color: '#3B82F6',
    glow: 'rgba(59, 130, 246, 0.5)',
  },
  5: {
    title: 'Adventure Calls',
    description:
      'Change and freedom energize your day. Embrace the unexpected and welcome new experiences. Break from routine and explore.',
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.5)',
  },
  6: {
    title: 'Nurturing Energy',
    description:
      'Love and responsibility harmonize today. Your capacity to care for others and create beauty is amplified. Give from the heart.',
    color: '#EC4899',
    glow: 'rgba(236, 72, 153, 0.5)',
  },
  7: {
    title: 'Introspection Peak',
    description:
      'Deep wisdom flows through solitude today. Your intuition speaks loudly when you create quiet space to listen. Trust the inner knowing.',
    color: '#F59E0B',
    glow: 'rgba(245, 158, 11, 0.5)',
  },
  8: {
    title: 'Power & Abundance',
    description:
      'Material success and personal power align today. Your ability to manifest and achieve is extraordinary. Focus on your goals.',
    color: '#059669',
    glow: 'rgba(5, 150, 105, 0.5)',
  },
  9: {
    title: 'Completion Cycle',
    description:
      'Universal love and wisdom guide you today. Release what no longer serves, make space for new chapters. Endings become beginnings.',
    color: '#8B5CF6',
    glow: 'rgba(139, 92, 246, 0.5)',
  },
}

// Reduce number to single digit (1-9) or master number (11, 22, 33)
function reduceToSingleDigit(num: number): number {
  while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
    num = num
      .toString()
      .split('')
      .reduce((sum, digit) => sum + parseInt(digit, 10), 0)
  }
  return num
}

export function YourDayPreviewScreen() {
  const navigation = useNavigation()
  const {scanOutput} = useNumerology()
  const [activeStyle, setActiveStyle] = useState<CardStyle>('numbers')

  // Drag animation
  const translateX = useSharedValue(0)
  const dragStartX = useRef(0)

  // Get today's date info
  const today = new Date()
  const dayName = today.toLocaleDateString('en-US', {weekday: 'long'})
  const monthName = today.toLocaleDateString('en-US', {month: 'short'})
  const dayOfMonth = today.getDate()

  // Calculate universal day number
  const year = today.getFullYear()
  const month = today.getMonth() + 1
  const day = today.getDate()

  const universalDayNumber = reduceToSingleDigit(
    reduceToSingleDigit(day) +
      reduceToSingleDigit(month) +
      reduceToSingleDigit(year),
  )

  const energyData = DAY_ENERGY_DATA[universalDayNumber] || DAY_ENERGY_DATA[7]

  // Get sun sign from scan data
  const sunSign = scanOutput?.astrology?.planets?.sun?.sign || 'Aries'

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 10,
      onPanResponderGrant: () => {
        dragStartX.current = translateX.value
      },
      onPanResponderMove: (_, gestureState) => {
        translateX.value = dragStartX.current + gestureState.dx
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = 50
        const currentIndex = CARD_STYLES.indexOf(activeStyle)

        if (gestureState.dx < -threshold && currentIndex < CARD_STYLES.length - 1) {
          setActiveStyle(CARD_STYLES[currentIndex + 1])
        } else if (gestureState.dx > threshold && currentIndex > 0) {
          setActiveStyle(CARD_STYLES[currentIndex - 1])
        }

        translateX.value = withSpring(0, {damping: 20, stiffness: 200})
      },
    }),
  ).current

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }))

  const handleClose = () => {
    navigation.goBack()
  }

  const handleSave = () => {
    Alert.alert(
      'Card Saved!',
      'In the full app, this would download the card as an image to your device.',
    )
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Today is a ${energyData.title} day. ${energyData.description}\n\n- Numeros`,
      })
    } catch {
      Alert.alert('Share', 'Unable to share at this time.')
    }
  }

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.7}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        {/* Main Content */}
        <View style={styles.content}>
          {/* Card Container - fills available space */}
          <View style={styles.cardContainer}>
            {/* Shareable Card */}
            <Animated.View
              entering={FadeIn.duration(500)}
              style={[styles.card, cardAnimatedStyle]}
              {...panResponder.panHandlers}>
              {/* Date Header */}
              <Text style={styles.dateHeader}>
                Today: {dayName}, {monthName} {dayOfMonth}
              </Text>

              {/* Numbers Card Style */}
              {activeStyle === 'numbers' && (
                <View style={styles.cardContent}>
                  <Text
                    style={[
                      styles.dayNumber,
                      {
                        color: energyData.color,
                        textShadowColor: energyData.glow,
                        textShadowOffset: {width: 0, height: 0},
                        textShadowRadius: 30,
                      },
                    ]}>
                    {universalDayNumber}
                  </Text>
                  <Text style={styles.energyTitle}>{energyData.title}</Text>
                  <Text style={styles.description}>{energyData.description}</Text>
                </View>
              )}

              {/* Stars Card Style */}
              {activeStyle === 'stars' && (
                <View style={styles.cardContent}>
                  <Text style={styles.sunSymbol}>☉</Text>
                  <Text style={styles.sunSign}>{sunSign} Sun</Text>
                  <Text style={styles.energyTitle}>{energyData.title}</Text>
                  <Text style={styles.description}>
                    The cosmos aligns with your {sunSign} nature today.{' '}
                    {energyData.description.split('.')[0]}. Trust the celestial
                    currents.
                  </Text>
                </View>
              )}

              {/* Combined Card Style */}
              {activeStyle === 'combined' && (
                <View style={styles.cardContent}>
                  <View style={styles.combinedRow}>
                    <Text
                      style={[
                        styles.combinedNumber,
                        {
                          color: energyData.color,
                          textShadowColor: energyData.glow,
                          textShadowOffset: {width: 0, height: 0},
                          textShadowRadius: 30,
                        },
                      ]}>
                      {universalDayNumber}
                    </Text>
                    <Text style={styles.combinedSymbol}>☉</Text>
                  </View>
                  <Text style={styles.combinedTitle}>
                    {energyData.title} · {sunSign} Sun
                  </Text>
                  <View style={styles.divider} />
                  <Text style={styles.combinedDescription}>
                    Your numerological {universalDayNumber} energy harmonizes with
                    your {sunSign} essence today. {energyData.description.slice(0, 120)}
                    ...
                  </Text>
                  <Text style={styles.combinedLabel}>Numerology × Astrology</Text>
                </View>
              )}

              {/* Watermark */}
              <Text style={styles.watermark}>numeros</Text>
            </Animated.View>
          </View>

          {/* Bottom Section - dots and buttons */}
          <View style={styles.bottomSection}>
            {/* Card Style Dots */}
            <View style={styles.dots}>
              {CARD_STYLES.map((style, index) => (
                <TouchableOpacity
                  key={style}
                  onPress={() => setActiveStyle(CARD_STYLES[index])}
                  style={[
                    styles.dot,
                    activeStyle === style && styles.dotActive,
                  ]}
                />
              ))}
            </View>

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSave}
                activeOpacity={0.7}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.shareButton}
                onPress={handleShare}
                activeOpacity={0.8}>
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const {width} = Dimensions.get('window')
const CARD_WIDTH = Math.min(width - 48, 300)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 24,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: CARD_WIDTH,
    flex: 1,
    maxHeight: 540,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    backgroundColor: colors.bgMid,
    alignItems: 'center',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 10,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 24,
    gap: 20,
  },
  dateHeader: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 24,
    textAlign: 'center',
  },
  cardContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  dayNumber: {
    fontFamily: fonts.serif,
    fontSize: 72,
    fontWeight: '600',
    lineHeight: 80,
  },
  energyTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: 16,
  },
  sunSymbol: {
    fontFamily: fonts.serif,
    fontSize: 48,
    fontWeight: '600',
    color: '#F59E0B',
    textShadowColor: 'rgba(245, 158, 11, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 30,
  },
  sunSign: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 8,
    textAlign: 'center',
  },
  combinedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  combinedNumber: {
    fontFamily: fonts.serif,
    fontSize: 56,
    fontWeight: '600',
    lineHeight: 64,
  },
  combinedSymbol: {
    fontFamily: fonts.serif,
    fontSize: 32,
    fontWeight: '600',
    color: '#F59E0B',
    textShadowColor: 'rgba(245, 158, 11, 0.5)',
    textShadowOffset: {width: 0, height: 0},
    textShadowRadius: 20,
  },
  combinedTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 12,
    textAlign: 'center',
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
    marginTop: 16,
  },
  combinedDescription: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  combinedLabel: {
    fontFamily: fonts.mono,
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.textDim,
    marginTop: 16,
    textAlign: 'center',
  },
  watermark: {
    fontFamily: fonts.serif,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.2)',
    position: 'absolute',
    bottom: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  dotActive: {
    backgroundColor: colors.accentViolet,
  },
  actions: {
    flexDirection: 'row',
    gap: 16,
  },
  saveButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  saveButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 3,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
  },
  shareButton: {
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  shareButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 3,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
})
