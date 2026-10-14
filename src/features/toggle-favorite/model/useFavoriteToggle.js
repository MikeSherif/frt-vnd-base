import { isFavorite, toggleFavorite, useVndState } from '../../../entities/document'
import { useSession } from '../../../entities/session'

export function useFavoriteToggle(documentId) {
  const user = useSession()
  const state = useVndState()
  return {
    active: isFavorite(user.id, documentId, state),
    toggle() {
      toggleFavorite(user.id, documentId)
    },
  }
}
