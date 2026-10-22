import { useIsFavorite, useToggleFavorite } from '../../../entities/document'
import { useSession } from '../../../entities/session'

export function useFavoriteToggle(documentId) {
  const user = useSession()
  const favorite = useIsFavorite(user.id, documentId)
  const toggleFavorite = useToggleFavorite()
  return {
    active: Boolean(favorite.data),
    toggle() {
      toggleFavorite.mutate({ userId: user.id, documentId })
    },
  }
}
