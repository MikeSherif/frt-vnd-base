import { useId } from 'react'
import { setRole, useSession } from '../model/session.js'
import { USERS } from '../model/users.js'
import { Select } from '../../../shared/select'
import styles from './RoleSwitch.module.css'

const ROLE_OPTIONS = Object.values(USERS).map((item) => ({
  id: item.role,
  label: `${item.roleLabel}: ${item.name}`,
}))

export function RoleSwitch() {
  const user = useSession()
  const labelId = useId()
  return (
    <div className={styles.switcher}>
      <span id={labelId}>Роль на портале</span>
      <Select compact labelledBy={labelId} value={user.role} options={ROLE_OPTIONS} onChange={setRole} />
    </div>
  )
}
