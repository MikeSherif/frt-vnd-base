import { FUNCTIONS } from '../../../entities/document'

export function functionsWithCounts(documents) {
  return FUNCTIONS.map((item) => ({
    ...item,
    count: documents.filter((document) => document.published && document.functionLinks.some((link) => link.functionId === item.id)).length,
  }))
}
