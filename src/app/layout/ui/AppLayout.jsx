import { Outlet } from 'react-router-dom'
import { RoleSwitch } from '../../../entities/session'
import { resetPortalDemo } from '../model/resetPortalDemo.js'
import styles from './AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <div className={styles.demo}>
        <RoleSwitch />
        <button type="button" onClick={resetPortalDemo}>Сбросить демо-данные</button>
      </div>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
