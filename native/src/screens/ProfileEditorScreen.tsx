import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
  Pressable,
  Switch,
  Alert,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Feather} from '@expo/vector-icons'
import Animated, {FadeIn, SlideInDown, SlideOutDown} from 'react-native-reanimated'
import type {RootStackParamList} from '../navigation/types'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface Photo {
  id: string
  url: string
}

interface Prompt {
  id: string
  question: string
  answer: string
}

const INITIAL_PHOTOS: Photo[] = [
  {id: 'p1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400'},
  {id: 'p2', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'},
  {id: 'p3', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'},
  {id: 'p4', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200'},
]

const INITIAL_PROMPTS: Prompt[] = [
  {
    id: 'pr1',
    question: 'My ideal first date...',
    answer: 'Stargazing at a planetarium, followed by late night jazz and deep conversation about the universe.',
  },
  {
    id: 'pr2',
    question: 'I geek out on...',
    answer: 'Ancient history, especially Sumerian civilization and sacred geometry.',
  },
]

const AVAILABLE_PROMPTS = [
  'My ideal first date...',
  "I'm looking for...",
  'A fact about me that surprises people...',
  'My love language is...',
  'I geek out on...',
  'The way to my heart is...',
  'My simple pleasures...',
  "I'm convinced that...",
  'My zombie apocalypse plan...',
  'A non-negotiable...',
]

type ProfileEditorNavigationProp = NativeStackNavigationProp<RootStackParamList>

export function ProfileEditorScreen() {
  const navigation = useNavigation<ProfileEditorNavigationProp>()
  const insets = useSafeAreaInsets()

  const [photos, setPhotos] = useState<Photo[]>(INITIAL_PHOTOS)
  const [bio, setBio] = useState(
    "Exploring the cosmos one coffee at a time. Looking for someone who can match my energy and isn't afraid of deep conversations."
  )
  const [prompts, setPrompts] = useState<Prompt[]>(INITIAL_PROMPTS)
  const [location, setLocation] = useState('Kadikoy, Istanbul')
  const [toggles, setToggles] = useState({
    showAge: true,
    showDistance: true,
    showInDiscover: true,
  })
  const [showPromptSelector, setShowPromptSelector] = useState(false)
  const isVerified = true

  const handleBack = () => {
    navigation.goBack()
  }

  const handleSave = () => {
    Alert.alert('Profile Saved', 'Your changes have been saved.')
    navigation.goBack()
  }

  const handlePreview = () => {
    // Navigate to preview
  }

  const handleDeletePhoto = (id: string) => {
    if (photos.length <= 1) {
      Alert.alert('Cannot Remove', 'You must have at least one photo.')
      return
    }
    setPhotos(photos.filter(p => p.id !== id))
  }

  const handleAddPhoto = () => {
    if (photos.length >= 6) return
    const newId = `p${Date.now()}`
    const newPhoto = {
      id: newId,
      url: `https://source.unsplash.com/random/200x200?portrait&sig=${newId}`,
    }
    setPhotos([...photos, newPhoto])
  }

  const handleDeletePrompt = (id: string) => {
    setPrompts(prompts.filter(p => p.id !== id))
  }

  const handleSelectPrompt = (question: string) => {
    const newPrompt = {id: `pr${Date.now()}`, question, answer: ''}
    setPrompts([...prompts, newPrompt])
    setShowPromptSelector(false)
  }

  const handlePromptChange = (id: string, text: string) => {
    setPrompts(prompts.map(p => (p.id === id ? {...p, answer: text} : p)))
  }

  const handleToggle = (key: keyof typeof toggles) => {
    setToggles({...toggles, [key]: !toggles[key]})
  }

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton} onPress={handleBack}>
          <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.6)" />
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Profile</Text>

        <TouchableOpacity style={styles.headerButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}>
        {/* Photos Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PHOTOS</Text>
            <Text style={styles.sectionHint}>Drag to reorder • First is main</Text>
          </View>

          <View style={styles.photoGrid}>
            {Array.from({length: 6}).map((_, i) => {
              const photo = photos[i]
              const isMain = i === 0

              if (photo) {
                return (
                  <View
                    key={photo.id}
                    style={[styles.photoSlot, isMain && styles.photoSlotMain]}>
                    <Image source={{uri: photo.url}} style={styles.photoImage} />
                    <TouchableOpacity
                      style={styles.photoDelete}
                      onPress={() => handleDeletePhoto(photo.id)}>
                      <Feather name="x" size={12} color="white" />
                    </TouchableOpacity>
                    {isMain && (
                      <View style={styles.mainBadge}>
                        <Text style={styles.mainBadgeText}>MAIN</Text>
                      </View>
                    )}
                  </View>
                )
              } else if (i === photos.length) {
                return (
                  <TouchableOpacity
                    key="add"
                    style={[styles.photoSlot, styles.photoSlotEmpty]}
                    onPress={handleAddPhoto}>
                    <Feather name="plus" size={24} color="rgba(255, 255, 255, 0.3)" />
                  </TouchableOpacity>
                )
              } else if (i > photos.length) {
                return <View key={`empty-${i}`} style={[styles.photoSlot, styles.photoSlotPlaceholder]} />
              }
              return null
            })}
          </View>
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>BIO</Text>
          <View style={styles.bioContainer}>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell matches about yourself..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              style={styles.bioInput}
              multiline
              maxLength={500}
            />
            <Text style={[styles.charCount, bio.length > 450 && styles.charCountWarning]}>
              {bio.length} / 500
            </Text>
          </View>
        </View>

        {/* Prompts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROMPTS</Text>
          </View>
          <Text style={styles.promptSubtext}>Answer 3 prompts to help start conversations</Text>

          <View style={styles.promptsList}>
            {prompts.map(prompt => (
              <View key={prompt.id} style={styles.promptCard}>
                <View style={styles.promptHeader}>
                  <Text style={styles.promptQuestion}>{prompt.question}</Text>
                  <TouchableOpacity onPress={() => handleDeletePrompt(prompt.id)}>
                    <Feather name="trash-2" size={16} color="rgba(255, 255, 255, 0.4)" />
                  </TouchableOpacity>
                </View>
                <TextInput
                  value={prompt.answer}
                  onChangeText={text => handlePromptChange(prompt.id, text)}
                  placeholder="Your answer..."
                  placeholderTextColor="rgba(255, 255, 255, 0.2)"
                  style={styles.promptInput}
                  multiline
                />
              </View>
            ))}

            {prompts.length < 3 && (
              <TouchableOpacity
                style={styles.addPromptButton}
                onPress={() => setShowPromptSelector(true)}>
                <Text style={styles.addPromptText}>+ Add a prompt</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Display Location */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>DISPLAY LOCATION</Text>
          </View>
          <Text style={styles.promptSubtext}>Shown on your profile (not used for matching)</Text>

          <View style={styles.locationContainer}>
            <Feather name="map-pin" size={18} color="rgba(255, 255, 255, 0.4)" />
            <TextInput
              value={location}
              onChangeText={setLocation}
              placeholder="Your location..."
              placeholderTextColor="rgba(255, 255, 255, 0.3)"
              style={styles.locationInput}
            />
          </View>
        </View>

        {/* Visibility Toggles */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>VISIBILITY</Text>

          <View style={styles.togglesList}>
            <ToggleRow
              label="Show my age"
              isOn={toggles.showAge}
              onToggle={() => handleToggle('showAge')}
            />
            <ToggleRow
              label="Show my distance"
              isOn={toggles.showDistance}
              onToggle={() => handleToggle('showDistance')}
            />
            <ToggleRow
              label="Show me in Discover"
              subtext="Turn off to pause being shown to others"
              isOn={toggles.showInDiscover}
              onToggle={() => handleToggle('showInDiscover')}
            />
          </View>
        </View>

        {/* Verification Status */}
        <View style={styles.section}>
          <View style={styles.verificationCard}>
            <View style={styles.verificationLeft}>
              <View style={styles.verificationIcon}>
                <Feather name="shield" size={12} color="#10B981" />
              </View>
              <View>
                <Text style={styles.verificationTitle}>Verified</Text>
                <Text style={styles.verificationSubtext}>Your identity has been confirmed</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Preview Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.previewButton} onPress={handlePreview}>
            <Feather name="eye" size={18} color="rgba(255, 255, 255, 0.9)" />
            <Text style={styles.previewButtonText}>PREVIEW PROFILE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Prompt Selector Modal */}
      <Modal
        visible={showPromptSelector}
        transparent
        animationType="none"
        onRequestClose={() => setShowPromptSelector(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowPromptSelector(false)}>
          <Animated.View
            entering={SlideInDown.springify().damping(20)}
            exiting={SlideOutDown}
            style={styles.promptSelectorContainer}>
            <Pressable onPress={e => e.stopPropagation()}>
              <View style={styles.promptSelectorHeader}>
                <Text style={styles.promptSelectorTitle}>Select a Prompt</Text>
                <TouchableOpacity onPress={() => setShowPromptSelector(false)}>
                  <Feather name="x" size={20} color="rgba(255, 255, 255, 0.5)" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.promptSelectorList}>
                {AVAILABLE_PROMPTS.filter(
                  q => !prompts.some(p => p.question === q)
                ).map(question => (
                  <TouchableOpacity
                    key={question}
                    style={styles.promptSelectorItem}
                    onPress={() => handleSelectPrompt(question)}>
                    <Text style={styles.promptSelectorItemText}>{question}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  )
}

function ToggleRow({
  label,
  subtext,
  isOn,
  onToggle,
}: {
  label: string
  subtext?: string
  isOn: boolean
  onToggle: () => void
}) {
  return (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLabelContainer}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {subtext && <Text style={styles.toggleSubtext}>{subtext}</Text>}
      </View>
      <Switch
        value={isOn}
        onValueChange={onToggle}
        trackColor={{false: 'rgba(255, 255, 255, 0.1)', true: colors.accentViolet}}
        thumbColor="white"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgDeep,
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  headerTitle: {
    fontFamily: fonts.serif,
    fontSize: 20,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  saveText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.accentViolet,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    letterSpacing: 1,
  },
  sectionHint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoSlot: {
    width: '31%',
    aspectRatio: 0.8,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  photoSlotMain: {
    width: '64%',
    aspectRatio: 0.75,
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoDelete: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  mainBadgeText: {
    fontFamily: fonts.mono,
    fontSize: 9,
    fontWeight: '700',
    color: 'white',
  },
  photoSlotEmpty: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoSlotPlaceholder: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'transparent',
  },
  bioContainer: {
    marginTop: 12,
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 16,
    position: 'relative',
  },
  bioInput: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  charCountWarning: {
    color: '#F59E0B',
  },
  promptSubtext: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.3)',
    marginTop: 4,
    marginBottom: 12,
  },
  promptsList: {
    gap: 12,
  },
  promptCard: {
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  promptQuestion: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    flex: 1,
  },
  promptInput: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    padding: 0,
  },
  addPromptButton: {
    height: 80,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPromptText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  locationContainer: {
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  locationInput: {
    flex: 1,
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    padding: 0,
  },
  togglesList: {
    marginTop: 12,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
  },
  toggleLabelContainer: {
    flex: 1,
  },
  toggleLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  toggleSubtext: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.4)',
    marginTop: 2,
  },
  verificationCard: {
    backgroundColor: colors.bgMid,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  verificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  verificationIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationTitle: {
    fontFamily: fonts.serif,
    fontSize: 17,
    fontWeight: '500',
    color: '#10B981',
  },
  verificationSubtext: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  previewButton: {
    height: 48,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  previewButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  promptSelectorContainer: {
    backgroundColor: colors.bgMid,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptSelectorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  promptSelectorTitle: {
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.textPrimary,
  },
  promptSelectorList: {
    padding: 16,
    maxHeight: 400,
  },
  promptSelectorItem: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  promptSelectorItemText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
})
