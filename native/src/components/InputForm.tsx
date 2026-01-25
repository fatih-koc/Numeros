import React, {useState, useCallback} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native'
import Animated, {
  FadeIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
} from 'react-native-reanimated'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import {lookupCity} from '../lib/cities'
import type {UserInput} from '../lib/scanOutput'

// easeInOutQuart matching Blueprint
const EASING = Easing.bezier(0.77, 0, 0.175, 1)

interface InputFormProps {
  onSubmit: (userInput: UserInput) => void
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// Format date input as DD.MM.YYYY
function formatDateInput(text: string, prevText: string): string {
  // Remove non-numeric characters except dots
  const cleaned = text.replace(/[^0-9.]/g, '')

  // If user is deleting, allow it
  if (cleaned.length < prevText.length) {
    return cleaned
  }

  // Remove all dots to work with pure numbers
  const numbers = cleaned.replace(/\./g, '')

  // Build formatted string
  let formatted = ''
  for (let i = 0; i < numbers.length && i < 8; i++) {
    if (i === 2 || i === 4) {
      formatted += '.'
    }
    formatted += numbers[i]
  }

  return formatted
}

// Format time input as HH:MM
function formatTimeInput(text: string, prevText: string): string {
  // Remove non-numeric characters except colon
  const cleaned = text.replace(/[^0-9:]/g, '')

  // If user is deleting, allow it
  if (cleaned.length < prevText.length) {
    return cleaned
  }

  // Remove all colons to work with pure numbers
  const numbers = cleaned.replace(/:/g, '')

  // Build formatted string
  let formatted = ''
  for (let i = 0; i < numbers.length && i < 4; i++) {
    if (i === 2) {
      formatted += ':'
    }
    formatted += numbers[i]
  }

  return formatted
}

// Parse DD.MM.YYYY to YYYY-MM-DD
function parseDateString(dateStr: string): string | null {
  const parts = dateStr.split('.')
  if (parts.length !== 3) return null

  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10)
  const year = parseInt(parts[2], 10)

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null
  if (day < 1 || day > 31) return null
  if (month < 1 || month > 12) return null
  if (year < 1900 || year > new Date().getFullYear()) return null

  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

// Validate date string
function isValidDate(dateStr: string): boolean {
  return parseDateString(dateStr) !== null
}

// Validate time string
function isValidTime(timeStr: string): boolean {
  if (!timeStr || timeStr.length === 0) return true // Optional field

  const parts = timeStr.split(':')
  if (parts.length !== 2) return false

  const hours = parseInt(parts[0], 10)
  const minutes = parseInt(parts[1], 10)

  if (isNaN(hours) || isNaN(minutes)) return false
  if (hours < 0 || hours > 23) return false
  if (minutes < 0 || minutes > 59) return false

  return true
}

export function InputForm({onSubmit}: InputFormProps) {
  const [step, setStep] = useState<1 | 2>(1)

  // Step 1 fields
  const [nameFirst, setNameFirst] = useState('')
  const [nameMiddle, setNameMiddle] = useState('')
  const [nameLast, setNameLast] = useState('')

  // Step 2 fields - now strings
  const [dateText, setDateText] = useState('')
  const [timeText, setTimeText] = useState('')
  const [city, setCity] = useState('')

  // Focus states
  const firstFocus = useSharedValue(0)
  const middleFocus = useSharedValue(0)
  const lastFocus = useSharedValue(0)
  const dateFocus = useSharedValue(0)
  const timeFocus = useSharedValue(0)
  const cityFocus = useSharedValue(0)
  const buttonScale = useSharedValue(1)

  const handleDateTextChange = (text: string) => {
    setDateText(formatDateInput(text, dateText))
  }

  const handleTimeTextChange = (text: string) => {
    setTimeText(formatTimeInput(text, timeText))
  }

  const handleStep1Submit = () => {
    if (nameFirst.trim() && nameLast.trim()) {
      setStep(2)
    }
  }

  const handleStep2Submit = () => {
    const birthDate = parseDateString(dateText)
    if (!birthDate) return

    let birth_place = null
    if (city.trim()) {
      const cityData = lookupCity(city.trim())
      if (cityData) {
        birth_place = {
          city: cityData.name,
          country: cityData.country,
          latitude: cityData.latitude,
          longitude: cityData.longitude,
        }
      }
    }

    const userInput: UserInput = {
      name_first: nameFirst.trim(),
      name_middle: nameMiddle.trim() || null,
      name_last: nameLast.trim(),
      birth_date: birthDate,
      birth_hour: timeText && isValidTime(timeText) ? timeText : null,
      birth_place,
    }

    onSubmit(userInput)
  }

  const handleBack = () => {
    setStep(1)
  }

  const isStep1Valid = nameFirst.trim().length > 0 && nameLast.trim().length > 0
  const isStep2Valid = isValidDate(dateText) && isValidTime(timeText)

  // Animated input style creator
  const createInputStyle = (focusValue: Animated.SharedValue<number>, focusColor = 'rgba(139, 92, 246, 0.5)') =>
    useAnimatedStyle(() => ({
      borderColor: interpolateColor(
        focusValue.value,
        [0, 1],
        ['rgba(255, 255, 255, 0.1)', focusColor]
      ),
      shadowOpacity: focusValue.value * 0.3,
      shadowRadius: focusValue.value * 20,
    }))

  const firstInputStyle = createInputStyle(firstFocus)
  const middleInputStyle = createInputStyle(middleFocus)
  const lastInputStyle = createInputStyle(lastFocus)
  const dateInputStyle = createInputStyle(dateFocus, 'rgba(236, 72, 153, 0.5)')
  const timeInputStyle = createInputStyle(timeFocus, 'rgba(236, 72, 153, 0.5)')
  const cityInputStyle = createInputStyle(cityFocus, 'rgba(236, 72, 153, 0.5)')

  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
  }))

  const handleFocusIn = useCallback((focusValue: Animated.SharedValue<number>) => () => {
    focusValue.value = withTiming(1, {duration: 300, easing: EASING})
  }, [])

  const handleFocusOut = useCallback((focusValue: Animated.SharedValue<number>) => () => {
    focusValue.value = withTiming(0, {duration: 300, easing: EASING})
  }, [])

  const handleButtonPressIn = useCallback(() => {
    buttonScale.value = withTiming(0.98, {duration: 100})
  }, [])

  const handleButtonPressOut = useCallback(() => {
    buttonScale.value = withTiming(1, {duration: 200, easing: EASING})
  }, [])

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Step Indicator */}
      <View style={styles.stepIndicator}>
        <View style={[styles.stepItem, step === 1 ? styles.stepActive : styles.stepInactive]}>
          <View style={[styles.stepCircle, step === 1 && styles.stepCircleActive]}>
            <Text style={[styles.stepNumber, step === 1 && styles.stepNumberActive]}>1</Text>
          </View>
          <Text style={[styles.stepLabel, step === 1 && styles.stepLabelActive]}>NAME</Text>
        </View>

        <View style={styles.stepLine} />

        <View style={[styles.stepItem, step === 2 ? styles.stepActive : styles.stepInactive]}>
          <View style={[styles.stepCircle, step === 2 && styles.stepCircleActiveAlt]}>
            <Text style={[styles.stepNumber, step === 2 && styles.stepNumberActive]}>2</Text>
          </View>
          <Text style={[styles.stepLabel, step === 2 && styles.stepLabelActive]}>BIRTH</Text>
        </View>
      </View>

      {/* Step 1: Name Fields */}
      {step === 1 && (
        <Animated.View entering={FadeIn.duration(500)} style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FIRST NAME</Text>
            <AnimatedTextInput
              style={[styles.input, firstInputStyle]}
              placeholder="Given name"
              placeholderTextColor={colors.textDim}
              value={nameFirst}
              onChangeText={setNameFirst}
              onFocus={handleFocusIn(firstFocus)}
              onBlur={handleFocusOut(firstFocus)}
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>MIDDLE NAME</Text>
              <Text style={styles.labelOptional}>(Optional)</Text>
            </View>
            <AnimatedTextInput
              style={[styles.input, middleInputStyle]}
              placeholder="Middle name(s)"
              placeholderTextColor={colors.textDim}
              value={nameMiddle}
              onChangeText={setNameMiddle}
              onFocus={handleFocusIn(middleFocus)}
              onBlur={handleFocusOut(middleFocus)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LAST NAME</Text>
            <AnimatedTextInput
              style={[styles.input, lastInputStyle]}
              placeholder="Family name"
              placeholderTextColor={colors.textDim}
              value={nameLast}
              onChangeText={setNameLast}
              onFocus={handleFocusIn(lastFocus)}
              onBlur={handleFocusOut(lastFocus)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <AnimatedPressable
            style={[
              styles.button,
              styles.buttonPurple,
              !isStep1Valid && styles.buttonDisabled,
              buttonStyle,
            ]}
            onPress={handleStep1Submit}
            onPressIn={isStep1Valid ? handleButtonPressIn : undefined}
            onPressOut={isStep1Valid ? handleButtonPressOut : undefined}
            disabled={!isStep1Valid}>
            <Text style={styles.buttonText}>CONTINUE</Text>
          </AnimatedPressable>
        </Animated.View>
      )}

      {/* Step 2: Birth Data Fields */}
      {step === 2 && (
        <Animated.View entering={FadeIn.duration(500)} style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DATE OF BIRTH</Text>
            <AnimatedTextInput
              style={[styles.input, dateInputStyle]}
              placeholder="DD.MM.YYYY"
              placeholderTextColor={colors.textDim}
              value={dateText}
              onChangeText={handleDateTextChange}
              onFocus={handleFocusIn(dateFocus)}
              onBlur={handleFocusOut(dateFocus)}
              keyboardType="numeric"
              maxLength={10}
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>BIRTH TIME</Text>
              <Text style={styles.labelOptional}>(Optional)</Text>
            </View>
            <AnimatedTextInput
              style={[styles.input, timeInputStyle]}
              placeholder="HH:MM"
              placeholderTextColor={colors.textDim}
              value={timeText}
              onChangeText={handleTimeTextChange}
              onFocus={handleFocusIn(timeFocus)}
              onBlur={handleFocusOut(timeFocus)}
              keyboardType="numeric"
              maxLength={5}
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>BIRTH PLACE</Text>
              <Text style={styles.labelOptional}>(Optional)</Text>
            </View>
            <AnimatedTextInput
              style={[styles.input, cityInputStyle]}
              placeholder="e.g. London, New York, Tokyo"
              placeholderTextColor={colors.textDim}
              value={city}
              onChangeText={setCity}
              onFocus={handleFocusIn(cityFocus)}
              onBlur={handleFocusOut(cityFocus)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.buttonRow}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>BACK</Text>
            </Pressable>

            <AnimatedPressable
              style={[
                styles.button,
                styles.buttonPink,
                styles.buttonFlex,
                !isStep2Valid && styles.buttonDisabled,
                buttonStyle,
              ]}
              onPress={handleStep2Submit}
              onPressIn={isStep2Valid ? handleButtonPressIn : undefined}
              onPressOut={isStep2Valid ? handleButtonPressOut : undefined}
              disabled={!isStep2Valid}>
              <Text style={styles.buttonText}>CALCULATE</Text>
            </AnimatedPressable>
          </View>
        </Animated.View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepActive: {
    opacity: 1,
  },
  stepInactive: {
    opacity: 0.3,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.textDim,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    borderColor: 'rgba(139, 92, 246, 1)',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  stepCircleActiveAlt: {
    borderColor: 'rgba(236, 72, 153, 1)',
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
  },
  stepNumber: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textDim,
  },
  stepNumberActive: {
    color: colors.textPrimary,
  },
  stepLabel: {
    fontFamily: fonts.mono,
    fontSize: 14,
    letterSpacing: 2,
    color: colors.textDim,
  },
  stepLabelActive: {
    color: colors.textPrimary,
  },
  stepLine: {
    width: 40,
    height: 1,
    backgroundColor: colors.textDim,
    marginHorizontal: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 340,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 14,
    letterSpacing: 3,
    color: colors.textSecondary,
  },
  labelOptional: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textDim,
    opacity: 0.5,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: fonts.serif,
    shadowColor: '#8B5CF6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 48,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonPurple: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  buttonPink: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
  buttonFlex: {
    flex: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 15,
    letterSpacing: 3,
    color: colors.textSecondary,
  },
  backButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    fontFamily: fonts.monoSemiBold,
    fontSize: 15,
    letterSpacing: 3,
    color: colors.textDim,
  },
})
