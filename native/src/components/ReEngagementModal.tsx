import React, {useEffect} from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Modal, Pressable, Image} from 'react-native'
import {Feather} from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface ReEngagementModalProps {
  isOpen: boolean
  onClose: () => void
  onViewMatches: () => void
}

const MATCH_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
]

export function ReEngagementModal({isOpen, onClose, onViewMatches}: ReEngagementModalProps) {
  const star1Scale = useSharedValue(1)
  const star1Opacity = useSharedValue(0.8)
  const star2Scale = useSharedValue(1)
  const star2Opacity = useSharedValue(0.8)
  const threadScale = useSharedValue(0)

  useEffect(() => {
    if (isOpen) {
      // Thread animation
      threadScale.value = withDelay(300, withTiming(1, {duration: 1000}))

      // Star 1 pulse
      star1Scale.value = withRepeat(
        withSequence(withTiming(1.2, {duration: 1000}), withTiming(1, {duration: 1000})),
        -1,
        true
      )
      star1Opacity.value = withRepeat(
        withSequence(withTiming(1, {duration: 1000}), withTiming(0.8, {duration: 1000})),
        -1,
        true
      )

      // Star 2 pulse (delayed)
      star2Scale.value = withDelay(
        1000,
        withRepeat(
          withSequence(withTiming(1.2, {duration: 1000}), withTiming(1, {duration: 1000})),
          -1,
          true
        )
      )
      star2Opacity.value = withDelay(
        1000,
        withRepeat(
          withSequence(withTiming(1, {duration: 1000}), withTiming(0.8, {duration: 1000})),
          -1,
          true
        )
      )
    }
  }, [isOpen])

  const star1Style = useAnimatedStyle(() => ({
    transform: [{scale: star1Scale.value}],
    opacity: star1Opacity.value,
  }))

  const star2Style = useAnimatedStyle(() => ({
    transform: [{scale: star2Scale.value}],
    opacity: star2Opacity.value,
  }))

  const threadStyle = useAnimatedStyle(() => ({
    transform: [{scaleX: threadScale.value}],
  }))

  if (!isOpen) return null

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
          <Pressable style={styles.modalContainer} onPress={e => e.stopPropagation()}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={20} color="rgba(255, 255, 255, 0.4)" />
            </TouchableOpacity>

            {/* Constellation Visual */}
            <View style={styles.constellationContainer}>
              {/* Thread */}
              <Animated.View style={[styles.thread, threadStyle]}>
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}
                  style={StyleSheet.absoluteFill}
                />
              </Animated.View>

              {/* Star 1 (Left) */}
              <Animated.View style={[styles.star, styles.star1, star1Style]} />

              {/* Star 2 (Right) */}
              <Animated.View style={[styles.star, styles.star2, star2Style]} />

              {/* Ambient Glow */}
              <View style={styles.ambientGlow} />
            </View>

            {/* Heading */}
            <Text style={styles.title}>Your matches are waiting</Text>

            {/* Subheading */}
            <Text style={styles.subtitle}>Don't let the stars drift apart</Text>

            {/* Waiting Matches Preview */}
            <View style={styles.matchesPreview}>
              <View style={styles.matchPhotos}>
                {MATCH_PHOTOS.map((url, index) => (
                  <View
                    key={index}
                    style={[
                      styles.matchPhotoContainer,
                      {zIndex: 30 - index, marginLeft: index > 0 ? -16 : 0},
                    ]}>
                    <Image source={{uri: url}} style={styles.matchPhoto} />
                  </View>
                ))}
                <View style={styles.matchBadge}>
                  <Text style={styles.matchBadgeText}>+2</Text>
                </View>
              </View>

              <View style={styles.resonanceInfo}>
                <Feather name="star" size={12} color={colors.accentViolet} />
                <Text style={styles.resonanceText}>3 mutual resonances</Text>
              </View>
            </View>

            {/* Primary CTA */}
            <TouchableOpacity style={styles.primaryButton} onPress={onViewMatches}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                style={styles.primaryButtonGradient}>
                <Text style={styles.primaryButtonText}>VIEW MATCHES</Text>
                <Feather name="chevron-right" size={16} color="rgba(255, 255, 255, 0.8)" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary Link */}
            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Remind me later</Text>
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    height: 480,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 24,
    paddingTop: 32,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.2,
    shadowRadius: 50,
    elevation: 20,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  constellationContainer: {
    width: 120,
    height: 80,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  thread: {
    position: 'absolute',
    width: 80,
    height: 1,
    borderRadius: 0.5,
    overflow: 'hidden',
  },
  star: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: 'white',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  star1: {
    left: 12,
    width: 16,
    height: 16,
  },
  star2: {
    right: 12,
    width: 12,
    height: 12,
  },
  ambientGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: colors.accentViolet,
    opacity: 0.1,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 24,
  },
  matchesPreview: {
    alignItems: 'center',
    marginBottom: 32,
  },
  matchPhotos: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
  },
  matchPhotoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: colors.bgMid,
    overflow: 'hidden',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  matchPhoto: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  matchBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -16,
    zIndex: 40,
  },
  matchBadgeText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: 'white',
  },
  resonanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  resonanceText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  primaryButton: {
    width: 280,
    height: 52,
    borderRadius: 26,
    overflow: 'hidden',
    shadowColor: colors.accentViolet,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  primaryButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '500',
    color: 'white',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    marginTop: 16,
    padding: 8,
  },
  secondaryButtonText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.4)',
  },
})
