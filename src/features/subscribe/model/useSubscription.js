import { useIsSubscribed, useToggleSubscription } from '../../../entities/document'
import { useSession } from '../../../entities/session'

export function useSubscription(target) {
  const user = useSession()
  const subscription = useIsSubscribed(user.id, target)
  const toggleSubscription = useToggleSubscription()
  return {
    active: Boolean(subscription.data),
    toggle() {
      toggleSubscription.mutate({ userId: user.id, target })
    },
  }
}
