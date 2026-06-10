import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Réinitialisation — Mlabelle Beauty',
}

export default function ResetPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-[color:var(--foreground)] mb-4">
          Bientôt disponible
        </h1>
        <p className="font-sans text-base text-[color:var(--outline)]">
          La réinitialisation du mot de passe sera bientôt disponible.
        </p>
      </div>
    </div>
  )
}
