import React, {useState, useRef, useEffect} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolate,
  interpolateColor,
  Easing,
  FadeIn,
} from 'react-native-reanimated'
import Svg, {Path} from 'react-native-svg'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import {lookupCity} from '../lib/cities'
import type {UserInput} from '../lib/scanOutput'

// Animation constants
const FOCUS_DURATION = 300
const FLASH_DURATION = 800
const BUTTON_PRESS_IN = 100
const BUTTON_PRESS_OUT = 200
const ACCORDION_DURATION = 300

const easeInOutQuart = Easing.bezier(0.77, 0, 0.175, 1)

interface InputFormProps {
  onSubmit: (userInput: UserInput) => void
}

type ValidationState = 'idle' | 'valid' | 'invalid'

// ChevronDown icon component
function ChevronDownIcon({size = 18, color = 'rgba(255, 255, 255, 0.6)'}: {size?: number; color?: string}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M6 9l6 6 6-6"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

// Animated Input Wrapper - handles focus glow and validation flash
interface AnimatedInputWrapperProps {
  focused: boolean
  isFlashing: boolean
  children: React.ReactNode
  style?: object
}

function AnimatedInputWrapper({focused, isFlashing, children, style}: AnimatedInputWrapperProps) {
  const focusGlow = useSharedValue(0)
  const flashProgress = useSharedValue(0)

  useEffect(() => {
    focusGlow.value = withTiming(focused ? 1 : 0, {duration: FOCUS_DURATION, easing: easeInOutQuart})
  }, [focused])

  useEffect(() => {
    if (isFlashing) {
      flashProgress.value = withSequence(
        withTiming(1, {duration: 100}),
        withTiming(0, {duration: FLASH_DURATION - 100})
      )
    }
  }, [isFlashing])

  const animatedStyle = useAnimatedStyle(() => {
    const baseShadowOpacity = interpolate(focusGlow.value, [0, 1], [0, 0.3])
    const baseShadowRadius = interpolate(focusGlow.value, [0, 1], [0, 20])
    const flashShadowOpacity = interpolate(flashProgress.value, [0, 1], [0, 0.5])
    const flashShadowRadius = interpolate(flashProgress.value, [0, 1], [0, 25])
    const shadowOpacity = Math.max(baseShadowOpacity, flashShadowOpacity)
    const shadowRadius = Math.max(baseShadowRadius, flashShadowRadius)
    const shadowColor = interpolateColor(
      flashProgress.value,
      [0, 1],
      ['#8B5CF6', '#10B981']
    )

    return {
      shadowColor,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity,
      shadowRadius,
      elevation: shadowRadius,
    }
  })

  return (
    <Animated.View style={[style, animatedStyle]}>
      {children}
    </Animated.View>
  )
}

// Animated Button with press scale and hover effect
interface AnimatedButtonProps {
  onPress: () => void
  disabled?: boolean
  style: object
  children: React.ReactNode
}

function AnimatedButton({onPress, disabled, style, children}: AnimatedButtonProps) {
  const scale = useSharedValue(1)
  const translateY = useSharedValue(0)

  const handlePressIn = () => {
    scale.value = withTiming(0.98, {duration: BUTTON_PRESS_IN})
    translateY.value = withTiming(0, {duration: BUTTON_PRESS_IN})
  }

  const handlePressOut = () => {
    scale.value = withTiming(1, {duration: BUTTON_PRESS_OUT})
    translateY.value = withTiming(0, {duration: BUTTON_PRESS_OUT})
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}, {translateY: translateY.value}],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        style={style}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
      >
        {children}
      </Pressable>
    </Animated.View>
  )
}

export function InputForm({onSubmit}: InputFormProps) {
  // Form fields
  const [nameFirst, setNameFirst] = useState('')
  const [nameLast, setNameLast] = useState('')
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [birthTime, setBirthTime] = useState('')
  const [city, setCity] = useState('')

  // Validation states
  const [dayValidation, setDayValidation] = useState<ValidationState>('idle')
  const [monthValidation, setMonthValidation] = useState<ValidationState>('idle')
  const [yearValidation, setYearValidation] = useState<ValidationState>('idle')

  // Flash states
  const [dayFlash, setDayFlash] = useState(false)
  const [monthFlash, setMonthFlash] = useState(false)
  const [yearFlash, setYearFlash] = useState(false)

  // Accordion state
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)
  const accordionHeight = useSharedValue(0)
  const chevronRotation = useSharedValue(0)

  // Focus states
  const [firstFocused, setFirstFocused] = useState(false)
  const [lastFocused, setLastFocused] = useState(false)
  const [dayFocused, setDayFocused] = useState(false)
  const [monthFocused, setMonthFocused] = useState(false)
  const [yearFocused, setYearFocused] = useState(false)
  const [timeFocused, setTimeFocused] = useState(false)
  const [cityFocused, setCityFocused] = useState(false)

  // Refs for auto-focus
  const monthRef = useRef<TextInput>(null)
  const yearRef = useRef<TextInput>(null)

  // Accordion animation
  useEffect(() => {
    accordionHeight.value = withTiming(isAccordionOpen ? 200 : 0, {
      duration: ACCORDION_DURATION,
      easing: easeInOutQuart,
    })
    chevronRotation.value = withTiming(isAccordionOpen ? 180 : 0, {
      duration: ACCORDION_DURATION,
      easing: easeInOutQuart,
    })
  }, [isAccordionOpen])

  const accordionAnimatedStyle = useAnimatedStyle(() => ({
    height: accordionHeight.value,
    opacity: interpolate(accordionHeight.value, [0, 200], [0, 1]),
    overflow: 'hidden',
  }))

  const chevronAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${chevronRotation.value}deg`}],
  }))

  // Validation functions
  const validateDay = (value: string) => {
    if (!value) {
      setDayValidation('idle')
      return
    }
    const dayNum = parseInt(value, 10)
    if (dayNum >= 1 && dayNum <= 31) {
      setDayValidation('valid')
      setDayFlash(true)
      setTimeout(() => setDayFlash(false), FLASH_DURATION)
    } else {
      setDayValidation('invalid')
      setDayFlash(false)
    }
  }

  const validateMonth = (value: string) => {
    if (!value) {
      setMonthValidation('idle')
      return
    }
    const monthNum = parseInt(value, 10)
    if (monthNum >= 1 && monthNum <= 12) {
      setMonthValidation('valid')
      setMonthFlash(true)
      setTimeout(() => setMonthFlash(false), FLASH_DURATION)
    } else {
      setMonthValidation('invalid')
      setMonthFlash(false)
    }
  }

  const validateYear = (value: string) => {
    if (!value) {
      setYearValidation('idle')
      return
    }
    const yearNum = parseInt(value, 10)
    const currentYear = new Date().getFullYear()
    if (yearNum >= 1900 && yearNum <= currentYear) {
      setYearValidation('valid')
      setYearFlash(true)
      setTimeout(() => setYearFlash(false), FLASH_DURATION)
    } else {
      setYearValidation('invalid')
      setYearFlash(false)
    }
  }

  const handleDayChange = (value: string) => {
    if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 31)) {
      setDay(value)
      validateDay(value)
      if (value.length === 2 && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 31) {
        monthRef.current?.focus()
      }
    }
  }

  const handleMonthChange = (value: string) => {
    if (value === '' || (/^\d{1,2}$/.test(value) && parseInt(value, 10) <= 12)) {
      setMonth(value)
      validateMonth(value)
      if (value.length === 2 && parseInt(value, 10) >= 1 && parseInt(value, 10) <= 12) {
        yearRef.current?.focus()
      }
    }
  }

  const handleYearChange = (value: string) => {
    if (value === '' || /^\d{1,4}$/.test(value)) {
      setYear(value)
      validateYear(value)
    }
  }

  const getBorderColor = (validation: ValidationState, isFlashing: boolean) => {
    if (validation === 'invalid') return '#EF4444'
    if (validation === 'valid' && isFlashing) return '#10B981'
    return 'rgba(255, 255, 255, 0.1)'
  }

  const handleSubmit = () => {
    if (!nameFirst.trim() || !nameLast.trim()) return
    if (dayValidation !== 'valid' || monthValidation !== 'valid' || yearValidation !== 'valid') return

    const paddedDay = day.padStart(2, '0')
    const paddedMonth = month.padStart(2, '0')
    const birthDate = `${year}-${paddedMonth}-${paddedDay}`

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
      name_middle: null,
      name_last: nameLast.trim(),
      birth_date: birthDate,
      birth_hour: birthTime || null,
      birth_place,
    }

    onSubmit(userInput)
  }

  const isFormValid =
    nameFirst.trim().length > 0 &&
    nameLast.trim().length > 0 &&
    dayValidation === 'valid' &&
    monthValidation === 'valid' &&
    yearValidation === 'valid'

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.formContainer}
      >
        {/* First Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>First Name</Text>
          <AnimatedInputWrapper focused={firstFocused} isFlashing={false} style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, firstFocused && styles.inputFocused]}
              placeholder="Given name"
              placeholderTextColor={colors.textDim}
              value={nameFirst}
              onChangeText={setNameFirst}
              onFocus={() => setFirstFocused(true)}
              onBlur={() => setFirstFocused(false)}
              autoCapitalize="words"
              autoCorrect={false}
              autoFocus
            />
          </AnimatedInputWrapper>
        </View>

        {/* Last Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Last Name</Text>
          <AnimatedInputWrapper focused={lastFocused} isFlashing={false} style={styles.inputWrapper}>
            <TextInput
              style={[styles.input, lastFocused && styles.inputFocused]}
              placeholder="Family name"
              placeholderTextColor={colors.textDim}
              value={nameLast}
              onChangeText={setNameLast}
              onFocus={() => setLastFocused(true)}
              onBlur={() => setLastFocused(false)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </AnimatedInputWrapper>
        </View>

        {/* Date of Birth */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Date of Birth</Text>
          <View style={styles.dateRow}>
            {/* Day Input */}
            <AnimatedInputWrapper focused={dayFocused} isFlashing={dayFlash} style={styles.dateInputWrapperSmall}>
              <TextInput
                style={[
                  styles.dateInput,
                  styles.dateInputSmall,
                  {borderColor: getBorderColor(dayValidation, dayFlash)},
                  dayFocused && styles.inputFocused,
                ]}
                placeholder="DD"
                placeholderTextColor={colors.textDim}
                value={day}
                onChangeText={handleDayChange}
                onFocus={() => setDayFocused(true)}
                onBlur={() => setDayFocused(false)}
                keyboardType="number-pad"
                maxLength={2}
                textAlign="center"
              />
            </AnimatedInputWrapper>

            {/* Month Input */}
            <AnimatedInputWrapper focused={monthFocused} isFlashing={monthFlash} style={styles.dateInputWrapperSmall}>
              <TextInput
                ref={monthRef}
                style={[
                  styles.dateInput,
                  styles.dateInputSmall,
                  {borderColor: getBorderColor(monthValidation, monthFlash)},
                  monthFocused && styles.inputFocused,
                ]}
                placeholder="MM"
                placeholderTextColor={colors.textDim}
                value={month}
                onChangeText={handleMonthChange}
                onFocus={() => setMonthFocused(true)}
                onBlur={() => setMonthFocused(false)}
                keyboardType="number-pad"
                maxLength={2}
                textAlign="center"
              />
            </AnimatedInputWrapper>

            {/* Year Input */}
            <AnimatedInputWrapper focused={yearFocused} isFlashing={yearFlash} style={styles.dateInputWrapperLarge}>
              <TextInput
                ref={yearRef}
                style={[
                  styles.dateInput,
                  styles.dateInputLarge,
                  {borderColor: getBorderColor(yearValidation, yearFlash)},
                  yearFocused && styles.inputFocused,
                ]}
                placeholder="YYYY"
                placeholderTextColor={colors.textDim}
                value={year}
                onChangeText={handleYearChange}
                onFocus={() => setYearFocused(true)}
                onBlur={() => setYearFocused(false)}
                keyboardType="number-pad"
                maxLength={4}
                textAlign="center"
              />
            </AnimatedInputWrapper>
          </View>
        </View>

        {/* Accordion: Customize My Chart */}
        <View style={styles.accordionContainer}>
          <Pressable
            style={styles.accordionHeader}
            onPress={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <Text style={styles.accordionTitle}>Customize My Chart</Text>
            <Animated.View style={chevronAnimatedStyle}>
              <ChevronDownIcon />
            </Animated.View>
          </Pressable>

          {/* Accordion Content */}
          <Animated.View style={accordionAnimatedStyle}>
            <View style={styles.accordionContent}>
              {/* Birth Time */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Birth Time</Text>
                  <Text style={styles.labelOptional}>(Optional)</Text>
                  <Text style={styles.labelInfo}>ⓘ</Text>
                </View>
                <AnimatedInputWrapper focused={timeFocused} isFlashing={false} style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, timeFocused && styles.inputFocused]}
                    placeholder="HH:MM"
                    placeholderTextColor={colors.textDim}
                    value={birthTime}
                    onChangeText={setBirthTime}
                    onFocus={() => setTimeFocused(true)}
                    onBlur={() => setTimeFocused(false)}
                    keyboardType="numbers-and-punctuation"
                    maxLength={5}
                  />
                </AnimatedInputWrapper>
              </View>

              {/* Birth Place */}
              <View style={styles.inputGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Birth Place</Text>
                  <Text style={styles.labelOptional}>(Optional)</Text>
                  <Text style={styles.labelInfo}>ⓘ</Text>
                </View>
                <AnimatedInputWrapper focused={cityFocused} isFlashing={false} style={styles.inputWrapper}>
                  <TextInput
                    style={[styles.input, cityFocused && styles.inputFocused]}
                    placeholder="e.g. London, New York, Tokyo"
                    placeholderTextColor={colors.textDim}
                    value={city}
                    onChangeText={setCity}
                    onFocus={() => setCityFocused(true)}
                    onBlur={() => setCityFocused(false)}
                    autoCapitalize="words"
                    autoCorrect={false}
                  />
                </AnimatedInputWrapper>
              </View>
            </View>
          </Animated.View>
        </View>

        {/* Submit Button */}
        <AnimatedButton
          style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!isFormValid}
        >
          <Text style={styles.submitButtonText}>Calculate</Text>
        </AnimatedButton>
      </Animated.View>
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
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputWrapper: {
    borderRadius: 8,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  labelOptional: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontWeight: '400',
  },
  labelInfo: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 19,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: fonts.serif,
  },
  inputFocused: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  dateRow: {
    flexDirection: 'row',
    gap: 8,
  },
  dateInputWrapperSmall: {
    width: 80,
    borderRadius: 8,
  },
  dateInputWrapperLarge: {
    flex: 1,
    borderRadius: 8,
  },
  dateInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 2,
    borderRadius: 8,
    paddingVertical: 16,
    fontSize: 19,
    color: 'rgba(255, 255, 255, 0.9)',
    fontFamily: fonts.serif,
  },
  dateInputSmall: {
    width: 80,
    paddingHorizontal: 12,
  },
  dateInputLarge: {
    flex: 1,
    paddingHorizontal: 12,
  },
  accordionContainer: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    padding: 16,
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionTitle: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.6)',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  accordionContent: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderStyle: 'dashed',
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    gap: 16,
  },
  submitButton: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 50,
    paddingHorizontal: 48,
    paddingVertical: 16,
    alignItems: 'center',
    alignSelf: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.95)',
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
})
