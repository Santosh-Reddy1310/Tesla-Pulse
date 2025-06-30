'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Bolt, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: 'AI Assistant', href: '/assistant' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
        {/* 🔷 Brand */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600">
          <Bolt className="h-5 w-5 text-yellow-500" />
          TeslaPulse
        </Link>

        {/* 🔗 Nav Links (Desktop) */}
        <nav className="hidden space-x-4 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Hamburger (Mobile) */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* 🌓 Dark/Light Mode */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <nav className="md:hidden bg-background border-b px-6 py-4 space-y-2 shadow">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'block py-2 px-2 rounded transition-colors hover:bg-blue-50 hover:text-primary',
                pathname === link.href ? 'text-primary font-semibold' : 'text-muted-foreground'
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
