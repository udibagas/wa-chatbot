import { createBrowserRouter, redirect } from "react-router";
import { axiosInstance, getItem } from "./lib/api";
import Loading from "./components/Loading";
import { lazy } from "react";
import Report from "./pages/Report/Report";

const MainLayout = lazy(() => import('./layouts/MainLayout'))
const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'))
const Complaints = lazy(() => import('./pages/Complaints/Complaints'))
const ComplaintDetail = lazy(() => import('./pages/Complaints/ComplaintDetail'))
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

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    loader: authLoader,
    hydrateFallbackElement: <Loading />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: '/users', element: <Users /> },
      { path: '/complaints', element: <Complaints /> },
      {
        path: '/complaints/:id',
        element: <ComplaintDetail />,
        loader: async ({ params }) => {
          if (!params.id) {
            throw new Error('Complaint ID is required');
          }
          const data = await getItem("/api/complaints", +params.id);
          return data;
        }
      },
      { path: '/report', element: <Report /> },
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