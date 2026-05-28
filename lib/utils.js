/**
 * Format angka ke Rupiah
 */
export function formatRupiah(num) {
  if (num == null) return 'Rp 0'
  return 'Rp ' + Number(num).toLocaleString('id-ID')
}

/**
 * Hitung waktu relatif dari timestamp
 */
export function timeAgo(dateStr) {
  const now = new Date()
  const then = new Date(dateStr)
  const diffMs = now - then
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return 'Baru saja'
  if (diffMin < 60) return `${diffMin} menit lalu`
  if (diffHr < 24) return `${diffHr} jam lalu`
  if (diffDay < 30) return `${diffDay} hari lalu`
  return new Date(dateStr).toLocaleDateString('id-ID')
}

/**
 * Warna badge berdasarkan tipe
 */
export function badgeColor(badge) {
  const map = {
    SALE: 'bg-red-500/90 text-white',
    HOT: 'bg-amber-500/90 text-black',
    LIMITED: 'bg-purple-500/90 text-white',
    SPECIAL: 'bg-gradient-to-r from-amber-400 to-yellow-300 text-black',
  }
  return map[badge] || ''
}
