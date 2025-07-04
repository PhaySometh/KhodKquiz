import Navbar from '../components/Navbar/NavBar';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

export default function SignUp() {
    const navigate = useNavigate();

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
                    <h2 className="text-2xl font-semibold mb-6 text-center text-orange-400">
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
                        <button className="bg-orange-400 text-white py-2 rounded-md hover:bg-green-700 transition">
                            Sign Up
                        </button>
                        <GoogleLogin
                        onSuccess={handleLoginSuccess}
                        onError={() => {
                            console.log('Login Failed');
                        }}
                        />
                    </form>
                    <p className="text-center mt-4 text-sm">
                        Already have an account?{' '}
                        <a
                            href="/login"
                            className="text-orange-400 hover:underline"
                        >
                            Login
                        </a>
                    </p>
                </div>
            </div>
        </>
    );
}
