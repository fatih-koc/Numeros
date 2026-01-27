/**
 * API client for Numeros backend
 * Base URL: NEXT_PUBLIC_API_URL (default: http://localhost:8000)
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// ============================================================================
// Types
// ============================================================================

export interface CalculateRequest {
  name: string;
  birth_date: string; // YYYY-MM-DD
  birth_time?: string; // HH:MM (optional)
  latitude?: number; // From city lookup (optional)
  longitude?: number; // From city lookup (optional)
}

export interface NumerologyResponse {
  life_path: number;
  soul_urge: number;
  expression: number;
  personality: number;
  master_numbers: number[];
}

export interface PlanetPosition {
  sign: string;
  degree: number;
  longitude?: number;
}

export interface AstrologyResponse {
  sun: PlanetPosition;
  moon: PlanetPosition;
  mercury?: PlanetPosition;
  venus?: PlanetPosition;
  mars?: PlanetPosition;
  jupiter?: PlanetPosition;
  saturn?: PlanetPosition;
  ascendant?: PlanetPosition;
  midheaven?: PlanetPosition;
}

export interface CalculateResponse {
  chart_level: 1 | 2 | 3 | 4;
  numerology: NumerologyResponse;
  astrology: AstrologyResponse;
}

export interface MarketingCaptureRequest {
  email: string;
  name: string;
  birth_date: string; // YYYY-MM-DD
  numerology?: {
    life_path: number;
    soul_urge: number;
    expression: number;
    personality: number;
  };
  source: 'calculator' | 'waitlist' | 'download';
}

export interface MarketingCaptureResponse {
  success: boolean;
  message: string;
  lead_id?: number;
}

export interface UnsubscribeRequest {
  email: string;
  token?: string; // Optional verification token
}

export interface UnsubscribeResponse {
  success: boolean;
  message: string;
}

export class APIError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'APIError';
  }
}

// ============================================================================
// Profile API
// ============================================================================

/**
 * Calculate numerology and astrology from birth data
 * Endpoint: POST /api/v1/profile/calculate/
 */
export async function calculateProfile(data: CalculateRequest): Promise<CalculateResponse> {
  const response = await fetch(`${API_URL}/api/v1/profile/calculate/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new APIError(
      `Failed to calculate profile: ${errorText}`,
      response.status
    );
  }

  return response.json();
}

// ============================================================================
// Marketing API
// ============================================================================

/**
 * Capture email lead for marketing
 * Endpoint: POST /api/v1/marketing/capture/
 *
 * This stores the lead in the database and triggers an email with
 * the numerology results via Amazon SES.
 */
export async function captureEmail(data: MarketingCaptureRequest): Promise<MarketingCaptureResponse> {
  const response = await fetch(`${API_URL}/api/v1/marketing/capture/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    // Don't throw on marketing capture failure - it's not critical
    // Log the error but allow the user to continue
    console.error('[Marketing Capture] Failed:', response.status);
    return {
      success: false,
      message: 'Email capture failed, but your results are ready.',
    };
  }

  return response.json();
}

/**
 * Unsubscribe email from marketing
 * Endpoint: POST /api/v1/marketing/unsubscribe/
 */
export async function unsubscribeEmail(data: UnsubscribeRequest): Promise<UnsubscribeResponse> {
  const response = await fetch(`${API_URL}/api/v1/marketing/unsubscribe/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new APIError(
      `Failed to unsubscribe: ${errorText}`,
      response.status
    );
  }

  return response.json();
}

// ============================================================================
// Health Check
// ============================================================================

/**
 * Check if API is available
 */
export async function checkAPIHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/api/v1/`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
