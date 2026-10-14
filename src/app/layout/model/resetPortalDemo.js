import { resetDemo } from '../../../entities/document'
import { resetSession } from '../../../entities/session'

export function resetPortalDemo() {
  resetDemo()
  resetSession()
}
