import React from 'react';
import NavBar from '../components/NavBar';

export default function Login() {
    return (
        <>
            <div className="w-full">
                <NavBar />
            </div>
            <div className="text-2xl text-red-500 text-center">Welcome to Login Page</div>
        </>
    );
}
