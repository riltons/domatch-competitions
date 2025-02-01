import { Link, useLocation } from 'react-router-dom'
import { Home, Users, Trophy, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const location = useLocation()

  const items = [
    {
      label: 'Início',
      icon: Home,
      href: '/',
    },
    {
      label: 'Comunidades',
      icon: Users,
      href: '/communities',
    },
    {
      label: 'Campeonatos',
      icon: Trophy,
      href: '/tournaments',
    },
    {
      label: 'Perfil',
      icon: User,
      href: '/profile',
    },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16 px-4">
      <div className="flex items-center justify-around h-full">
        {items.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              'flex flex-col items-center justify-center text-xs gap-1 px-3 py-2 rounded-lg transition-colors',
              location.pathname === item.href
                ? 'text-[#22c55e]'
                : 'text-muted-foreground hover:text-[#22c55e]'
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
