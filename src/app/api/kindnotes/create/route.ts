// src/app/api/kindnotes/create/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(req: Request) {
  // 1. Read title, content, AND user_id from body:
  const { title, content, user_id } = await req.json();

  // 2. Insert into Supabase:
  const { data, error } = await supabase
    .from('notes')
    .insert([{ user_id, title, content }])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}
