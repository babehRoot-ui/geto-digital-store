'use client'

import { useState, useEffect } from 'react'
import { Zap, Shield, Truck, Package, Clock, ArrowRight } from 'lucide-react'
import { formatRupiah, timeAgo, badgeColor } from '@/lib/utils'

const CATEGORIES = ['Semua', 'Script & Bot MD', 'Open Tier Panel', 'Panel / Server']

export default function Home() {
  const [products, setProducts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [activeCategory, setActiveCategory] = useState('Semua')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const [pRes, tRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/transactions'),
      ])
      if (!pRes.ok || !tRes.ok) throw new Error('Gagal mengambil data')
      const pData = await pRes.json()
      const tData = await tRes.json()
      setProducts(pData.data || [])
      setTransactions(tData.data || [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered =
    activeCategory === 'Semua'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* ===== Background Orbs ===== */}
      <div
        className="bg-orb w-[500px] h-[500px] bg-accent/10 top-[-120px] left-[-120px]"
        style={{ animation: 'orbFloat1 12s ease-in-out infinite' }}
      />
      <div
        className="bg-orb w-[400px] h-[400px] bg-accent-dark/10 bottom-[-80px] right-[-80px]"
        style={{ animation: 'orbFloat2 15s ease-in-out infinite' }}
      />
      <div
        className="bg-orb w-[250px] h-[250px] bg-purple-600/5 top-[50%] left-[50%]"
        style={{ animation: 'orbFloat1 18s ease-in-out infinite reverse' }}
      />

      {/* ===== Navbar ===== */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-accent" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">
              Geto<span className="text-accent">Store</span>
            </span>
          </div>
          <a
            href="/admin/login"
            className="text-xs text-gray-500 hover:text-accent transition-colors"
          >
            Admin
          </a>
        </div>
      </nav>

      {/* ===== Hero Section ===== */}
      <header className="relative z-10 pt-32 pb-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="anim-fade-up">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-accent/10 text-accent border border-accent/20 mb-6">
              Premium Digital Solution
            </span>
          </div>

          <h1 className="anim-fade-up anim-d1 text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-6">
            Geto Digital
            <br />
            <span className="text-gradient">Store</span>
          </h1>

          <p className="anim-fade-up anim-d2 text-base sm:text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Platform penyedia script bot WhatsApp terbaik, panel reseller eksklusif,
            dan berbagai kebutuhan digital premium dengan pengiriman otomatis secepat kilat.
          </p>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              {
                icon: <Zap className="w-5 h-5" />,
                title: 'Pengiriman Instan',
                desc: 'Dikirim otomatis dalam hitungan detik',
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: 'Garansi Aktif',
                desc: 'Garansi penggantian jika ada kendala',
              },
              {
                icon: <Truck className="w-5 h-5" />,
                title: 'Support 24/7',
                desc: 'Tim support siap membantu kapan saja',
              },
            ].map((feat, i) => (
              <div
                key={i}
                className={`anim-fade-up anim-d${i + 3} glass rounded-2xl p-5 text-center group hover:border-accent/30 transition-colors`}
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center mx-auto mb-3 group-hover:bg-accent/20 transition-colors">
                  {feat.icon}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{feat.title}</h3>
                <p className="text-xs text-gray-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ===== Products Section ===== */}
      <section className="relative z-10 px-4 sm:px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-1">
                Produk Kami
              </h2>
              <p className="text-sm text-gray-500">
                Pilih produk digital terbaik sesuai kebutuhanmu
              </p>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-1 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-accent text-white shadow-lg shadow-accent/20'
                    : 'bg-dark-700 text-gray-400 hover:text-white hover:bg-dark-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-52 rounded-2xl bg-dark-700 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-400 text-sm">{error}</p>
              <p className="text-gray-600 text-xs mt-1">
                Pastikan Supabase sudah dikonfigurasi dengan benar
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-dark-700 flex items-center justify-center mx-auto mb-4">
                <Package className="w-7 h-7 text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium mb-1">Belum ada produk</p>
              <p className="text-gray-600 text-sm">
                {activeCategory !== 'Semua'
                  ? `Kategori "${activeCategory}" masih kosong`
                  : 'Admin belum menambahkan produk apapun'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((product, idx) => (
                <ProductCard key={product.id} product={product} index={idx} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Transaction History ===== */}
      <section className="relative z-10 px-4 sm:px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Riwayat Transaksi</h2>
              <p className="text-xs text-gray-500">Transaksi terbaru dari pelanggan</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 rounded-xl bg-dark-700 animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 glass rounded-2xl">
              <Clock className="w-8 h-8 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">Belum ada riwayat transaksi</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {transactions.slice(0, 10).map((tx, i) => (
                <div
                  key={tx.id}
                  className={`anim-slide-left flex items-center gap-3 px-4 py-3.5 rounded-xl bg-dark-800 border border-dark-600 hover:border-accent/20 transition-colors`}
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className="w-2 h-2 rounded-full bg-green-400 pulse-dot flex-shrink-0" />
                  <p className="text-sm text-gray-300 flex-1 truncate">{tx.message}</p>
                  <span className="text-[11px] text-gray-600 whitespace-nowrap ml-2">
                    {timeAgo(tx.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===== Footer ===== */}
      <footer className="relative z-10 border-t border-dark-700 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-gray-400">
              Geto<span className="text-accent">Store</span>
            </span>
          </div>
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} Geto Digital Store. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}

/* ===== Komponen Kartu Produk ===== */
function ProductCard({ product, index }) {
  const isSpecial = product.is_special
  const badgeClass = badgeColor(product.badge)

  return (
    <div
      className={`product-card ${
        isSpecial ? 'product-card-special' : ''
      } relative rounded-2xl border border-dark-600 bg-dark-800/80 overflow-hidden anim-fade-up group`}
      style={{ animationDelay: `${Math.min(index * 0.07, 0.5)}s` }}
    >
      {/* Badge */}
      {product.badge && (
        <span
          className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-lg text-[10px] font-bold tracking-wide uppercase ${badgeClass}`}
        >
          {product.badge}
        </span>
      )}

      {/* Konten */}
      <div className="p-6 flex flex-col items-center text-center">
        {/* Ikon */}
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 ${
            isSpecial
              ? 'bg-amber-500/10'
              : 'bg-accent/10'
          }`}
        >
          {product.icon || '📦'}
        </div>

        {/* Nama */}
        <h3 className="font-semibold text-white text-sm mb-1.5 leading-snug">
          {product.name}
        </h3>

        {/* Kategori */}
        <span className="text-[11px] text-gray-500 mb-4">{product.category}</span>

        {/* Harga */}
        <div className="flex items-center gap-2">
          <span
            className={`text-xl font-extrabold ${
              isSpecial ? 'text-gradient-gold' : 'text-gradient'
            }`}
          >
            {formatRupiah(product.price)}
          </span>
        </div>

        {/* Tombol */}
        <button
          className={`mt-4 w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-1.5 ${
            isSpecial
              ? 'bg-amber-500/15 text-amber-400 border border-amber-500/25 hover:bg-amber-500/25'
              : 'bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20'
          }`}
        >
          Beli Sekarang
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
                  }
