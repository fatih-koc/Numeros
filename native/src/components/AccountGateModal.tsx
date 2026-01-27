import React from 'react'
import {StyleSheet, View, Text, TouchableOpacity, Modal, Pressable} from 'react-native'
import {Feather} from '@expo/vector-icons'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated'
import {LinearGradient} from 'expo-linear-gradient'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface ProfileStatus {
  hasPhoto: boolean
  hasBio: boolean
  isVerified: boolean
}

interface AccountGateModalProps {
  isOpen: boolean
  onClose: () => void
  onCompleteProfile: () => void
  profileStatus?: ProfileStatus
}

export function AccountGateModal({
  isOpen,
  onClose,
  onCompleteProfile,
  profileStatus = {hasPhoto: true, hasBio: false, isVerified: false},
}: AccountGateModalProps) {
  const pulseScale = useSharedValue(1)

  React.useEffect(() => {
    if (isOpen) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.05, {duration: 1000}),
          withTiming(1, {duration: 1000})
        ),
        -1,
        true
      )
    }
  }, [isOpen])

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{scale: pulseScale.value}],
  }))

  if (!isOpen) return null

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
          <Pressable style={styles.modalContainer} onPress={e => e.stopPropagation()}>
            {/* Close Button */}
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={28} color="rgba(255, 255, 255, 0.4)" />
            </TouchableOpacity>

            {/* Lock Icon with Glow */}
            <Animated.View style={[styles.iconContainer, iconStyle]}>
              <View style={styles.iconGlow} />
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.iconBackground}>
                <Feather name="lock" size={32} color="white" />
              </LinearGradient>
            </Animated.View>

            {/* Headings */}
            <Text style={styles.title}>Complete your profile to resonate</Text>
            <Text style={styles.subtitle}>Show them who you are before connecting</Text>

            {/* Checklist */}
            <View style={styles.checklist}>
              <ChecklistItem
                label="Add a photo"
                icon="camera"
                isComplete={profileStatus.hasPhoto}
              />
              <ChecklistItem
                label="Write your bio"
                icon="edit-2"
                isComplete={profileStatus.hasBio}
              />
              <ChecklistItem
                label="Verify your identity"
                icon="shield"
                isComplete={profileStatus.isVerified}
              />
            </View>

            {/* Action Buttons */}
            <TouchableOpacity style={styles.primaryButton} onPress={onCompleteProfile}>
              <LinearGradient
                colors={['#8B5CF6', '#EC4899']}
                start={{x: 0, y: 0}}
                end={{x: 1, y: 1}}
                style={styles.primaryButtonGradient}>
                <Text style={styles.primaryButtonText}>COMPLETE PROFILE</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={onClose}>
              <Text style={styles.secondaryButtonText}>Maybe later</Text>
            </TouchableOpacity>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}

function ChecklistItem({
  label,
  icon,
  isComplete,
}: {
  label: string
  icon: string
  isComplete: boolean
}) {
  return (
    <View style={styles.checklistItem}>
      <View style={styles.checklistLeft}>
        <View style={[styles.checklistIcon, isComplete && styles.checklistIconComplete]}>
          <Feather
            name={icon as any}
            size={16}
            color={isComplete ? 'white' : 'rgba(255, 255, 255, 0.4)'}
          />
        </View>
        <Text style={[styles.checklistLabel, isComplete && styles.checklistLabelComplete]}>
          {label}
        </Text>
      </View>
      <View>
        {isComplete ? (
          <Feather name="check" size={18} color="#10B981" />
        ) : (
          <Feather name="circle" size={18} color="rgba(255, 255, 255, 0.2)" />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    padding: 4,
  },
  iconContainer: {
    marginTop: 8,
    marginBottom: 20,
    position: 'relative',
  },
  iconGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    backgroundColor: colors.accentViolet,
    borderRadius: 50,
    opacity: 0.3,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 22,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    maxWidth: 280,
    lineHeight: 28,
  },
  subtitle: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    marginBottom: 24,
  },
  checklist: {
    width: 260,
    gap: 12,
    marginBottom: 32,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checklistLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checklistIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checklistIconComplete: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  checklistLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  checklistLabelComplete: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  primaryButton: {
    width: 280,
    height: 48,
    borderRadius: 24,
    overflow: 'hidden',
  },
  primaryButtonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
