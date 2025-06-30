'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Bolt, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: 'AI Assistant', href: '/assistant' },
  ]

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6">
          {/* Left: Hamburger (Mobile) + Brand */}
          <div className="flex items-center gap-2">
            {/* Hamburger (Mobile) */}
            <button
              className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            {/* Brand */}
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600">
              <Bolt className="h-5 w-5 text-yellow-500" />
              TeslaPulse
            </Link>
          </div>

          {/* Center: Nav Links (Desktop) */}
          <nav className="hidden md:flex space-x-4 text-sm font-medium">
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

          {/* Right: Theme Toggle */}
          <div className="flex items-center space-x-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay & Panel (fixed, outside header) */}
      <div
        className={cn(
          'fixed inset-0 z-[100] md:hidden transition-all duration-300',
          mobileOpen ? 'visible' : 'invisible pointer-events-none'
        )}
        aria-hidden={!mobileOpen}
      >
        {/* Overlay */}
        <div
          className={cn(
            'fixed inset-0 bg-black/40 transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />
        {/* Slide-in Menu */}
        <nav
          className={cn(
            'fixed top-0 left-0 h-full w-3/4 max-w-xs bg-background border-r shadow-lg flex flex-col p-6 space-y-2 transition-transform duration-300',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600">
              <Bolt className="h-5 w-5 text-yellow-500" />
              TeslaPulse
            </span>
            <button
              className="p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
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
      </div>
    </>
  )
}
