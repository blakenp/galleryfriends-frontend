import './styles/globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import AuthNavbar from './components/authNavbar'
import { AuthProvider } from './contexts/authContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Gallery Friends',
  description: 'An app used to post and view beautiful images',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* {isLoggined ? (
          <Navbar />
        ) : (
          <>
            <AuthNavbar />
            <AuthProvider>
              {children}
            </AuthProvider>
          </>
        )} */}
        <AuthProvider>
          <Navbar />
        </AuthProvider>
        {children}
      </body>
    </html>
  )
}
