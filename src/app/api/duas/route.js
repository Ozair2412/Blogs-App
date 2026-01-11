import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all duas
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('duas')
      .select('*, category:categories(id, name)')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching duas:', error);
    return NextResponse.json({ error: 'Failed to fetch duas' }, { status: 500 });
  }
}

// Create a new dua
export async function POST(request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('duas')
      .insert([{
        title: body.title,
        slug: body.slug,
        arabic_text: body.arabic_text,
        transliteration: body.transliteration,
        translation: body.translation,
        reference: body.reference,
        image_url: body.image_url,
        category_id: body.category_id || null,
        is_published: body.is_published || false,
      }])
      .select('*, category:categories(id, name)')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating dua:', error);
    return NextResponse.json({ error: 'Failed to create dua' }, { status: 500 });
  }
}
