import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/globals.css';
import { Inter } from 'next/font/google';
import Navbar from './components/navbar';
import Footer from './components/footer';
import { AuthProvider } from './contexts/authContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Gallery Friends',
  description: 'An app used to post and view beautiful images',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`bg-gradient-to-br from-blue-500 to-purple-500 ${inter.className} text-sm md:text-lg lg:text-xl`}>
        <AuthProvider>
          <Navbar />
        </AuthProvider>
        {children}
        <Footer />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js" defer></script>
      </body>
    </html>
  )
}
