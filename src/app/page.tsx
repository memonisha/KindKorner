'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  bgGradient: string;
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

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    fetch(`/api/kindnotes/index?user_id=${storedUserId || 'public'}`)
      .then((res) => res.json())
      .then((json) => {
        const notesWithGradient = json.notes.map((note: Note) => ({
          ...note,
          bgGradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
        }));
        setNotes(notesWithGradient);
      })
      .catch(() => setNotes([]));

    setUserTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
  }, []);

  const FormattedDate = ({ isoDate }: { isoDate: string }) => {
    const [formatted, setFormatted] = useState('');
    useEffect(() => {
      const d = new Date(isoDate);
      setFormatted(
        d.toLocaleString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          timeZoneName: 'short',
        }),
      );
    }, [isoDate]);

    return <small style={{ fontSize: 12, opacity: 0.8 }}>{formatted}</small>;
  };

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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div>
          <h1 style={{
            fontSize: 28,
            marginBottom: 30,
            textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
            animation: 'bounce 2s infinite',
            userSelect: 'none',
          }}>
            📒 Welcome to the KindKorner...❤️ <br />
            Here, every note sparks kindness✨ and brightens someone’s day🌈
          </h1>
          {userTz && (
            <p style={{ fontSize: 14, color: '#555', margin: '4px 0 0' }}>
              (Your time zone: {userTz})
            </p>
          )}
        </div>
        <button
          onClick={() => router.push('/signup')}
          style={{
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
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          aria-label="Go to Signup page"
        >
          ➕ Create Account
        </button>
      </div>

      {/* Loading & empty states */}
      {notes === null && <p style={{ fontSize: 18 }}>Loading…</p>}
      {notes !== null && notes.length === 0 && (
        <p style={{ fontSize: 18, color: '#555', marginTop: 20 }}>
          No KindNotes available yet.
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
          {notes.map((note) => (
            <div
              key={note.id}
              className="floating-note"
              style={{
                background: note.bgGradient,
                borderRadius: 16,
                padding: 20,
                boxShadow: '0 6px 12px rgba(0,0,0,0.1)',
                color: '#fff',
                position: 'relative',
                animation: 'float 10s ease-in-out infinite',
                transition: 'transform 0.3s',
                cursor: 'default',
              }}
            >
              <h2 style={{ margin: 0, fontSize: 24 }}>{note.title}</h2>
              <p style={{ margin: '10px 0', fontSize: 16 }}>{note.content}</p>
              <FormattedDate isoDate={note.created_at} />
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
        `}
      </style>
    </main>
  );
}
