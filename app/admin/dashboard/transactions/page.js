'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Send } from 'lucide-react'
import { timeAgo } from '@/lib/utils'

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch('/api/transactions')
      const data = await res.json()
      setTransactions(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim() }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal menambah transaksi')
      }

      showToast('Transaksi berhasil ditambahkan')
      setMessage('')
      fetchTransactions()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus')
      showToast('Transaksi berhasil dihapus')
      setDeleteConfirm(null)
      fetchTransactions()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-1">Kelola Transaksi</h1>
        <p className="text-sm text-gray-500">
          Tambah dan kelola riwayat transaksi yang ditampilkan di halaman depan
        </p>
      </div>

      {/* Form Tambah */}
      <form
        onSubmit={handleAdd}
        className="bg-dark-800 border border-dark-600 rounded-2xl p-5 mb-6"
      >
        <label className="block text-xs font-medium text-gray-400 mb-2">
          Pesan Transaksi Baru
        </label>
        <div className="flex gap-3">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder='Contoh: User_089 membeli Geto-MD Multi Device'
            required
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-dark-700 border border-dark-500 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4" />
                Tambah
              </>
            )}
          </button>
        </div>
      </form>

      {/* Daftar Transaksi */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 rounded-xl bg-dark-700 animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-16 bg-dark-800 rounded-2xl border border-dark-600">
          <p className="text-gray-500">
            Belum ada transaksi. Gunakan form di atas untuk menambahkan.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => (
            <div
              key={tx.id}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-dark-800 border border-dark-600 hover:border-dark-400 transition-colors group"
            >
              <div className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
              <p className="text-sm text-gray-300 flex-1 truncate">{tx.message}</p>
              <span className="text-[11px] text-gray-600 whitespace-nowrap">
                {timeAgo(tx.created_at)}
              </span>
              {deleteConfirm === tx.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(tx.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    Hapus
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-dark-600 text-gray-400 hover:text-white transition-colors"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(tx.id)}
                  className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl toast-enter ${
            toast.type === 'error'
              ? 'bg-red-500/90 text-white'
              : 'bg-emerald-500/90 text-white'
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
          }
