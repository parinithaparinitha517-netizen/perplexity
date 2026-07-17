import { Link, isRouteErrorResponse, useRouteError } from "react-router-dom";

export function RouteError() {
    const error = useRouteError();
    const status = isRouteErrorResponse(error) ? error.status : 500;
    const message = isRouteErrorResponse(error)
        ? error.statusText
        : "The application could not load this page.";

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#111827] px-6 text-white">
            <div className="max-w-md text-center">
                <p className="mb-2 text-sm font-semibold text-indigo-400">Error {status}</p>
                <h1 className="mb-3 text-3xl font-bold">Something went wrong</h1>
                <p className="mb-6 text-gray-400">{message}</p>
                <Link to="/dashboard" className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 font-medium hover:bg-indigo-700">
                    Return to dashboard
                </Link>
            </div>
        </main>
    );
}

export function NotFound() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#111827] px-6 text-white">
            <div className="max-w-md text-center">
                <p className="mb-2 text-sm font-semibold text-indigo-400">404</p>
                <h1 className="mb-3 text-3xl font-bold">Page not found</h1>
                <p className="mb-6 text-gray-400">The page you requested does not exist.</p>
                <Link to="/dashboard" className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 font-medium hover:bg-indigo-700">
                    Return to dashboard
                </Link>
            </div>
        </main>
    );
}
