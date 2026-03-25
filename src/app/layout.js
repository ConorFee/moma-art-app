import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "MoMA Art Collection",
  description: "Browse the Museum of Modern Art collection",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900">
        {/* Navigation bar — appears on every page */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold tracking-tight">
              MoMA Collection
            </Link>
            <div className="flex gap-4">
              <Link href="/" className="hover:text-blue-600 transition-colors">
                Gallery
              </Link>
              <Link href="/about" className="hover:text-blue-600 transition-colors">
                About
              </Link>
            </div>
          </div>
        </nav>

        {/* Page content gets rendered here */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4 text-center text-sm text-gray-500">
          MoMA Art Collection App — Enterprise Application Development 2026
        </footer>
      </body>
    </html>
  );
}
