import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import '../styles/form.css'
export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setLoading(true);
        setError("");
        const playload={
            email,password
        }

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Login failed");
            }

            localStorage.setItem("token", data.token);

            navigate("/dashboard");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4">

            {/* Background */}

            <div className="animate-blob absolute top-0 left-0 h-96 w-96 rounded-full bg-red-700/20 blur-3xl"></div>
            <div className="animate-blob animation-delay-2000 absolute top-20 right-0 h-96 w-96 rounded-full bg-red-500/20 blur-3xl"></div>
            <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-red-800/20 blur-3xl"></div>

            <div className="glass relative z-10 w-full max-w-md rounded-3xl p-8">

                <div className="mb-8 text-center">
                    <div className="brand-badge">
                        <span className="brand-dot"></span>
                        Perplexity
                    </div>

                    <h1 className="bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-5xl font-bold text-transparent">
                        Welcome Back
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Login to continue
                    </p>
                </div>

                {error && (
                    <div className="mb-5 rounded-xl border border-red-700 bg-red-900/20 p-3 text-red-300">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="input-dark"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="input-dark"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-sm text-red-400 hover:text-red-300"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-red disabled:opacity-50"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="my-8 flex items-center">
                    <div className="h-px flex-1 bg-zinc-700"></div>
                    <span className="mx-4 text-zinc-500">OR</span>
                    <div className="h-px flex-1 bg-zinc-700"></div>
                </div>

                <Link
                    to="/register"
                    className="btn-outline-red block text-center"
                >
                    Create New Account
                </Link>
            </div>
        </div>
    );
}