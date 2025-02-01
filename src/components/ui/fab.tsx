import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FabProps {
  href: string
  label: string
  className?: string
}

export function Fab({ href, label, className }: FabProps) {
  return (
    <Link
      to={href}
      className={cn(
        'md:hidden fixed bottom-20 right-4 bg-[#22c55e] text-white p-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#16a34a] transition-colors',
        className
      )}
      aria-label={label}
    >
      <Plus className="h-5 w-5" />
      <span className="sr-only">{label}</span>
    </Link>
  )
}
