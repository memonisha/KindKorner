'use client';

import React, { useState } from 'react';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      window.location.href = '/dashboard';
    } else {
      const err = await res.json();
      setError(err.error || 'Login failed');
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        background: 'radial-gradient(circle at top left, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)',
        padding: 20,
        color: '#3f3f3f',
      }}
    >
      <h1
        style={{
          fontSize: 48,
          marginBottom: 30,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          animation: 'bounce 2s infinite',
          userSelect: 'none',
        }}
        aria-label="Login Emoji"
        role="img"
      >
        🔐 Login Time! 🔑
      </h1>

      <form
        onSubmit={handleLogin}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: 350,
          background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
          padding: 30,
          borderRadius: 25,
          boxShadow: '0 10px 20px rgba(253, 160, 133, 0.4)',
          transition: 'transform 0.3s ease',
        }}
      >
        <input
          type="text"
          placeholder="👤 Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            fontSize: 18,
            padding: 14,
            marginBottom: 20,
            borderRadius: 20,
            border: '2px solid #fff',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.7)',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#ff6f61')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#fff')}
          autoComplete="username"
        />
        <input
          type="password"
          placeholder="🔒 Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            fontSize: 18,
            padding: 14,
            marginBottom: 25,
            borderRadius: 20,
            border: '2px solid #fff',
            boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.7)',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#ff6f61')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#fff')}
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            fontSize: 22,
            fontWeight: 'bold',
            padding: '15px 0',
            borderRadius: 25,
            border: 'none',
            background:
              'linear-gradient(45deg, #ff758c, #ff7eb3, #ff758c)',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 6px 12px rgba(255,117,140,0.6)',
            transition: 'background 0.4s ease, box-shadow 0.4s ease',
            userSelect: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(45deg, #ff7eb3, #ff758c, #ff7eb3)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(255,125,150,0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background =
              'linear-gradient(45deg, #ff758c, #ff7eb3, #ff758c)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(255,117,140,0.6)';
          }}
        >
          {loading ? '⌛ Logging in...' : '🚀 Let me in!'}
        </button>

        {error && (
          <p
            role="alert"
            style={{
              marginTop: 20,
              color: '#e63946',
              fontWeight: 'bold',
              fontSize: 16,
              userSelect: 'none',
            }}
          >
            ❌ {error}
          </p>
        )}
      </form>

      {/* Add bounce keyframes */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        `}
      </style>
    </main>
  );
}
