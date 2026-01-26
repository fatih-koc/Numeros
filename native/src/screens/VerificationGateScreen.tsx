import React, {useState, useRef, useEffect} from 'react'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native'
import {useNavigation} from '@react-navigation/native'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import type {RootStackParamList} from '../navigation/types'
import Animated, {FadeIn} from 'react-native-reanimated'
import Svg, {Line, Text as SvgText, Path, Circle, Rect} from 'react-native-svg'
import {ScreenWrapper} from '../components/ScreenWrapper'
import {useNumerology} from '../contexts'
import {colors} from '../lib/colors'
import {fonts} from '../lib/fonts'

type VerificationStep = 'initial' | 'phone_input' | 'email_input' | 'otp'
type ValidationStatus = 'idle' | 'valid' | 'invalid'

type VerificationNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Verification'>

const PLANET_SYMBOLS = ['Q', 'R', 'S', 'T', 'U', 'V', 'W'] // Astronomicon font
const PLANET_COLORS = [
  '#F59E0B', // Sun - Orange
  '#E0E0E0', // Moon - Silver
  '#8B5CF6', // Mercury - Purple
  '#06B6D4', // Venus - Cyan
  '#DC2626', // Mars - Red
  '#FBBF24', // Jupiter - Yellow
  '#4A90D9', // Saturn - Blue
]

const PLANET_POSITIONS = [
  {x: 120, y: 0}, // Top center
  {x: 240, y: 60}, // Right top
  {x: 240, y: 180}, // Right bottom
  {x: 120, y: 240}, // Bottom center
  {x: 0, y: 180}, // Left bottom
  {x: 0, y: 60}, // Left top
  {x: 60, y: 0}, // Top left-center
]

export function VerificationGateScreen() {
  const navigation = useNavigation<VerificationNavigationProp>()
  const {scanOutput} = useNumerology()

  const [step, setStep] = useState<VerificationStep>('initial')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [email, setEmail] = useState('')
  const [phoneValidation, setPhoneValidation] = useState<ValidationStatus>('idle')
  const [emailValidation, setEmailValidation] = useState<ValidationStatus>('idle')
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', ''])
  const [verificationMethod, setVerificationMethod] = useState<'phone' | 'email' | null>(null)
  const [resendCountdown, setResendCountdown] = useState(0)

  const inputRefs = useRef<(TextInput | null)[]>([])

  // Redirect if no scan data
  useEffect(() => {
    if (!scanOutput) {
      navigation.goBack()
    }
  }, [scanOutput, navigation])

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCountdown])

  if (!scanOutput) {
    return null
  }

  const {numerology} = scanOutput

  // Validation functions
  const validatePhone = (value: string) => {
    const phoneRegex = /^\+[1-9]\d{6,14}$/
    if (!value) {
      setPhoneValidation('idle')
    } else if (phoneRegex.test(value)) {
      setPhoneValidation('valid')
    } else {
      setPhoneValidation('invalid')
    }
  }

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      setEmailValidation('idle')
    } else if (emailRegex.test(value)) {
      setEmailValidation('valid')
    } else {
      setEmailValidation('invalid')
    }
  }

  const handlePhoneChange = (value: string) => {
    setPhoneNumber(value)
    validatePhone(value)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    validateEmail(value)
  }

  const handleContactSubmit = () => {
    if (
      (step === 'phone_input' && phoneValidation === 'valid') ||
      (step === 'email_input' && emailValidation === 'valid')
    ) {
      setStep('otp')
      setResendCountdown(60)
      setTimeout(() => {
        inputRefs.current[0]?.focus()
      }, 100)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return
    if (value && !/^\d$/.test(value)) return

    const newOtp = [...otpDigits]
    newOtp[index] = value
    setOtpDigits(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyPress = (index: number, e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerifySubmit = () => {
    const code = otpDigits.join('')
    if (code.length === 6) {
      navigation.navigate('UniverseScan')
    }
  }

  const handleGoogleAppleVerify = () => {
    navigation.navigate('UniverseScan')
  }

  const handleResendOtp = () => {
    if (resendCountdown === 0) {
      setResendCountdown(60)
    }
  }

  const isOtpComplete = otpDigits.every(digit => digit !== '')

  const getBorderColor = (validation: ValidationStatus) => {
    if (validation === 'valid') return '#10B981'
    if (validation === 'invalid') return '#EF4444'
    return 'rgba(255, 255, 255, 0.2)'
  }

  const getSubheading = () => {
    if (step === 'phone_input') return 'Enter your phone number.'
    if (step === 'email_input') return 'Enter your email address.'
    if (step === 'otp') return `Code sent to your ${verificationMethod}.`
    return 'Seal it to your identity.'
  }

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeIn.duration(600)} style={styles.container}>
          {/* Love Matrix Visual */}
          <View style={styles.matrixContainer}>
            <Svg width={280} height={280} viewBox="0 0 280 280" style={styles.matrixSvg}>
              {/* Connecting Lines from center to corners */}
              <Line x1={140} y1={140} x2={20} y2={20} stroke="rgba(139, 92, 246, 0.3)" strokeWidth={1} />
              <Line x1={140} y1={140} x2={260} y2={20} stroke="rgba(139, 92, 246, 0.3)" strokeWidth={1} />
              <Line x1={140} y1={140} x2={20} y2={260} stroke="rgba(139, 92, 246, 0.3)" strokeWidth={1} />
              <Line x1={140} y1={140} x2={260} y2={260} stroke="rgba(139, 92, 246, 0.3)" strokeWidth={1} />

              {/* Planet symbols along edges */}
              {PLANET_SYMBOLS.map((symbol, index) => {
                const pos = PLANET_POSITIONS[index]
                const color = PLANET_COLORS[index]
                return (
                  <SvgText
                    key={index}
                    x={pos.x + 20}
                    y={pos.y + 25}
                    textAnchor="middle"
                    fill={color}
                    fontSize={20}
                    fontFamily={fonts.symbols}>
                    {symbol}
                  </SvgText>
                )
              })}

              {/* Eight-pointed star at center */}
              <Path
                d="M140 110 L145 135 L170 140 L145 145 L140 170 L135 145 L110 140 L135 135 Z"
                fill="rgba(139, 92, 246, 0.3)"
                stroke="rgba(139, 92, 246, 0.8)"
                strokeWidth={1.5}
              />
            </Svg>

            {/* Top-left: Life Path (circle) */}
            <View style={[styles.cornerNumber, styles.topLeft]}>
              <View style={[styles.circleNumber, {backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.6)'}]}>
                <Text style={[styles.cornerNumberText, {color: '#F59E0B'}]}>{numerology.life_path}</Text>
              </View>
            </View>

            {/* Top-right: Soul Urge (triangle) */}
            <View style={[styles.cornerNumber, styles.topRight]}>
              <Svg width={36} height={36} viewBox="0 0 36 36">
                <Path
                  d="M18 4 L34 32 L2 32 Z"
                  fill="rgba(6, 182, 212, 0.2)"
                  stroke="rgba(6, 182, 212, 0.6)"
                  strokeWidth={2}
                />
              </Svg>
              <Text style={[styles.cornerNumberText, styles.overlayText, {color: '#06B6D4', marginTop: 4}]}>
                {numerology.soul_urge}
              </Text>
            </View>

            {/* Bottom-left: Expression (square) */}
            <View style={[styles.cornerNumber, styles.bottomLeft]}>
              <View style={[styles.squareNumber, {backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.6)'}]}>
                <Text style={[styles.cornerNumberText, {color: '#10B981'}]}>{numerology.expression}</Text>
              </View>
            </View>

            {/* Bottom-right: Personality (diamond) */}
            <View style={[styles.cornerNumber, styles.bottomRight]}>
              <Svg width={36} height={36} viewBox="0 0 36 36">
                <Path
                  d="M18 2 L34 18 L18 34 L2 18 Z"
                  fill="rgba(244, 114, 182, 0.2)"
                  stroke="rgba(244, 114, 182, 0.6)"
                  strokeWidth={2}
                />
              </Svg>
              <Text style={[styles.cornerNumberText, styles.overlayText, {color: '#F472B6'}]}>
                {numerology.personality}
              </Text>
            </View>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>Your matrix is complete.</Text>
          <Text style={styles.subheading}>{getSubheading()}</Text>

          {/* Verification Options / Input Forms */}
          <View style={styles.formContainer}>
            {step === 'initial' && (
              <>
                {/* Phone Button */}
                <TouchableOpacity
                  style={styles.methodButton}
                  onPress={() => {
                    setStep('phone_input')
                    setVerificationMethod('phone')
                  }}
                  activeOpacity={0.7}>
                  <Text style={styles.methodButtonIcon}>P</Text>
                  <Text style={styles.methodButtonText}>Continue with Phone</Text>
                </TouchableOpacity>

                {/* Email Button */}
                <TouchableOpacity
                  style={styles.methodButton}
                  onPress={() => {
                    setStep('email_input')
                    setVerificationMethod('email')
                  }}
                  activeOpacity={0.7}>
                  <Text style={styles.methodButtonIcon}>@</Text>
                  <Text style={styles.methodButtonText}>Continue with Email</Text>
                </TouchableOpacity>

                {/* Google Button */}
                <TouchableOpacity style={styles.methodButton} onPress={handleGoogleAppleVerify} activeOpacity={0.7}>
                  <Text style={styles.methodButtonIcon}>G</Text>
                  <Text style={styles.methodButtonText}>Continue with Google</Text>
                </TouchableOpacity>

                {/* Apple Button */}
                <TouchableOpacity style={styles.methodButton} onPress={handleGoogleAppleVerify} activeOpacity={0.7}>
                  <Text style={styles.methodButtonIcon}>A</Text>
                  <Text style={styles.methodButtonText}>Continue with Apple</Text>
                </TouchableOpacity>
              </>
            )}

            {step === 'phone_input' && (
              <>
                <TextInput
                  style={[styles.textInput, {borderColor: getBorderColor(phoneValidation)}]}
                  value={phoneNumber}
                  onChangeText={handlePhoneChange}
                  placeholder="+1 (555) 123-4567"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="phone-pad"
                  autoFocus
                />

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setStep('initial')
                      setPhoneNumber('')
                      setPhoneValidation('idle')
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>BACK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      phoneValidation === 'valid' && styles.submitButtonActive,
                    ]}
                    onPress={handleContactSubmit}
                    disabled={phoneValidation !== 'valid'}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.submitButtonText,
                        phoneValidation === 'valid' && styles.submitButtonTextActive,
                      ]}>
                      SUBMIT
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 'email_input' && (
              <>
                <TextInput
                  style={[styles.textInput, {borderColor: getBorderColor(emailValidation)}]}
                  value={email}
                  onChangeText={handleEmailChange}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoFocus
                />

                <View style={styles.actionButtons}>
                  <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                      setStep('initial')
                      setEmail('')
                      setEmailValidation('idle')
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.backButtonText}>BACK</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.submitButton,
                      emailValidation === 'valid' && styles.submitButtonActive,
                    ]}
                    onPress={handleContactSubmit}
                    disabled={emailValidation !== 'valid'}
                    activeOpacity={0.7}>
                    <Text
                      style={[
                        styles.submitButtonText,
                        emailValidation === 'valid' && styles.submitButtonTextActive,
                      ]}>
                      SUBMIT
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {step === 'otp' && (
              <>
                <View style={styles.otpContainer}>
                  {otpDigits.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={el => { inputRefs.current[index] = el }}
                      style={styles.otpInput}
                      value={digit}
                      onChangeText={value => handleOtpChange(index, value)}
                      onKeyPress={e => handleOtpKeyPress(index, e)}
                      keyboardType="number-pad"
                      maxLength={1}
                      selectTextOnFocus
                    />
                  ))}
                </View>

                <TouchableOpacity
                  style={[styles.verifyButton, isOtpComplete && styles.verifyButtonActive]}
                  onPress={handleVerifySubmit}
                  disabled={!isOtpComplete}
                  activeOpacity={0.7}>
                  <Text style={[styles.verifyButtonText, isOtpComplete && styles.verifyButtonTextActive]}>
                    VERIFY
                  </Text>
                </TouchableOpacity>

                <View style={styles.resendContainer}>
                  <Text style={styles.resendLabel}>Not received verification? </Text>
                  <TouchableOpacity onPress={handleResendOtp} disabled={resendCountdown > 0}>
                    <Text style={[styles.resendButton, resendCountdown > 0 && styles.resendButtonDisabled]}>
                      {resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>

          {/* Privacy Note */}
          <Text style={styles.privacyNote}>Your contact is never shared</Text>
        </Animated.View>
      </ScrollView>
    </ScreenWrapper>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  container: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  matrixContainer: {
    width: 280,
    height: 280,
    marginBottom: 32,
    position: 'relative',
  },
  matrixSvg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  cornerNumber: {
    position: 'absolute',
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topLeft: {
    top: 2,
    left: 2,
  },
  topRight: {
    top: 2,
    right: 2,
  },
  bottomLeft: {
    bottom: 2,
    left: 2,
  },
  bottomRight: {
    bottom: 2,
    right: 2,
  },
  circleNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  squareNumber: {
    width: 36,
    height: 36,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerNumberText: {
    fontFamily: fonts.serif,
    fontSize: 18,
    fontWeight: '600',
  },
  overlayText: {
    position: 'absolute',
  },
  heading: {
    fontFamily: fonts.serif,
    fontSize: 24,
    fontWeight: '500',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subheading: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 342,
    gap: 12,
  },
  methodButton: {
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  methodButtonIcon: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.textPrimary,
  },
  methodButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
  },
  textInput: {
    height: 52,
    borderWidth: 2,
    borderRadius: 26,
    paddingHorizontal: 24,
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textPrimary,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    width: 80,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    color: colors.textSecondary,
  },
  submitButton: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  submitButtonActive: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    opacity: 1,
  },
  submitButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  submitButtonTextActive: {
    color: colors.textPrimary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    fontFamily: fonts.mono,
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  verifyButton: {
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.5,
  },
  verifyButtonActive: {
    borderColor: 'rgba(139, 92, 246, 0.5)',
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
    opacity: 1,
  },
  verifyButtonText: {
    fontFamily: fonts.mono,
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.4)',
  },
  verifyButtonTextActive: {
    color: colors.textPrimary,
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  resendLabel: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.textDim,
  },
  resendButton: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.accentViolet,
    textDecorationLine: 'underline',
  },
  resendButtonDisabled: {
    color: colors.textDim,
    textDecorationLine: 'none',
  },
  privacyNote: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.textDim,
    textAlign: 'center',
    marginTop: 24,
  },
})
