import { NextResponse } from 'next/server'

// Kredensial admin (hardcoded, aman karena berjalan di server)
const ADMIN_USERNAME = 'adminbabeh'
const ADMIN_PASSWORD = '426fa66366d8b6c9A1!b8973f10'

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi' },
        { status: 400 }
      )
    }

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Username atau password salah' },
        { status: 401 }
      )
    }

    return NextResponse.json({ success: true, message: 'Login berhasil' })
  } catch {
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server' },
      { status: 500 }
    )
  }
}
