import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get single dua
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('duas')
      .select('*, category:categories(id, name)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching dua:', error);
    return NextResponse.json({ error: 'Failed to fetch dua' }, { status: 500 });
  }
}

// Update dua
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('duas')
      .update({
        title: body.title,
        slug: body.slug,
        arabic_text: body.arabic_text,
        transliteration: body.transliteration,
        translation: body.translation,
        reference: body.reference,
        image_url: body.image_url,
        category_id: body.category_id || null,
        is_published: body.is_published,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, category:categories(id, name)')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating dua:', error);
    return NextResponse.json({ error: 'Failed to update dua' }, { status: 500 });
  }
}

// Delete dua
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('duas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting dua:', error);
    return NextResponse.json({ error: 'Failed to delete dua' }, { status: 500 });
  }
}
