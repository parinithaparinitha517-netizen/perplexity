import { Navigate, createBrowserRouter } from "react-router-dom";
import Login from "../auth/feautures/pages/login.jsx";
import Register from "../auth/feautures/pages/register.jsx";
import Dashboard from "../auth/feautures/chat/pages/dashboard.jsx";
import Protected from "../auth/feautures/components/protected.jsx";
import GuestOnly from "../auth/feautures/components/guest-only.jsx";
import { NotFound, RouteError } from "./route-error.jsx";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
        errorElement: <RouteError />,
    },
    {
        path: "/login",
        element: (
            <GuestOnly>
                <Login />
            </GuestOnly>
        ),
        errorElement: <RouteError />,
    },
    {
        path: "/register",
        element: (
            <GuestOnly>
                <Register />
            </GuestOnly>
        ),
        errorElement: <RouteError />,
    },
    {
        path: "/dashboard",
        element: (
            <Protected>
                <Dashboard />
            </Protected>
        ),
        errorElement: <RouteError />,
    },
    {
        path: "*",
        element: <NotFound />,
        errorElement: <RouteError />,
    },
]);
