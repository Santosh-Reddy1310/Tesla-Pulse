'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Bolt } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()

  const navLinks = [
    { name: 'Dashboard', href: '/' },
    { name: 'Compare', href: '/compare' },
    { name: 'AI Assistant', href: '/assistant' }, // ✅ fixed wrong /ai path
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-6">
        {/* 🔷 Brand */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-blue-600">
          <Bolt className="h-5 w-5 text-yellow-500" />
          TeslaPulse
        </Link>

        {/* 🔗 Nav Links */}
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

        {/* 🌓 Dark/Light Mode */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
