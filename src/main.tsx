import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Login from './components/login/Login.tsx'
import Register from './components/login/Register.tsx'
import CodeEditor from './components/code-editor/CodeEditor.tsx'  
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import AuthProvider from './components/context/AuthContext.tsx'
import ProtectedRoute from './shared/ProtectedRoute.tsx'
import ProblemPage from './components/problem/ProblemPage.tsx'
import Participants from './components/participants/Participants.tsx'
import ExamPage from './components/exam/ExamPage.tsx'
import theme from './theme.tsx'

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
    path: "/code-editor",
    element: <CodeEditor />
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute> <App /> </ProtectedRoute>
  },
  {
    path: "/problems",
    element: <ProblemPage/>
  },
  {
    path: "/participants",
    element: <Participants/>
  },
  {
    path: "/exams",
    element: <ExamPage/>
  }
]) 
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode="dark" />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
