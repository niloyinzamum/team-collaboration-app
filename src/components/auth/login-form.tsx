"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

// ...existing code...

async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
  event.preventDefault();
  setIsLoading(true);
  setError(null);

  const formData = new FormData(event.currentTarget);

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Something went wrong');
      return;
    }

    // Successful login
    router.push("/");
    router.refresh();
  } catch (error) {
    console.error(error);
    setError('An error occurred during login');
  } finally {
    setIsLoading(false);
  }
}

// ...existing code...

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-semibold" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="text-indigo-700 bg-transparent border rounded-lg shadow border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-4 block w-full appearance-none leading-normal"
          placeholder="Enter your email"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-semibold" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="text-indigo-700 bg-transparent border rounded-lg shadow border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-4 block w-full appearance-none leading-normal"
          placeholder="Enter your password"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-400 to-indigo-500 text-black font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-4"
      >
        {isLoading ? "Signing in..." : "Sign in"}
      </button>

      <p className="text-center text-gray-700 mt-4">
        Dont have an account?{" "}
        <Link
          href="/register"
          className="text-indigo-600 hover:text-indigo-500 font-semibold"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}