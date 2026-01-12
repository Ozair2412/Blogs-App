import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Get site settings
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();

    if (error) {
      // If no settings exist, return defaults
      return NextResponse.json({
        site_title: 'Namaz Blogs',
        phone_number: '',
        whatsapp_number: '',
        announcement: '',
        announcement_active: false,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// Update site settings
export async function PUT(request) {
  try {
    const body = await request.json();
    
    // Check if settings exist
    const { data: existing } = await supabase
      .from('site_settings')
      .select('id')
      .single();

    let result;
    if (existing) {
      // Update existing
      result = await supabase
        .from('site_settings')
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
    } else {
      // Insert new
      result = await supabase
        .from('site_settings')
        .insert([body])
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ error: result.error.message }, { status: 400 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
