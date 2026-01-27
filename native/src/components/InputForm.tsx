import React, {useState, useRef} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from 'react-native'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'
import {lookupCity} from '../lib/cities'
import type {UserInput} from '../lib/scanOutput'

interface InputFormProps {
  onSubmit: (userInput: UserInput) => void
}

// Validation states
type ValidationState = 'idle' | 'valid' | 'invalid'

// Validate day (1-31)
function isValidDay(day: string): boolean {
  const num = parseInt(day, 10)
  return !isNaN(num) && num >= 1 && num <= 31
}

// Validate month (1-12)
function isValidMonth(month: string): boolean {
  const num = parseInt(month, 10)
  return !isNaN(num) && num >= 1 && num <= 12
}

// Validate year (1900 - current)
function isValidYear(year: string): boolean {
  const num = parseInt(year, 10)
  return !isNaN(num) && num >= 1900 && num <= new Date().getFullYear()
}

// Validate time string (HH:MM)
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

// Format time input as HH:MM
function formatTimeInput(text: string, prevText: string): string {
  const cleaned = text.replace(/[^0-9:]/g, '')
  if (cleaned.length < prevText.length) return cleaned
  const numbers = cleaned.replace(/:/g, '')
  let formatted = ''
  for (let i = 0; i < numbers.length && i < 4; i++) {
    if (i === 2) formatted += ':'
    formatted += numbers[i]
  }
  return formatted
}

export function InputForm({onSubmit}: InputFormProps) {
  const [step, setStep] = useState<1 | 2>(1)

  // Step 1 fields
  const [nameFirst, setNameFirst] = useState('')
  const [nameMiddle, setNameMiddle] = useState('')
  const [nameLast, setNameLast] = useState('')

  // Step 2 fields - separate date inputs
  const [day, setDay] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')
  const [timeText, setTimeText] = useState('')
  const [city, setCity] = useState('')

  // Validation states
  const [dayValidation, setDayValidation] = useState<ValidationState>('idle')
  const [monthValidation, setMonthValidation] = useState<ValidationState>('idle')
  const [yearValidation, setYearValidation] = useState<ValidationState>('idle')

  // Accordion state
  const [optionalExpanded, setOptionalExpanded] = useState(false)

  // Focus states
  const [firstFocused, setFirstFocused] = useState(false)
  const [middleFocused, setMiddleFocused] = useState(false)
  const [lastFocused, setLastFocused] = useState(false)
  const [dayFocused, setDayFocused] = useState(false)
  const [monthFocused, setMonthFocused] = useState(false)
  const [yearFocused, setYearFocused] = useState(false)
  const [timeFocused, setTimeFocused] = useState(false)
  const [cityFocused, setCityFocused] = useState(false)

  // Refs for auto-focus
  const monthRef = useRef<TextInput>(null)
  const yearRef = useRef<TextInput>(null)

  // Handle day input
  const handleDayChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2)
    setDay(cleaned)

    if (cleaned.length === 2) {
      if (isValidDay(cleaned)) {
        setDayValidation('valid')
        monthRef.current?.focus()
      } else {
        setDayValidation('invalid')
      }
    } else if (cleaned.length === 0) {
      setDayValidation('idle')
    }
  }

  // Handle month input
  const handleMonthChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 2)
    setMonth(cleaned)

    if (cleaned.length === 2) {
      if (isValidMonth(cleaned)) {
        setMonthValidation('valid')
        yearRef.current?.focus()
      } else {
        setMonthValidation('invalid')
      }
    } else if (cleaned.length === 0) {
      setMonthValidation('idle')
    }
  }

  // Handle year input
  const handleYearChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, 4)
    setYear(cleaned)

    if (cleaned.length === 4) {
      if (isValidYear(cleaned)) {
        setYearValidation('valid')
      } else {
        setYearValidation('invalid')
      }
    } else if (cleaned.length === 0) {
      setYearValidation('idle')
    }
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
    if (!isValidDay(day) || !isValidMonth(month) || !isValidYear(year)) return

    const birthDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`

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

  const toggleOptional = () => {
    setOptionalExpanded(!optionalExpanded)
  }

  const isStep1Valid = nameFirst.trim().length > 0 && nameLast.trim().length > 0
  const isStep2Valid =
    dayValidation === 'valid' &&
    monthValidation === 'valid' &&
    yearValidation === 'valid' &&
    isValidTime(timeText)

  // Get border style based on validation
  const getInputStyle = (validation: ValidationState, focused: boolean) => {
    if (validation === 'valid') return styles.inputValid
    if (validation === 'invalid') return styles.inputInvalid
    if (focused) return styles.inputFocused
    return null
  }

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
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>FIRST NAME</Text>
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
            />
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>MIDDLE NAME</Text>
              <Text style={styles.labelOptional}>(Optional)</Text>
            </View>
            <TextInput
              style={[styles.input, middleFocused && styles.inputFocused]}
              placeholder="Middle name(s)"
              placeholderTextColor={colors.textDim}
              value={nameMiddle}
              onChangeText={setNameMiddle}
              onFocus={() => setMiddleFocused(true)}
              onBlur={() => setMiddleFocused(false)}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>LAST NAME</Text>
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
          </View>

          <Pressable
            style={[styles.button, styles.buttonPurple, !isStep1Valid && styles.buttonDisabled]}
            onPress={handleStep1Submit}
            disabled={!isStep1Valid}>
            <Text style={styles.buttonText}>CONTINUE</Text>
          </Pressable>
        </View>
      )}

      {/* Step 2: Birth Data Fields */}
      {step === 2 && (
        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>DATE OF BIRTH</Text>
            <View style={styles.dateRow}>
              {/* Day Input */}
              <TextInput
                style={[styles.dateInput, styles.dateInputSmall, getInputStyle(dayValidation, dayFocused)]}
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

              <Text style={styles.dateSeparator}>/</Text>

              {/* Month Input */}
              <TextInput
                ref={monthRef}
                style={[styles.dateInput, styles.dateInputSmall, getInputStyle(monthValidation, monthFocused)]}
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

              <Text style={styles.dateSeparator}>/</Text>

              {/* Year Input */}
              <TextInput
                ref={yearRef}
                style={[styles.dateInput, styles.dateInputLarge, getInputStyle(yearValidation, yearFocused)]}
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
            </View>
          </View>

          {/* Accordion Toggle */}
          <Pressable style={styles.accordionToggle} onPress={toggleOptional}>
            <Text style={styles.accordionText}>
              {optionalExpanded ? 'Hide optional fields' : 'Add time & place (optional)'}
            </Text>
            <Text style={styles.chevron}>{optionalExpanded ? '▲' : '▼'}</Text>
          </Pressable>

          {/* Collapsible Optional Fields */}
          {optionalExpanded && (
            <View style={styles.optionalFields}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>BIRTH TIME</Text>
                <TextInput
                  style={[styles.input, timeFocused && styles.inputFocused]}
                  placeholder="HH:MM (24h format)"
                  placeholderTextColor={colors.textDim}
                  value={timeText}
                  onChangeText={handleTimeTextChange}
                  onFocus={() => setTimeFocused(true)}
                  onBlur={() => setTimeFocused(false)}
                  keyboardType="numeric"
                  maxLength={5}
                  autoCorrect={false}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>BIRTH PLACE</Text>
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
              </View>
            </View>
          )}

          <View style={styles.buttonRow}>
            <Pressable style={styles.backButton} onPress={handleBack}>
              <Text style={styles.backButtonText}>BACK</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonPink, styles.buttonFlex, !isStep2Valid && styles.buttonDisabled]}
              onPress={handleStep2Submit}
              disabled={!isStep2Valid}>
              <Text style={styles.buttonText}>CALCULATE</Text>
            </Pressable>
          </View>
        </View>
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
  },
  inputFocused: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
  },
  inputValid: {
    borderColor: 'rgba(16, 185, 129, 0.6)',
  },
  inputInvalid: {
    borderColor: 'rgba(239, 68, 68, 0.6)',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingVertical: 16,
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: fonts.serif,
  },
  dateInputSmall: {
    width: 64,
    paddingHorizontal: 8,
  },
  dateInputLarge: {
    flex: 1,
    paddingHorizontal: 12,
  },
  dateSeparator: {
    fontFamily: fonts.mono,
    fontSize: 20,
    color: colors.textDim,
  },
  accordionToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  accordionText: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textDim,
  },
  chevron: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.textDim,
  },
  optionalFields: {
    gap: 20,
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
