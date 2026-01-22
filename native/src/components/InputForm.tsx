import React, {useState, useCallback} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
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

// easeInOutQuart matching Blueprint
const EASING = Easing.bezier(0.77, 0, 0.175, 1)

interface InputFormProps {
  onSubmit: (name: string, dob: string) => void
}

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput)
const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

export function InputForm({onSubmit}: InputFormProps) {
  const [name, setName] = useState('')
  const [date, setDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

  // Focus states
  const nameFocus = useSharedValue(0)
  const dateFocus = useSharedValue(0)
  const buttonScale = useSharedValue(1)

  const formatDate = (d: Date): string => {
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const formatDisplayDate = (d: Date): string => {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDateChange = (_: unknown, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios')
    if (selectedDate) {
      setDate(selectedDate)
    }
  }

  const handleSubmit = () => {
    if (name.trim() && date) {
      onSubmit(name.trim(), formatDate(date))
    }
  }

  const isValid = name.trim().length > 0 && date !== null

  // Animated styles for name input
  const nameInputStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      nameFocus.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.1)', 'rgba(139, 92, 246, 0.5)']
    ),
    shadowOpacity: nameFocus.value * 0.3,
    shadowRadius: nameFocus.value * 20,
  }))

  // Animated styles for date input
  const dateInputStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      dateFocus.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.1)', 'rgba(139, 92, 246, 0.5)']
    ),
    shadowOpacity: dateFocus.value * 0.3,
    shadowRadius: dateFocus.value * 20,
  }))

  // Button animation
  const buttonStyle = useAnimatedStyle(() => ({
    transform: [{scale: buttonScale.value}],
  }))

  const handleNameFocus = useCallback(() => {
    nameFocus.value = withTiming(1, {duration: 300, easing: EASING})
  }, [])

  const handleNameBlur = useCallback(() => {
    nameFocus.value = withTiming(0, {duration: 300, easing: EASING})
  }, [])

  const handleDatePress = useCallback(() => {
    dateFocus.value = withTiming(1, {duration: 300, easing: EASING})
    setShowDatePicker(true)
  }, [])

  const handleDateClose = useCallback(() => {
    dateFocus.value = withTiming(0, {duration: 300, easing: EASING})
  }, [])

  const handleButtonPressIn = useCallback(() => {
    buttonScale.value = withTiming(0.98, {duration: 100})
  }, [])

  const handleButtonPressOut = useCallback(() => {
    buttonScale.value = withTiming(1, {duration: 200, easing: EASING})
  }, [])

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>FULL NAME</Text>
        <AnimatedTextInput
          style={[styles.input, nameInputStyle]}
          placeholder="As given at birth"
          placeholderTextColor={colors.textDim}
          value={name}
          onChangeText={setName}
          onFocus={handleNameFocus}
          onBlur={handleNameBlur}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      {/* Date of Birth Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>DATE OF BIRTH</Text>
        <AnimatedPressable
          style={[styles.input, dateInputStyle]}
          onPress={handleDatePress}>
          <Text style={[styles.inputText, !date && styles.inputPlaceholder]}>
            {date ? formatDisplayDate(date) : 'Select your birth date'}
          </Text>
        </AnimatedPressable>

        {showDatePicker && (
          <View>
            <DateTimePicker
              value={date || new Date(1990, 0, 1)}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, d) => {
                handleDateChange(e, d)
                if (Platform.OS !== 'ios') {
                  handleDateClose()
                }
              }}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
              themeVariant="dark"
            />
            {Platform.OS === 'ios' && (
              <Pressable style={styles.doneButton} onPress={() => {
                setShowDatePicker(false)
                handleDateClose()
              }}>
                <Text style={styles.doneButtonText}>Done</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* Submit Button */}
      <AnimatedPressable
        style={[
          styles.button,
          !isValid && styles.buttonDisabled,
          buttonStyle,
        ]}
        onPress={handleSubmit}
        onPressIn={isValid ? handleButtonPressIn : undefined}
        onPressOut={isValid ? handleButtonPressOut : undefined}
        disabled={!isValid}>
        <Text style={styles.buttonText}>CALCULATE</Text>
      </AnimatedPressable>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 300,
    gap: 24,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.mono,
    fontSize: 10,
    letterSpacing: 3,
    color: colors.textDim,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: fonts.serif,
    // Shadow for focus glow
    shadowColor: '#8B5CF6',
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  inputText: {
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: fonts.serif,
  },
  inputPlaceholder: {
    color: colors.textDim,
  },
  doneButton: {
    alignSelf: 'center',
    marginTop: 8,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  doneButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: 'rgba(139, 92, 246, 0.8)',
    letterSpacing: 1,
  },
  button: {
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 50,
    paddingHorizontal: 48,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontFamily: fonts.mono,
    fontSize: 12,
    letterSpacing: 3,
    color: colors.textPrimary,
  },
})
