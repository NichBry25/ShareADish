'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function LoginPage(){
    const { login, isLoading } = useAuth()
    const router = useRouter();
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent){
        e.preventDefault();
        setError(null)
        setIsSubmitting(true)
        const result = await login(username, password);
        setIsSubmitting(false)

        if (result.success){
            router.push('/');
        } else {
            setError(result.error ?? 'Unable to log in.');
        }
    }

    return (
        <main className="p-6">
            <h1 className="text-xl font-semibold">Log In</h1>
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                <input
                    className="border rounded px-3 py-2"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    className="border rounded px-3 py-2"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error ? <p className="text-sm text-red-600">{error}</p> : null}
                <button
                    className="bg-[#344f1f] text-white px-4 py-2 rounded disabled:cursor-not-allowed disabled:bg-neutral-400"
                    disabled={isSubmitting || isLoading}
                >
                    {isSubmitting ? 'Logging in…' : 'Log In'}
                </button>
            </form>
        </main>
    )
}
