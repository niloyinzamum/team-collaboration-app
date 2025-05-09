import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register | Team Collaboration",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <div className="bg-gradient-to-r from-blue-300 to-purple-500 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-30 rounded-lg shadow-lg backdrop-blur-xl backdrop-filter">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Account
        </h1>
        <p className="text-center text-gray-700 mb-8">
          Join our team collaboration platform
        </p>
        <RegisterForm />
      </div>
    </div>
  );
}