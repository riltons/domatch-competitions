import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authService } from '@/services/auth'
import { registerSchema, type RegisterInput } from '@/lib/validations/auth'

export function RegisterPage() {
  const [error, setError] = useState<string>('')
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: authService.register,
    onError: (error: Error) => {
      setError('Erro ao criar conta. Tente novamente.')
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-muted-foreground">
            Preencha os dados abaixo para criar sua conta
          </p>
        </div>

        <form onSubmit={handleSubmit((data) => registerUser(data))} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Seu nome"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="passwordConfirm">Confirmar Senha</Label>
            <Input
              id="passwordConfirm"
              type="password"
              {...register('passwordConfirm')}
            />
            {errors.passwordConfirm && (
              <p className="text-sm text-destructive">{errors.passwordConfirm.message}</p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={isPending}
          >
            {isPending ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-muted-foreground">
            Já tem uma conta?{' '}
            <a href="/login" className="text-primary hover:underline">
              Faça login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
