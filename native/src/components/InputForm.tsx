import React, {useState} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import Animated, {FadeIn} from 'react-native-reanimated'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

interface InputFormProps {
  onSubmit: (name: string, dob: string) => void
}

export function InputForm({onSubmit}: InputFormProps) {
  const [name, setName] = useState('')
  const [date, setDate] = useState<Date | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)

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

  return (
    <Animated.View entering={FadeIn.duration(500)} style={styles.container}>
      {/* Name Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>FULL NAME</Text>
        <TextInput
          style={styles.input}
          placeholder="As given at birth"
          placeholderTextColor={colors.textDim}
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          autoCorrect={false}
        />
      </View>

      {/* Date of Birth Input */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>DATE OF BIRTH</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}>
          <Text
            style={[styles.inputText, !date && styles.inputPlaceholder]}>
            {date ? formatDisplayDate(date) : 'Select your birth date'}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date || new Date(1990, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleDateChange}
            maximumDate={new Date()}
            minimumDate={new Date(1900, 0, 1)}
            themeVariant="dark"
          />
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isValid}
        activeOpacity={0.8}>
        <Text style={styles.buttonText}>CALCULATE</Text>
      </TouchableOpacity>
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
    borderColor: colors.borderLight,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: fonts.serif,
  },
  inputText: {
    fontSize: 17,
    color: colors.textPrimary,
    fontFamily: fonts.serif,
  },
  inputPlaceholder: {
    color: colors.textDim,
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
