import './globals.css'

export const metadata = {
  title: 'Geto Digital Store — Premium Digital Solution',
  description:
    'Platform penyedia script bot WhatsApp terbaik, panel reseller eksklusif, dan berbagai kebutuhan digital premium dengan pengiriman otomatis secepat kilat.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-dark-900 text-gray-300 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
