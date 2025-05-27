'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { clearUserSession } from '@/lib/auth';

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

const GRADIENTS = [
  'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
  'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #fbc2eb 0%, #a18cd1 100%)',
  'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 100%)',
];

export default function DashboardPage() {
  const [notes, setNotes] = useState<Note[] | null>(null);
  const [userTz, setUserTz] = useState<string>('');
  const router = useRouter();

  // Load notes, detect timezone, check auth
  useEffect(() => {
    // Redirect if not logged in
    const userId = localStorage.getItem('userId');
    if (!userId) {
      router.push('/login');
      return;
    }

    // Fetch notes
    fetch(`/api/kindnotes/index?user_id=${userId}`)
      .then((res) => res.json())
      .then((json) => setNotes(json.notes))
      .catch(() => setNotes([]));

    // Detect user's timezone
    setUserTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, [router]);

  // Logout handler
  function handleLogout() {
    clearUserSession();
    router.push('/login');
  }

  // Delete handler
  function handleDelete(id: string) {
    if (!confirm('🗑️ Delete this note?')) return;
    fetch('/api/kindnotes/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
    }).then(() => setNotes(notes?.filter((n) => n.id !== id) || []));
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        padding: 40,
        fontFamily: "'Comic Sans MS', cursive, sans-serif",
        background: 'radial-gradient(circle at top left, #ffecd2 0%, #fcb69f 100%)',
      }}
    >
      {/* Top controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 36, margin: 0 }}>📒 Your KindNotes</h1>
          {userTz && (
            <p style={{ fontSize: 14, color: '#555', margin: '4px 0 0' }}>
              (Your time zone: {userTz})
            </p>
          )}
        </div>
        <div>
          <button
            onClick={() => router.push('/create')}
            style={{
              marginRight: 12,
              padding: '10px 20px',
              background: 'linear-gradient(45deg, #6BCB77, #47A992)',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            ➕ Create Note
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#FF6B6B',
              color: '#fff',
              border: 'none',
              borderRadius: 20,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.3s',
            }}
            onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* Loading & empty states */}
      {notes === null && <p style={{ fontSize: 18 }}>Loading…</p>}
      {notes !== null && notes.length === 0 && (
        <p style={{ fontSize: 18, color: '#555', marginTop: 20 }}>
          You haven’t created any KindNotes yet!
          <button
            onClick={() => router.push('/create')}
            style={{
              marginLeft: 10,
              padding: '8px 16px',
              background: '#6BCB77',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            ➕ Create One
          </button>
        </p>
      )}

      {/* Notes grid */}
      {notes && notes.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 20,
            marginTop: 20,
          }}
        >
          {notes.map((note) => {
            // pick a random gradient for each render
            const bg = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

            // format timestamp in user's locale & timezone
            const when = new Date(note.created_at).toLocaleString(undefined, {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              timeZoneName: 'short',
            });

            return (

             <div
  key={note.id}
  className="floating-note"
  style={{
    background: bg,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
    color: '#fff',
    position: 'relative',
    animation: 'float 10s ease-in-out infinite',
    transition: 'transform 0.3s',
    cursor: 'pointer',
  }}
>
  <h2 style={{ margin: 0, fontSize: 24 }}>{note.title}</h2>
  <p style={{ margin: '10px 0', fontSize: 16 }}>{note.content}</p>
  <small style={{ fontSize: 12, opacity: 0.8 }}>{when}</small>

  <div
    style={{
      position: 'absolute',
      top: 12,
      right: 12,
      display: 'flex',
      gap: 8,
    }}
  >
    <button
      onClick={() => router.push(`/edit/${note.id}`)}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#fff',
        fontSize: 18,
        cursor: 'pointer',
      }}
      title="Edit"
    >
      ✏️
    </button>
    <button
      onClick={() => handleDelete(note.id)}
      style={{
        background: 'transparent',
        border: 'none',
        color: '#ff6b6b',
        fontSize: 18,
        cursor: 'pointer',
      }}
      title="Delete"
    >
      🗑️
    </button>
  </div>
</div>

            
          );
          })}
        </div>
      )}
    </main>
  );
}
