import { isFavorite } from '../../../entities/document'
import { useSession } from '../../../entities/session'

export function favoriteDocuments(documents, userId) {
  return documents.filter((document) => document.published && isFavorite(userId, document.id))
}
