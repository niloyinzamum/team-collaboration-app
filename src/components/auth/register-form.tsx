"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

// ...existing code...
try {
  const response = await fetch("/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.error || "Registration failed");
  }

  router.push("/login?registered=true");
} catch (err) {
  setError(err instanceof Error ? err.message : "Something went wrong");
} finally {
  setIsLoading(false);
}
// ...existing code...
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="flex flex-col gap-2">
        <label className="text-gray-700 font-semibold" htmlFor="name">
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="text-indigo-700 bg-transparent border rounded-lg shadow border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-4 block w-full appearance-none leading-normal"
          placeholder="Enter your full name"
        />
      </div>

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
          autoComplete="new-password"
          required
          className="text-indigo-700 bg-transparent border rounded-lg shadow border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 py-2 px-4 block w-full appearance-none leading-normal"
          placeholder="Create a password"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-gradient-to-r from-purple-400 to-indigo-500 text-black font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out mt-4"
      >
        {isLoading ? "Creating account..." : "Create account"}
      </button>

      <p className="text-center text-gray-700 mt-4">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-indigo-600 hover:text-indigo-500 font-semibold"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}