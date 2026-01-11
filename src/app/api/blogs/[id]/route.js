import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get single blog
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    
    const { data, error } = await supabase
      .from('blogs')
      .select('*, category:categories(id, name)')
      .eq('id', id)
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json({ error: 'Failed to fetch blog' }, { status: 500 });
  }
}

// Update blog
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('blogs')
      .update({
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
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
    console.error('Error updating blog:', error);
    return NextResponse.json({ error: 'Failed to update blog' }, { status: 500 });
  }
}

// Delete blog
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const { error } = await supabase
      .from('blogs')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json({ error: 'Failed to delete blog' }, { status: 500 });
  }
}
