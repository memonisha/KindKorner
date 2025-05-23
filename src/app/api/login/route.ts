import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  const { username, password } = await req.json();

  // Fetch user by username
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Check password (Note: Plain text comparison - improve this later)
  if (user.password_hash !== password) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  }

  // Success: Return user info (no session management here)
  return NextResponse.json({
    message: 'Login successful',
    user: {
      id: user.id,
      username: user.username,
    },
  });
}
