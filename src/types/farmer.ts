export type LanguageCode = 'en' | 'kn' | 'hi';

export interface FarmerProfile {
  name: string;
  phone: string;
  place: string;
  locality: string;
  language: LanguageCode;
  loggedInAt: string;
}

const STORAGE_KEY = 'mandimitra_farmer_profile_v1';

export function loadFarmerProfile(): FarmerProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FarmerProfile;
    if (!parsed.name || !parsed.phone) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveFarmerProfile(profile: FarmerProfile): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage errors in restricted iframes
  }
}

export function clearFarmerProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}
