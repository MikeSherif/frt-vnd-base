import { RouterProvider } from 'react-router-dom'
import { createAppRouter } from '../model/createAppRouter.jsx'

const router = createAppRouter()

export function AppRouter() {
  return <RouterProvider router={router} />
}
