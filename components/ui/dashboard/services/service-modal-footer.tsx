import { Button } from '@/components/ui/button'

type ServiceModalFooterProps = {
  isPending: boolean
  onClose: () => void
}

export function ServiceModalFooter({ isPending, onClose }: ServiceModalFooterProps) {
  return (
    <div className="mt-6 flex justify-end gap-3 border-t border-outline-variant pt-4">
      <button
        type="button"
        onClick={onClose}
        disabled={isPending}
        className="px-4 py-2 text-sm font-semibold text-foreground/70 transition-colors hover:text-foreground disabled:opacity-50"
      >
        Annuler
      </button>
      <Button type="submit" disabled={isPending} className="px-6 py-2">
        {isPending ? 'Enregistrement...' : 'Enregistrer'}
      </Button>
    </div>
  )
}
