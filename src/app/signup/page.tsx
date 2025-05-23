'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { setUserSession } from '@/lib/auth';

export default function SignupPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: existingUser, error: fetchError } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .single();

    if (existingUser) {
      setError('🚫 Username already taken. Try something fun!');
      setLoading(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('users')
      .insert([{ username, password_hash: password }])
      .select()
      .single();

    if (insertError || !data) {
      setError('⚠️ Signup failed. Try again later.');
      setLoading(false);
      return;
    }

    setUserSession({ id: data.id, username: data.username });
    router.push('/dashboard');
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        background: 'linear-gradient(135deg, #FFC3A0 0%, #FFAFBD 100%)',
      }}
    >
      <h1 style={{ color: '#5D3FD3', fontSize: 36, marginBottom: 15 }}>
        ✨ Join the KindKorner Club!
      </h1>
      <form
        onSubmit={handleSignup}
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          padding: 30,
          borderRadius: 20,
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        }}
      >
        <label style={{ marginBottom: 10, color: '#333' }}>
          Username 🧑‍🚀
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 15px',
              marginTop: 5,
              borderRadius: 10,
              border: '1px solid #ccc',
              fontSize: 16,
              fontFamily: "'Comic Sans MS', cursive",
            }}
          />
        </label>

        <label style={{ marginBottom: 10, color: '#333' }}>
          Password 🔒
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px 15px',
              marginTop: 5,
              borderRadius: 10,
              border: '1px solid #ccc',
              fontSize: 16,
              fontFamily: "'Comic Sans MS', cursive",
            }}
          />
        </label>

        {error && (
          <p style={{ color: 'red', marginBottom: 10 }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 28px',
            background: 'linear-gradient(to right, #FDCB82, #FF7EB3)',
            border: 'none',
            borderRadius: 25,
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: 16,
            color: '#fff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          {loading ? 'Signing You Up...' : 'Sign Up 🎉'}
        </button>
      </form>
      <p style={{ marginTop: 15, color: '#555' }}>
        Already a member?{' '}
        <a href="/login" style={{ color: '#5D3FD3', textDecoration: 'underline' }}>
          Log In Here
        </a>
      </p>
    </main>
  );
}
