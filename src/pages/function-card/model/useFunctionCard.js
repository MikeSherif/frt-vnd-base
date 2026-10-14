import { functionById, FUNCTION_ROLES, labelOf } from '../../../entities/document'

export function useFunctionCard(id, documents) {
  const item = functionById(id)
  const links = documents.flatMap((document) => {
    if (!document.published) return []
    const link = document.functionLinks.find((entry) => entry.functionId === id)
    if (!link) return []
    return [{ document, role: labelOf(FUNCTION_ROLES, link.role) }]
  })
  return { item, links }
}
