// src/app/api/kindnotes/index/route.ts
import { supabase } from '@/lib/supabaseClient';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user_id = searchParams.get('user_id');

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ notes: data });
}
