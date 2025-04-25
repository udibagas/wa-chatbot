import { BrowserRouter, Route, Routes } from 'react-router'
import { lazy, Suspense } from 'react'

const MainLayout = lazy(() => import('./layouts/MainLayout'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Login = lazy(() => import('./pages/Login'))
const AuthLayout = lazy(() => import('./layouts/AuthLayout'))
const User = lazy(() => import('./pages/Users'))

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/users" element={<User />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Route>

          <Route path="/login" element={<AuthLayout />}>
            <Route index element={<Login />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}