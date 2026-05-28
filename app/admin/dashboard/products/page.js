'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import { formatRupiah } from '@/lib/utils'

const CATEGORIES = ['Script & Bot MD', 'Open Tier Panel', 'Panel / Server']
const BADGES = ['None', 'SALE', 'HOT', 'LIMITED', 'SPECIAL']
const EMPTY_FORM = {
  name: '',
  price: '',
  category: CATEGORIES[0],
  badge: 'None',
  icon: '📦',
  is_special: false,
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [toast, setToast] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(data.data || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  function showToast(message, type = 'success') {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  function openAdd() {
    setEditingId(null)
    setForm({ ...EMPTY_FORM })
    setShowModal(true)
  }

  function openEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      price: String(product.price),
      category: product.category,
      badge: product.badge || 'None',
      icon: product.icon || '📦',
      is_special: product.is_special || false,
    })
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return

    setSubmitting(true)
    try {
      const payload = {
        name: form.name.trim(),
        price: Number(form.price),
        category: form.category,
        badge: form.badge === 'None' ? null : form.badge,
        icon: form.icon || '📦',
        is_special: form.is_special,
      }

      const url = editingId
        ? `/api/products/${editingId}`
        : '/api/products'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Gagal menyimpan')
      }

      showToast(editingId ? 'Produk berhasil diperbarui' : 'Produk berhasil ditambahkan')
      setShowModal(false)
      fetchProducts()
    } catch (err) {
      showToast(err.message, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Gagal menghapus')
      showToast('Produk berhasil dihapus')
      setDeleteConfirm(null)
      fetchProducts()
    } catch (err) {
      showToast(err.message, 'error')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Kelola Produk</h1>
          <p className="text-sm text-gray-500">Tambah, edit, dan hapus produk</p>
        </div>
        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Produk
        </button>
      </div>

      {/* Tabel Produk */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-dark-700 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-dark-800 rounded-2xl border border-dark-600">
          <p className="text-gray-500">Belum ada produk. Klik &quot;Tambah Produk&quot; untuk memulai.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 px-4 py-3.5 rounded-xl bg-dark-800 border border-dark-600 hover:border-dark-400 transition-colors group"
            >
              <span className="text-2xl flex-shrink-0">{p.icon || '📦'}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-white truncate">
                    {p.name}
                  </p>
                  {p.badge && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-accent/15 text-accent">
                      {p.badge}
                    </span>
                  )}
                  {p.is_special && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-amber-500/15 text-amber-400">
                      SPECIAL
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  {p.category} &middot; {formatRupiah(p.price)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(p)}
                  className="p-2 rounded-lg text-gray-400 hover:text-accent hover:bg-accent/10 transition-all"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                {deleteConfirm === p.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDelete(p.id)}
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
                    onClick={() => setDeleteConfirm(p.id)}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== Modal Tambah/Edit ===== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setShowModal(false)}
          />
          <div className="relative w-full max-w-md bg-dark-800 border border-dark-600 rounded-2xl p-6 anim-fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-white">
                {editingId ? 'Edit Produk' : 'Tambah Produk Baru'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Nama Produk *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Geto-MD Multi Device"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-700 border border-dark-500 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>

              {/* Harga */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Harga (Rp) *
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="50000"
                  required
                  min="0"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-700 border border-dark-500 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Kategori
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-700 border border-dark-500 text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Badge
                </label>
                <select
                  value={form.badge}
                  onChange={(e) => setForm({ ...form, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-700 border border-dark-500 text-white text-sm focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                >
                  {BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b === 'None' ? 'Tanpa Badge' : b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ikon */}
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">
                  Ikon (Emoji)
                </label>
                <input
                  type="text"
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  placeholder="📦"
                  maxLength="4"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-dark-700 border border-dark-500 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20 transition-all"
                />
              </div>

              {/* Is Special */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={form.is_special}
                    onChange={(e) =>
                      setForm({ ...form, is_special: e.target.checked })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-10 h-5.5 rounded-full bg-dark-500 peer-checked:bg-amber-500/60 transition-colors" />
                  <div className="absolute left-0.5 top-0.5 w-4.5 h-4.5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-[18px]" />
                </div>
                <span className="text-sm text-gray-300 group-hover:text-white transition-colors">
                  Tandai sebagai produk SPECIAL
                </span>
              </label>

              {/* Tombol */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-dark-600 text-gray-300 hover:text-white hover:bg-dark-500 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-accent text-white hover:bg-accent-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingId ? 'Simpan' : 'Tambah'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== Toast ===== */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-xl toast-enter ${
            toast.type === 'error'
              ? 'bg-red-500/90 text-white'
              : 'bg-emerald-500/90 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
                    }
