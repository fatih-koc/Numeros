import type {NativeStackScreenProps} from '@react-navigation/native-stack'

export interface MatchParams {
  name: string
  age: number
  photoUrl: string
  matchPercentage: number
}

export type TabId = 'your_day' | 'discover' | 'messages' | 'profile'

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
  HumanReveal: {match: MatchParams}
  Main: {initialTab?: TabId}
  FullProfile: {profileId: string}
  MaybeLaterQueue: undefined
  ResonateAction: {targetId: string; targetName: string}
  MutualResonance: {matchId: string; matchName: string; matchPercentage: number}
  Conversation: {conversationId: string; name: string; imageUrl: string}
  ProfileEditor: undefined
  Settings: undefined
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
