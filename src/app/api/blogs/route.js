import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get all blogs
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const isAdmin = searchParams.get('admin') === 'true';

    let query = supabase
      .from('blogs')
      .select('*, category:categories(id, name)')
      .order('created_at', { ascending: false });

    if (!isAdmin) {
      query = query.eq('is_published', true);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json({ error: 'Failed to fetch blogs' }, { status: 500 });
  }
}

// Create a new blog
export async function POST(request) {
  try {
    const body = await request.json();
    
    const { data, error } = await supabase
      .from('blogs')
      .insert([{
        title: body.title,
        slug: body.slug,
        content: body.content,
        excerpt: body.excerpt,
        image_url: body.image_url,
        category_id: body.category_id || null,
        is_published: body.is_published || false,
      }])
      .select('*, category:categories(id, name)')
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json({ error: 'Failed to create blog' }, { status: 500 });
  }
}
