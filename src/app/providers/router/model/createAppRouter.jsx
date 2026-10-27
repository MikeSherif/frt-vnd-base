import { lazy } from 'react'
import { createBrowserRouter, createHashRouter } from 'react-router-dom'
import { AppLayout } from '../../../layout'

function loadPage(importer, name) {
  return lazy(() => importer().then((module) => ({ default: module[name] })))
}

const SectionsPage = loadPage(() => import('../../../../pages/sections'), 'SectionsPage')
const CatalogPage = loadPage(() => import('../../../../pages/catalog'), 'CatalogPage')
const DocumentPage = loadPage(() => import('../../../../pages/document'), 'DocumentPage')
const AdminPage = loadPage(() => import('../../../../pages/admin'), 'AdminPage')
const FavoritesPage = loadPage(() => import('../../../../pages/favorites'), 'FavoritesPage')
const FunctionCatalogPage = loadPage(() => import('../../../../pages/function-catalog'), 'FunctionCatalogPage')
const FunctionCardPage = loadPage(() => import('../../../../pages/function-card'), 'FunctionCardPage')
const DutiesPage = loadPage(() => import('../../../../pages/duties'), 'DutiesPage')

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
