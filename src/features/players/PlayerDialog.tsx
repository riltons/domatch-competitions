import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PlayerForm } from './PlayerForm'
import { Button, Plus } from '@/components/ui'

interface PlayerDialogProps {
  communityId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PlayerDialog({ communityId, open, onOpenChange }: PlayerDialogProps) {
  const setOpen = (open: boolean) => onOpenChange(open)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Novo Jogador
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="player-dialog-description" className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Novo Jogador</DialogTitle>
          <p id="player-dialog-description" className="text-sm text-muted-foreground">
            Preencha as informações para cadastrar um novo jogador.
          </p>
        </DialogHeader>
        <PlayerForm
          communityId={communityId}
          onSuccess={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
