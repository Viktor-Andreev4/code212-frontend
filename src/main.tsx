import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './components/login/Login.tsx'
import Register from './components/login/Register.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import AuthProvider from './components/context/AuthContext.tsx'
import ProtectedRoute from './shared/ProtectedRoute.tsx'

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />//<AuthProvider><Login /></AuthProvider>
  },
  {
    path: "/",
    element: <Register />//<AuthProvider><Register /></AuthProvider>
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute> <App /> </ProtectedRoute>
  }
]) 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
