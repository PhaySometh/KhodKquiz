import React from 'react';
import Navbar from '../components/Navbar/NavBar';

export default function Login() {
    return (
        <>
            <div className="w-full">
                <Navbar />
            </div>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-orange-400">
                        Login to Your Account
                    </h2>
                    <form className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                        />
                        <button className="bg-orange-400 text-white py-2 rounded-md hover:bg-blue-950  transition">
                            Login
                        </button>
                    </form>
                    <p className="text-center mt-4 text-sm">
                        Don't have an account?{' '}
                        <a
                            href="/signup"
                            className="text-orange-400 hover:underline"
                        >
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
