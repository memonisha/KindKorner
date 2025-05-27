'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const user_id = localStorage.getItem('userId');
    if (!user_id) {
      setError('❌ Please log in to create a note.');
      return;
    }

    const res = await fetch('/api/kindnotes/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, user_id }),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(`❌ ${json.error}`);
      return;
    }

    router.push('/dashboard');
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 40,
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        background: 'radial-gradient(circle at bottom right, #FDEB71 0%, #F8D800 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1
        style={{
          fontSize: 48,
          marginBottom: 30,
          color: '#333',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
          animation: 'bounce 2s infinite',
        }}
      >
        ➕ Create a KindNote ✨
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          width: 350,
          background: '#fff',
          padding: 30,
          borderRadius: 20,
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{
            padding: 14,
            fontSize: 18,
            borderRadius: 20,
            border: '2px solid #e0e0e0',
            outline: 'none',
            transition: 'border-color 0.3s',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#FFD54F')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your kindness note…"
          required
          rows={4}
          style={{
            padding: 14,
            fontSize: 18,
            borderRadius: 20,
            border: '2px solid #e0e0e0',
            outline: 'none',
            transition: 'border-color 0.3s',
            resize: 'vertical',
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = '#FFD54F')}
          onBlur={(e) => (e.currentTarget.style.borderColor = '#e0e0e0')}
        />

        <button
          type="submit"
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            padding: '15px 0',
            borderRadius: 25,
            border: 'none',
            background: 'linear-gradient(45deg, #42a5f5, #478ed1)',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 6px 12px rgba(66,165,245,0.6)',
            transition: 'transform 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          💾 Save Note
        </button>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      </form>

      {/* bounce keyframes */}
      <style>{`
        @keyframes bounce {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </main>
  );
}
