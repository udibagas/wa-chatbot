import { createBrowserRouter, redirect, RouterProvider } from 'react-router'
import { lazy, Suspense } from 'react'
import Loading from './components/Loading'
import { axiosInstance } from './lib/api'

const MainLayout = lazy(() => import('./layouts/MainLayout'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Notification = lazy(() => import('./pages/Notification/Notification'))
const Message = lazy(() => import('./pages/Messages/Message'))
const Login = lazy(() => import('./pages/Login'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))
const Users = lazy(() => import('./pages/Users/Users'))

const authLoader = async () => {
  try {
    const { data: user } = await axiosInstance.get('/auth/me');
    return { user }
  } catch (error: unknown) {
    console.error(error);
    return redirect('/login');
  }
}

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    loader: authLoader,
    hydrateFallbackElement: <Loading />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: '/users', element: <Users /> },
      { path: '/messages', element: <Message /> },
      { path: '/notifications', element: <Notification /> },
      { path: '*', element: <div>404 Not Found</div> },
    ],
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
    ],
  },
])

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}