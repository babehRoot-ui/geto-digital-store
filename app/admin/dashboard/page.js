'use client'

import { useState, useEffect } from 'react'
import { Package, FolderOpen, Receipt, TrendingUp } from 'lucide-react'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    transactions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        const [pRes, tRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/transactions'),
        ])
        const pData = await pRes.json()
        const tData = await tRes.json()

        const products = pData.data || []
        const transactions = tData.data || []
        const categories = new Set(products.map((p) => p.category))

        setStats({
          products: products.length,
          categories: categories.size,
          transactions: transactions.length,
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  const cards = [
    {
      label: 'Total Produk',
      value: stats.products,
      icon: Package,
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      label: 'Total Kategori',
      value: stats.categories,
      icon: FolderOpen,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
    {
      label: 'Total Transaksi',
      value: stats.transactions,
      icon: Receipt,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'Status Server',
      value: 'Online',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
    },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Ringkasan data Geto Digital Store
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={i}
              className="anim-fade-up bg-dark-800 border border-dark-600 rounded-2xl p-5 hover:border-dark-400 transition-colors"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${card.bg} ${card.color} flex items-center justify-center`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              {loading ? (
                <div className="h-8 w-16 bg-dark-600 rounded-lg animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-white">{card.value}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Info card */}
      <div className="mt-8 glass rounded-2xl p-6 anim-fade-up anim-d4">
        <h2 className="font-semibold text-white mb-2">Selamat Datang di Admin Panel</h2>
        <p className="text-sm text-gray-400 leading-relaxed">
          Gunakan menu di sidebar untuk mengelola produk dan transaksi. Semua perubahan
          yang Anda buat akan langsung tampil di halaman depan store. Pastikan database
          Supabase sudah dikonfigurasi dengan benar sebelum menambahkan data.
        </p>
      </div>
    </div>
  )
        }
