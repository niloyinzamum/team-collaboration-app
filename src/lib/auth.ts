const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export async function getCurrentUser() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/me`);
    if (!response.ok) return null;
    return response.json();
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}