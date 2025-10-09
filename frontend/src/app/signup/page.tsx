'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function SignupPage() {
    const { signup, isLoading } = useAuth();
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        const result = await signup(username, password);
        setIsSubmitting(false);

        if (result.success) {
            router.push("/");
        } else {
            setError(result.error ?? "Unable to sign up.");
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-12">
            <div className="w-full max-w-md space-y-6">
                <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-lg">
                    <h1 className="text-2xl font-semibold text-neutral-900">Sign Up</h1>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-700" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="username"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-neutral-700" htmlFor="password">
                                Password
                            </label>
                            <input
                                id="password"
                                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-neutral-900 shadow-sm focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-500/50"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                            />
                        </div>
                        {error ? <p className="text-sm text-red-600">{error}</p> : null}
                        <button
                            className="w-full rounded-lg bg-[#344f1f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2c421a] disabled:cursor-not-allowed disabled:bg-neutral-400"
                            disabled={isSubmitting || isLoading}
                        >
                            {isSubmitting ? "Signing up…" : "Sign Up"}
                        </button>
                    </form>
                </div>

                <div className="text-center text-sm text-neutral-600">
                    <Link href="/login" className="font-semibold text-lime-800 hover:text-lime-600">
                        Already have an account?
                    </Link>
                </div>
            </div>
        </main>
    );
}
