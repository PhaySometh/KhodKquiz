import React from 'react';
import Navbar from '../components/Navbar/NavBar';
import { GoogleLogin } from '@react-oauth/google';

export default function Login() {
    const handleLoginSuccess = async (credentialResponse) => {
        try {
            const user = await axios.post(`${BASE_URL}/api/user/auth/google-login`, { token: credentialResponse.credential });

            if (user.data.token) {
                localStorage.setItem('userToken', user.data.token);
                navigate('/user');
            } else {
                console.error('Login failed: No token received:', user.data.error);
            }
        } catch (error) {
            console.error('Error during Google login:', error);
        }
    }

    return (
        <>
            <div className="w-full">
                <Navbar />
            </div>
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-semibold mb-6 text-center text-blue-950">
                        Login to Your Account
                    </h2>
                    <form className="flex flex-col gap-4">
                        <input
                            type="email"
                            placeholder="Email"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-950"
                        />
                        <button className="bg-blue-950 text-white py-2 rounded-md hover:bg-orange-400 hover:cursor-pointer transition">
                            Login
                        </button>
                        <div className='flex justify-center items-center'>
                            <div>
                                <GoogleLogin
                                onSuccess={handleLoginSuccess}
                                onError={() => {
                                    console.log('Login Failed');
                                }}
                                />
                            </div>
                        </div>
                    </form>
                    <p className="text-center mt-4 text-sm">
                        Don't have an account?{' '}
                        <a
                            href="/signup"
                            className="text-blue-950 font-bold hover:underline"
                        >
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
