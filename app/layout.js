import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Neurobity',
  description: 'Noticias y análisis sobre tecnología, IA y productividad.',
  icons: {
    icon: '/favicon.ico',
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}>
        {children}
      </body>
    </html>
  );
}
