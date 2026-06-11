type ServiceModalHeaderProps = {
  isEditing: boolean
  onClose: () => void
}

export function ServiceModalHeader({ isEditing, onClose }: ServiceModalHeaderProps) {
  return (
    <div className="flex items-center justify-between border-b border-outline-variant px-6 py-4">
      <h2 className="font-serif text-2xl text-foreground">
        {isEditing ? 'Modifier la prestation' : 'Nouvelle prestation'}
      </h2>
      <button
        type="button"
        onClick={onClose}
        className="p-2 text-foreground/65 hover:text-foreground"
        aria-label="Fermer"
      >
        <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
          close
        </span>
      </button>
    </div>
  )
}
