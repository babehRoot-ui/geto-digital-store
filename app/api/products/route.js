import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase belum dikonfigurasi', data: [] },
      { status: 503 }
    )
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ data })
  } catch (err) {
    return NextResponse.json(
      { error: err.message, data: [] },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase belum dikonfigurasi' },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()
    const { name, price, category, badge, icon, is_special } = body

    if (!name || price == null || !category) {
      return NextResponse.json(
        { error: 'Field name, price, dan category wajib diisi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          price: Number(price),
          category,
          badge: badge || null,
          icon: icon || '📦',
          is_special: Boolean(is_special),
        },
      ])
      .select()

    if (error) throw error

    return NextResponse.json({ data, message: 'Produk berhasil ditambahkan' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
