import React from 'react';
import NavBar from '../components/NavBar';

export default function Quiz() {
    return (
        <>
            <NavBar />
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Quiz Page</h1>
                <p className="text-lg">This is where the quiz content will go.</p>
                <p className="text-lg">Stay tuned for updates!</p>
            </div>
            <footer className="bg-gray-800 text-white text-center py-4 mt-8">
                <p>&copy; {new Date().getFullYear()} KhodKquiz. All rights reserved.</p>
            </footer>
        </>
    );
}
