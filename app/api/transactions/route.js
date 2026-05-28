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
      .from('transactions')
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
    const { message } = await request.json()

    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Pesan transaksi wajib diisi' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ message: message.trim() }])
      .select()

    if (error) throw error

    return NextResponse.json({
      data,
      message: 'Transaksi berhasil ditambahkan',
    })
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
    // Untuk delete by ID dari route /api/transactions/[id]
    // Tapi karena kita pakai route.js (bukan [id]/route.js), 
    // kita ambil ID dari query param
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID transaksi diperlukan' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ message: 'Transaksi berhasil dihapus' })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
