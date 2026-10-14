import { setRole, USERS, useSession } from '../model/session.js'
import { Select } from '../../../shared/select'
import styles from './RoleSwitch.module.css'

const ROLE_OPTIONS = Object.values(USERS).map((item) => ({
  id: item.role,
  label: `${item.roleLabel}: ${item.name}`,
}))

export function RoleSwitch() {
  const user = useSession()
  return (
    <label className={styles.switcher}>
      Роль на портале
      <Select compact ariaLabel="Роль на портале" value={user.role} options={ROLE_OPTIONS} onChange={setRole} />
    </label>
  )
}
