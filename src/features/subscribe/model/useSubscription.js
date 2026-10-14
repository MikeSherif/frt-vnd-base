import { isSubscribed, toggleSubscription, useVndState } from '../../../entities/document'
import { useSession } from '../../../entities/session'

export function useSubscription(target) {
  const user = useSession()
  const state = useVndState()
  return {
    active: isSubscribed(user.id, target, state),
    toggle() {
      toggleSubscription(user.id, target)
    },
  }
}
