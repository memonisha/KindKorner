'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditNotePage() {
  const { id } = useParams();         // ‹— this comes from the folder name [id]
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1) Fetch the note by id on mount
  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('notes')
        .select('title, content')
        .eq('id', id)
        .single();

      if (error) {
        setError(error.message);
      } else if (data) {
        setTitle(data.title);
        setContent(data.content);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  // 2) Handle the form submit to update
  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = await supabase
      .from('notes')
      .update({ title, content })
      .eq('id', id);

    if (error) {
      setError(error.message);
    } else {
      router.push('/dashboard');
    }
  }

  if (loading) {
    return (
      <main style={{ padding: 40, fontFamily: "'Comic Sans MS', cursive" }}>
        <p>Loading note…</p>
      </main>
    );
  }

  return (
    <main
      style={{
        padding: 40,
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        background: 'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
        minHeight: '100vh',
      }}
    >
      <h1 style={{ fontSize: 32, color: '#333' }}>✏️ Edit Your KindNote</h1>
      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      <form
        onSubmit={handleUpdate}
        style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}
      >
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ccc',
          }}
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Your note…"
          required
          rows={6}
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 8,
            border: '1px solid #ccc',
            resize: 'vertical',
          }}
        />
        <button
          type="submit"
          style={{
            padding: '12px 24px',
            fontSize: 16,
            borderRadius: 20,
            border: 'none',
            background: 'linear-gradient(45deg, #f093fb, #f5576c)',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          💾 Save Changes
        </button>
      </form>
    </main>
  );
}
