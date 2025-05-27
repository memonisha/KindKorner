import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  const { id, title, content } = await req.json();

  const { error } = await supabase
    .from('notes')
    .update({ title, content })
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Note updated' });
}
