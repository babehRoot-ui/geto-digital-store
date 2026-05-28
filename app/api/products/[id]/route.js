import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function PUT(request, { params }) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase belum dikonfigurasi' },
      { status: 503 }
    )
  }

  try {
    const { id } = params
    const body = await request.json()
    const { name, price, category, badge, icon, is_special } = body

    const { data, error } = await supabase
      .from('products')
      .update({
        name,
        price: Number(price),
        category,
        badge: badge || null,
        icon: icon || '📦',
        is_special: Boolean(is_special),
      })
      .eq('id', id)
      .select()

    if (error) throw error

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json({ data, message: 'Produk berhasil diperbarui' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase belum dikonfigurasi' },
      { status: 503 }
    )
  }

  try {
    const { id } = params

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Produk berhasil dihapus' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
