'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Receipt,
  LogOut,
  Zap,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/dashboard/products', label: 'Kelola Produk', icon: Package },
  { href: '/admin/dashboard/transactions', label: 'Kelola Transaksi', icon: Receipt },
]

export default function AdminLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  function handleLogout() {
    document.cookie = 'admin_token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  // Tutup sidebar saat ganti halaman (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-dark-600">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-accent/15 flex items-center justify-center">
            <Zap className="w-4.5 h-4.5 text-accent" />
          </div>
          <div>
            <span className="font-bold text-white text-sm">Geto</span>
            <span className="font-bold text-accent text-sm">Store</span>
            <p className="text-[10px] text-gray-600 leading-none mt-0.5">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-accent/15 text-accent'
                  : 'text-gray-400 hover:text-white hover:bg-dark-600'
              }`}
            >
              <Icon className="w-4.5 h-4.5" />
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Bawah */}
      <div className="p-3 border-t border-dark-600 space-y-1">
        <button
          onClick={() => router.push('/')}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-dark-600 transition-all"
        >
          <ArrowLeft className="w-4.5 h-4.5" />
          Kembali ke Store
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-dark-900 flex">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 bg-dark-800 border-r border-dark-600 flex-col h-screen sticky top-0">
        {sidebarContent}
      </aside>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-dark-800 border-r border-dark-600 z-50 lg:hidden transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        {/* Top Bar Mobile */}
        <div className="lg:hidden sticky top-0 z-30 glass h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-semibold text-white text-sm">Admin Panel</span>
        </div>

        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
