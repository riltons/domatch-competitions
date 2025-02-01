import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { PlayerForm } from './PlayerForm'

interface PlayerDialogProps {
  communityId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlayerDialog({ communityId, open, onOpenChange }: PlayerDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Jogador</DialogTitle>
        </DialogHeader>
        <PlayerForm
          communityId={communityId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
