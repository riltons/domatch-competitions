import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Home, Users, User, Trophy } from 'lucide-react'
import { Logo } from '@/components/ui/logo'

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()

  const menuItems = [
    {
      href: '/',
      label: 'Início',
      icon: Home
    },
    {
      href: '/communities',
      label: 'Comunidades',
      icon: Users
    },
    {
      href: '/players',
      label: 'Jogadores',
      icon: Trophy
    },
    {
      href: '/profile',
      label: 'Perfil',
      icon: User
    }
  ]

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(href)
  }

  if (!user) {
    return children
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="px-2 md:container flex h-14 items-center justify-between md:justify-start">
          {/* Menu Mobile e Logo */}
          <div className="flex items-center gap-2">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <nav className="flex flex-col gap-4 p-4">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isActive(item.href)
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Domatch
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex md:flex-1 md:justify-center">
            <ul className="flex gap-4">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.href}>
                    <Link
                      to={item.href}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium ${
                        isActive(item.href)
                          ? 'text-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Profile Button */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              asChild
              className="ml-auto"
            >
              <Link to="/profile">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-2 md:container py-6 pb-24 md:pb-6">{children}</main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <ul className="px-2 md:container flex h-16 items-center justify-around">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex flex-col items-center gap-1 px-4 py-2 text-xs font-medium ${
                    isActive(item.href)
                      ? 'text-foreground'
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
