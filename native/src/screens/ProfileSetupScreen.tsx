import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../navigation/types'
import Animated, {FadeIn} from 'react-native-reanimated'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

const BIO_MAX_LENGTH = 500

type ProfileSetupNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileSetup'>

export function ProfileSetupScreen() {
  const navigation = useNavigation<ProfileSetupNavigationProp>()
  const {width: screenWidth} = useWindowDimensions()
  const [bio, setBio] = useState('')
  const [location, setLocation] = useState('')

  // Calculate photo cell size: 3 columns with gaps
  const containerWidth = Math.min(screenWidth - 48, 400) - 48
  const cellWidth = (containerWidth - 16) / 3 // 3 columns with 8px gaps
  const cellHeight = cellWidth * 1.33 // 4:3 aspect ratio

  const handleContinue = () => {
    navigation.navigate('Verification')
  }

  const handlePhotoPress = (index: number) => {
    Alert.alert(
      index === 0 ? 'Add Required Photo' : 'Add Photo',
      'This would open the camera or photo library.',
      [{text: 'OK'}],
    )
  }

  const handlePromptPress = () => {
    Alert.alert('Add Prompt', 'This would open a prompt selector.', [{text: 'OK'}])
  }

  return (
    <ScreenWrapper>
      <View style={styles.wrapper}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Complete Your Profile</Text>
              <Text style={styles.headerSubtitle}>Let others see who you are</Text>
            </View>

            {/* Photo Grid */}
            <View style={styles.photoSection}>
              <View style={[styles.photoGrid, {width: containerWidth}]}>
                {/* First Cell - Required */}
                <TouchableOpacity
                  style={[
                    styles.photoCell,
                    styles.photoCellRequired,
                    {width: cellWidth, height: cellHeight},
                  ]}
                  onPress={() => handlePhotoPress(0)}
                  activeOpacity={0.7}>
                  <Text style={styles.cameraIcon}>+</Text>
                  <Text style={styles.requiredLabel}>Required</Text>
                </TouchableOpacity>

                {/* Other Cells - Optional */}
                {[1, 2, 3, 4, 5].map(index => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.photoCell, styles.photoCellOptional, {width: cellWidth, height: cellHeight}]}
                    onPress={() => handlePhotoPress(index)}
                    activeOpacity={0.7}>
                    <Text style={styles.plusIcon}>+</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={styles.photoHint}>Drag to reorder</Text>
            </View>

            {/* Bio Section */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Bio</Text>
              <View style={styles.textareaContainer}>
                <TextInput
                  style={styles.textarea}
                  value={bio}
                  onChangeText={text => {
                    if (text.length <= BIO_MAX_LENGTH) {
                      setBio(text)
                    }
                  }}
                  placeholder="Let your numbers do the talking, or add your voice..."
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  multiline
                  textAlignVertical="top"
                />
                <Text style={styles.charCount}>
                  {bio.length} / {BIO_MAX_LENGTH}
                </Text>
              </View>
            </View>

            {/* Location Field */}
            <View style={styles.inputSection}>
              <View style={styles.labelContainer}>
                <Text style={styles.inputLabel}>Display Location</Text>
                <Text style={styles.inputHint}>(shown on profile, not for matching)</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={location}
                onChangeText={setLocation}
                placeholder="City, Country"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
              />
            </View>

            {/* Prompts Section */}
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Answer 3 Prompts</Text>
              <View style={styles.promptsContainer}>
                {[1, 2, 3].map(index => (
                  <TouchableOpacity
                    key={index}
                    style={styles.promptCard}
                    onPress={handlePromptPress}
                    activeOpacity={0.7}>
                    <Text style={styles.promptPlus}>+</Text>
                    <Text style={styles.promptText}>Add a prompt</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Continue Button - Fixed at bottom */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.continueButton} onPress={handleContinue} activeOpacity={0.8}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 100,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(26, 21, 51, 0.6)',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.25)',
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 20},
    shadowOpacity: 0.5,
    shadowRadius: 60,
    elevation: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  photoSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  photoCell: {
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoCellRequired: {
    backgroundColor: '#1a1533',
    borderWidth: 2,
    borderColor: '#8B5CF6',
  },
  photoCellOptional: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  requiredLabel: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  plusIcon: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  photoHint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
    marginTop: 12,
  },
  inputSection: {
    width: '100%',
    marginBottom: 20,
  },
  labelContainer: {
    marginBottom: 8,
  },
  inputLabel: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  inputHint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
    marginTop: -4,
  },
  textareaContainer: {
    position: 'relative',
  },
  textarea: {
    height: 100,
    backgroundColor: '#1a1533',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 21,
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 16,
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.textDim,
  },
  textInput: {
    height: 48,
    backgroundColor: '#1a1533',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
  promptsContainer: {
    gap: 12,
  },
  promptCard: {
    width: '100%',
    height: 80,
    backgroundColor: '#1a1533',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  promptPlus: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  promptText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textDim,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  continueButton: {
    width: '100%',
    maxWidth: 342,
    height: 52,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  continueButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 3,
    color: colors.textPrimary,
    textTransform: 'uppercase',
  },
})
