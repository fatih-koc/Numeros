import React, {useState, useEffect, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native'
import Svg, {Circle, Defs, LinearGradient, Stop} from 'react-native-svg'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

const {height: SCREEN_HEIGHT} = Dimensions.get('window')

interface TimerGateModalProps {
  visible: boolean
  unlockTimeMs: number
  onDismiss: () => void
  onSetReminder: () => void
}

function formatCountdown(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  return `${hours}h ${minutes}m`
}

function CircularProgress({timeMs, totalTimeMs}: {timeMs: number; totalTimeMs: number}) {
  const progress = 1 - timeMs / totalTimeMs
  const radius = 52 // 120px diameter - 16px stroke/2 = 52px radius
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - Math.min(Math.max(progress, 0), 1))

  return (
    <View style={circleStyles.container}>
      <Svg width={120} height={120} style={circleStyles.svg}>
        {/* Gradient definition */}
        <Defs>
          <LinearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#8B5CF6" />
            <Stop offset="100%" stopColor="#EC4899" />
          </LinearGradient>
        </Defs>
        {/* Background ring */}
        <Circle
          cx={60}
          cy={60}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={8}
          fill="none"
        />
        {/* Progress ring */}
        <Circle
          cx={60}
          cy={60}
          r={radius}
          stroke="url(#timerGradient)"
          strokeWidth={8}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation={-90}
          origin="60, 60"
        />
      </Svg>

      {/* Lock icon - using text symbol */}
      <View style={circleStyles.iconContainer}>
        <Text style={circleStyles.lockIcon}>P</Text>
      </View>
    </View>
  )
}

const circleStyles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  iconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    fontFamily: fonts.mono,
    fontSize: 32,
    color: 'rgba(255, 255, 255, 0.5)',
  },
})

export function TimerGateModal({visible, unlockTimeMs, onDismiss, onSetReminder}: TimerGateModalProps) {
  const [countdown, setCountdown] = useState(unlockTimeMs)
  const translateY = useRef(new Animated.Value(0)).current
  const scale = useRef(new Animated.Value(1)).current
  const backdropOpacity = useRef(new Animated.Value(0)).current

  const totalTimeMs = 4 * 60 * 60 * 1000 // 4 hours

  // Reset countdown when modal opens with new time
  useEffect(() => {
    if (visible) {
      setCountdown(unlockTimeMs)
      // Animate in
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Reset
      translateY.setValue(0)
      scale.setValue(0.9)
      backdropOpacity.setValue(0)
    }
  }, [visible, unlockTimeMs])

  // Update countdown every second
  useEffect(() => {
    if (!visible) return

    const interval = setInterval(() => {
      setCountdown(prev => {
        const newValue = Math.max(0, prev - 1000)
        if (newValue <= 0) {
          onDismiss()
        }
        return newValue
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [visible, onDismiss])

  // Pan responder for swipe to dismiss
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return gestureState.dy > 5
      },
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          translateY.setValue(gestureState.dy)
          scale.setValue(1 - gestureState.dy / 1000)
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // Dismiss
          Animated.parallel([
            Animated.timing(translateY, {
              toValue: SCREEN_HEIGHT,
              duration: 300,
              useNativeDriver: true,
            }),
            Animated.timing(backdropOpacity, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onDismiss()
          })
        } else {
          // Snap back
          Animated.parallel([
            Animated.spring(translateY, {
              toValue: 0,
              friction: 8,
              useNativeDriver: true,
            }),
            Animated.spring(scale, {
              toValue: 1,
              friction: 8,
              useNativeDriver: true,
            }),
          ]).start()
        }
      },
    })
  ).current

  const handleSetReminder = () => {
    onSetReminder()
    onDismiss()
  }

  if (!visible) return null

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <Animated.View style={[styles.backdrop, {opacity: backdropOpacity}]}>
        <Pressable style={styles.backdropPressable} onPress={onDismiss} />
      </Animated.View>

      <View style={styles.centeredView}>
        <Animated.View
          style={[
            styles.modalContent,
            {
              transform: [{translateY}, {scale}],
            },
          ]}
          {...panResponder.panHandlers}>
          {/* Drag Handle */}
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>

          {/* Content */}
          <View style={styles.content}>
            {/* Circle Progress */}
            <CircularProgress timeMs={countdown} totalTimeMs={totalTimeMs} />

            {/* Countdown Text */}
            <Text style={styles.countdownText}>Unlocks in {formatCountdown(countdown)}</Text>

            {/* Explanation */}
            <Text style={styles.explanation}>
              Good things take time. Your connection will be ready soon.
            </Text>

            {/* Set Reminder Button */}
            <TouchableOpacity style={styles.reminderButton} onPress={handleSetReminder} activeOpacity={0.7}>
              <Text style={styles.bellIcon}>B</Text>
              <Text style={styles.reminderText}>SET REMINDER</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  backdropPressable: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 390,
    backgroundColor: colors.bgMid,
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 32,
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  content: {
    alignItems: 'center',
  },
  countdownText: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    marginTop: 16,
    textAlign: 'center',
  },
  explanation: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 21,
  },
  reminderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  bellIcon: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textPrimary,
  },
  reminderText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
})
