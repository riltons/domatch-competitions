import { useState } from 'react'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { Button } from '../../components/ui/button'
import { useAuth } from '../../features/auth/AuthProvider'
import type { Comunidade } from '../../types'

export function CreateCommunityDialog() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const queryClient = useQueryClient()

  const createCommunity = useMutation({
    mutationFn: async (newCommunity: Partial<Comunidade>) => {
      const { data, error } = await supabase
        .from('comunidades')
        .insert([
          {
            ...newCommunity,
            admin_id: user?.id,
          },
        ])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] })
      setIsOpen(false)
      setNome('')
      setDescricao('')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createCommunity.mutate({ nome, descricao })
  }

  if (!isOpen) {
    return (
      <Button onClick={() => setIsOpen(true)}>
        Nova Comunidade
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-full max-w-lg">
        <div className="bg-background rounded-lg shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Nova Comunidade</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full p-2 rounded-md border border-input"
                required
              />
            </div>

            <div>
              <label htmlFor="descricao" className="block text-sm font-medium mb-1">
                Descrição
              </label>
              <textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full p-2 rounded-md border border-input"
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createCommunity.isPending}
              >
                {createCommunity.isPending ? 'Criando...' : 'Criar Comunidade'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
