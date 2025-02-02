import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Plus } from '@/components/ui/icons'
import { communityService } from '@/services/community'
import { createCommunitySchema, type CreateCommunityInput } from '@/lib/validations/community'

export function CreateCommunityDialog() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateCommunityInput>({
    resolver: zodResolver(createCommunitySchema),
  })

  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: communityService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      setOpen(false)
      reset()
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Comunidade
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby="community-dialog-description">
        <DialogHeader>
          <DialogTitle>Nova Comunidade</DialogTitle>
          <p id="community-dialog-description" className="text-sm text-muted-foreground">
            Preencha as informações para criar uma nova comunidade.
          </p>
        </DialogHeader>
        <form onSubmit={handleSubmit((data) => createCommunity(data))} className="space-y-4">
          <div>
            <Label htmlFor="name">Nome da Comunidade</Label>
            <Input id="name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
