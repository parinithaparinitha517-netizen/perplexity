import React from 'react'
import { createBrowserRouter } from 'react-router'
import Login from '../../auth/feautures/pages/login'
import Register from '../../auth/feautures/pages/register'

export const router = createBrowserRouter([
    {
        path: '/login',
        element: React.createElement(Login),
    },
    {
        path: '/register',
        element: React.createElement(Register),
    }
])