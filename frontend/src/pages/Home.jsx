import React from 'react';
import NavBar from '../components/NavBar';

export default function Home() {
    return (
        <>
            <div className="w-full bg-white">
              <NavBar />
            </div>
            <div className="text-2xl text-red-500 text-center mt-5">សូមស្វាគមន៍មកកាន់កូដខ្វីស</div>
        </>
    );
}
