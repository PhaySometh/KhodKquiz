import React from 'react';
import NavBar from '../components/NavBar';

export default function SignUp() {
    return (
        <>
            <div className="w-full">
                <NavBar />
            </div>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-green-600">
                        Create an Account
                    </h2>
                    <form className="flex flex-col gap-4">
                        <input
                            type="text"
                            placeholder="Name"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
                        />
                        <button className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition">
                            Sign Up
                        </button>
                    </form>
                    <p className="text-center mt-4 text-sm">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            className="text-green-600 hover:underline"
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
