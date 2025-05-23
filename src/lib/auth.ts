// Get user from localStorage (client-side only)
export function getUserFromSession() {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Clear user session from localStorage
export function clearUserSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user');
  }
}


export function setUserSession(user: { id: string; username: string }) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', user.username);
  }
}