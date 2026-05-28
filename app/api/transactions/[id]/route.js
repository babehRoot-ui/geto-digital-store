import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function DELETE(request, { params }) {
  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase belum dikonfigurasi' },
      { status: 503 }
    )
  }

  try {
    const { id } = params

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
