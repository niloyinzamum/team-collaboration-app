import { Metadata } from "next";
import { LoginForm } from "../../../components/auth/login-form";


export const metadata: Metadata = {
  title: "Login | Team Collaboration",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <div className="bg-gradient-to-r from-blue-300 to-purple-500 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8 bg-white bg-opacity-30 rounded-lg shadow-lg backdrop-blur-xl backdrop-filter">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Welcome Back
        </h1>
        <p className="text-center text-gray-700 mb-8">
          Sign in to your account
        </p>
        <LoginForm />
      </div>
    </div>
  );
}