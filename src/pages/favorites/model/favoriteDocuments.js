import { isFavorite } from '../../../entities/document'

export function favoriteDocuments(documents, userId, favorites = {}) {
  return documents.filter((document) => document.published && isFavorite(userId, document.id, { favorites }))
}
