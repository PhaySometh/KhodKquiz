import AdminProfile from './AdminProfile';
import { Bell, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AdminNavbar() {
    const navigate = useNavigate();
    return (
        <>
            {/* Header */}
            <header className="relative z-10 px-6 flex justify-between items-center w-full h-20 bg-white border-b border-gray-200">
                <div className="text-xl font-bold hidden md:block">
                    <h1 className="text-blue-950">
                        Admin <span className="text-orange-400">Dashboard</span>
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="relative">
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center gap-4 w-full justify-end">
                                    {/* Admin Profile with dropdown */}
                                    <AdminProfile />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
}
