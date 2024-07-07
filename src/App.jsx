import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layouts/app-layout'
import Dashboard from './pages/dashboard'
import Landing from './pages/landing'
import Auth from './pages/auth'
import Link from './pages/link'
import RedirectLink from './pages/redirect-link'
import UrlProvider from './context'
import RequireAuth from './components/require-auth'


const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Landing />
      },
      {
        path: '/dashboard',
        element: (
            <RequireAuth>
              <Dashboard/>
            </RequireAuth>
          )
      },
      {
        path: '/auth',
        element: <Auth />
      },
      {
        path: '/link/:id',
        element: (
            <RequireAuth>
              <Link />
            </RequireAuth>
          )
      },
      {
        path: '/:id',
        element: <RedirectLink />
      }
    ]
  }
])

function App() {

  return (
    <UrlProvider>
      <RouterProvider router={router}/>
    </UrlProvider>
  )
}

export default App
