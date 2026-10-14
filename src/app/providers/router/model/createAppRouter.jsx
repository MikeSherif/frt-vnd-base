import { createBrowserRouter, createHashRouter } from 'react-router-dom'
import { AppLayout } from '../../../layout'
import { AdminPage } from '../../../../pages/admin'
import { CatalogPage } from '../../../../pages/catalog'
import { DocumentPage } from '../../../../pages/document'
import { DutiesPage } from '../../../../pages/duties'
import { FavoritesPage } from '../../../../pages/favorites'
import { FunctionCardPage } from '../../../../pages/function-card'
import { FunctionCatalogPage } from '../../../../pages/function-catalog'
import { SectionsPage } from '../../../../pages/sections'

const routes = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <SectionsPage /> },
      { path: 'vnd', element: <CatalogPage /> },
      { path: 'documents/:id', element: <DocumentPage /> },
      { path: 'admin/documents/new', element: <AdminPage /> },
      { path: 'admin/documents/:id', element: <AdminPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'functions', element: <FunctionCatalogPage /> },
      { path: 'functions/:id', element: <FunctionCardPage /> },
      { path: 'duties', element: <DutiesPage /> },
    ],
  },
]

export function createAppRouter() {
  if (import.meta.env.VITE_ROUTER === 'browser') return createBrowserRouter(routes)
  return createHashRouter(routes)
}
