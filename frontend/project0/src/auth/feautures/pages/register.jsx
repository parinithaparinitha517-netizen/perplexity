import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../hook/use.auth";
import "../styles/form.css";

export default function Register() {
    const navigate = useNavigate();
    const { handleRegister } = useAuth();

    const { loading, error: reduxError } = useSelector(
        (state) => state.auth
    );

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");

    function handleChange(e) {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        setError("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const response = await handleRegister({
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            navigate("/login", {
                state: {
                    message: response.message,
                    verificationLink: response.verificationLink,
                },
            })  ;
        } catch (err) {
            // console.log(error.response.data);
    setError(
        err.response?.data?.errors?.[0]?.message ||
        err.response?.data?.message ||
        err.message
    );
}
    }

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-black via-zinc-950 to-red-950 px-4">

            {/* Animated Background */}

            <div className="animate-blob absolute left-0 top-0 h-96 w-96 rounded-full bg-red-700/20 blur-3xl"></div>

            <div className="animate-blob animation-delay-2000 absolute right-0 top-20 h-96 w-96 rounded-full bg-red-500/20 blur-3xl"></div>

            <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-red-800/20 blur-3xl"></div>

            {/* Card */}

            <div className="glass relative z-10 w-full max-w-md rounded-3xl p-8">

                <div className="mb-8 text-center">
                    <div className="brand-badge">
                        <span className="brand-dot"></span>
                        Perplexity
                    </div>

                    <h1 className="bg-gradient-to-r from-red-400 via-red-500 to-red-700 bg-clip-text text-5xl font-bold text-transparent">
                        Create Account
                    </h1>

                    <p className="mt-3 text-zinc-400">
                        Join us today
                    </p>
                </div>

                {(error || reduxError) && (
                    <div className="mb-5 rounded-xl border border-red-700 bg-red-900/20 p-3 text-red-300">
                        {error || reduxError}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Choose a username"
                            className="input-dark"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoComplete="username"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            className="input-dark"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
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
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-zinc-300">
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            className="input-dark"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            autoComplete="new-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-red disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>

                <div className="my-8 flex items-center">
                    <div className="h-px flex-1 bg-zinc-700"></div>

                    <span className="mx-4 text-zinc-500">
                        OR
                    </span>

                    <div className="h-px flex-1 bg-zinc-700"></div>
                </div>

                <Link
                    to="/login"
                    className="btn-outline-red block text-center"
                >
                    Already have an account? Sign In
                </Link>

            </div>
        </div>
    );
}
