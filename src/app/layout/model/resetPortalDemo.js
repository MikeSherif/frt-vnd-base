import { useResetDocuments } from '../../../entities/document'
import { resetSession } from '../../../entities/session'

export function useResetPortal() {
  const resetDocuments = useResetDocuments()
  return () => {
    resetDocuments()
    resetSession()
  }
}
