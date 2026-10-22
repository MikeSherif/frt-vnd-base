import { Outlet } from 'react-router-dom'
import { RoleSwitch } from '../../../entities/session'
import { useResetPortal } from '../model/resetPortalDemo.js'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const resetPortal = useResetPortal()
  return (
    <div className={styles.shell}>
      <div className={styles.demo}>
        <RoleSwitch />
        <button type="button" onClick={resetPortal}>Сбросить демо-данные</button>
      </div>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
