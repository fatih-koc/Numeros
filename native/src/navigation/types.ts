import type {NativeStackScreenProps} from '@react-navigation/native-stack'

export type RootStackParamList = {
  Splash: undefined
  Idle: undefined
  Input: undefined
  Blueprint: undefined
  YourDayPreview: undefined
  SoftGate: undefined
  ProfileSetup: undefined
  Verification: undefined
  UniverseScan: undefined
  ResonanceResults: undefined
}

export type SplashScreenProps = NativeStackScreenProps<RootStackParamList, 'Splash'>
export type IdleScreenProps = NativeStackScreenProps<RootStackParamList, 'Idle'>
export type InputScreenProps = NativeStackScreenProps<RootStackParamList, 'Input'>
export type BlueprintScreenProps = NativeStackScreenProps<RootStackParamList, 'Blueprint'>

// For useNavigation hook type safety
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
