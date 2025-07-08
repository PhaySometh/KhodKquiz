import AdminProfile from "./AdminProfile";
import { Bell, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function AdminNavbar() {
    const navigate = useNavigate();
    return (
        <>
            {/* Header */}
            <header className="relative z-10 px-6 flex justify-between items-center w-full h-20 bg-white border-b border-gray-200">
                <div className="text-xl font-bold hidden md:block">
                    <h1 className='text-blue-950'>Khod<span className='text-orange-400'>Kquiz</span></h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <button 
                                className="flex items-center space-x-2 focus:outline-none"
                            >
                                <div className="flex items-center gap-4 w-full justify-end">
                                    {/* Sign Up button (only visible on lg and up) */}
                                    <AdminProfile />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
};