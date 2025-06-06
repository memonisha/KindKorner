import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request) {
  const { id } = await req.json();

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: 'Deleted' });
}

