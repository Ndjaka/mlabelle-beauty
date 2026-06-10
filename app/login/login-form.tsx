'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase/client'
import { isAdminUser } from '@/features/auth/utils'
import Link from 'next/link'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const supabase = createBrowserClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError('Identifiants incorrects. Veuillez réessayer.')
      setIsLoading(false)
      return
    }

    if (!isAdminUser(data.user)) {
      await supabase.auth.signOut()
      setError('Accès réservé à l’administratrice.')
      setIsLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  const inputClass =
    'w-full bg-transparent border-0 border-b border-[color:var(--neutral)] px-0 py-3 font-sans text-base text-[color:var(--foreground)] placeholder:text-[color:var(--outline)] focus:ring-0 focus:border-[color:var(--secondary)] transition-colors rounded-none outline-none'
  const labelClass =
    'label-caps block w-full text-left text-[color:var(--outline)] transition-colors group-focus-within:text-[color:var(--secondary)]'

  return (
    <form className="w-full flex flex-col gap-6 text-left" onSubmit={handleSubmit} noValidate>
      {/* Email */}
      <div className="flex flex-col gap-1 group">
        <label
          htmlFor="login-email"
          className={labelClass}
        >
          EMAIL PROFESSIONNEL
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          placeholder="votre@email.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClass}
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1 group relative">
        <label
          htmlFor="login-password"
          className={labelClass}
        >
          MOT DE PASSE
        </label>
        <div className="relative w-full">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[color:var(--secondary)] hover:opacity-70 transition-opacity focus:outline-none"
          >
            <span className="material-symbols-outlined text-xl">
              {showPassword ? 'visibility_off' : 'visibility'}
            </span>
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-4 mt-2">
        <button
          type="submit"
          disabled={isLoading}
          id="login-submit"
          className="w-full bg-[color:var(--foreground)] text-white py-4 label-caps uppercase tracking-[0.15em] hover:bg-[#333029] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed focus:ring-1 focus:ring-[color:var(--secondary)] focus:ring-offset-2"
        >
          {isLoading ? 'CONNEXION…' : 'SE CONNECTER'}
        </button>

        <Link
          href="/login/reset"
          className="text-center font-serif text-sm text-[color:var(--secondary)] hover:opacity-70 transition-opacity"
        >
          Mot de passe oublié ?
        </Link>
      </div>

      {/* Inline error */}
      {error && (
        <p
          id="login-error"
          role="alert"
          className="text-sm font-sans text-red-600 text-center animate-fade-in-up"
        >
          {error}
        </p>
      )}
    </form>
  )
}
