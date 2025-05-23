'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    if (username && userId) {
      setUser({ username });
    } else {
      const timeout = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 40,
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        background: 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
      }}
    >
      {user ? (
        <>
          <h1 style={{ color: '#333', fontSize: 32 }}>
            Welcome, {user.username}! 🎉
          </h1>
          <div style={{ marginTop: 30 }}>
            <button
              style={buttonStyle}
              onClick={() => alert('📝 Create Notes feature coming soon!')}
            >
              ➕ Create Note
            </button>
            <button
              style={{ ...buttonStyle, background: '#FF6B6B' }}
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ color: 'red' }}>⚠️ You are not logged in.</h2>
          <p>
            Redirecting you to{' '}
            <a href="/login" style={{ color: '#0070f3' }}>
              Login
            </a>{' '}
            ...
          </p>
        </>
      )}
    </main>
  );
}

const buttonStyle = {
  padding: '12px 24px',
  marginRight: 10,
  borderRadius: 10,
  background: '#6BCB77',
  color: '#fff',
  fontSize: 16,
  cursor: 'pointer',
  border: 'none',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
};
