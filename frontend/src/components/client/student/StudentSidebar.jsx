// frontend/src/components/NavBarDashBoard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, BookCheck, Settings } from 'lucide-react';

// The "export default" keywords are what solve the error
export default function StudentSidebar() {
    return (
        <aside className="w-64 h-screen bg-blue-950 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-blue-900">
                <Link to="/dashboard">KhodKquiz</Link>
            </div>
            <nav className="flex flex-col p-4">
                <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <LayoutDashboard size={20} />
                    <span>Dashboard</span>
                </Link>
                <Link
                    to="/leaderboard"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <BarChart3 size={20} />
                    <span>Leaderboard</span>
                </Link>
                <Link
                    to="/teacher/classes"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <LayoutDashboard size={20} />
                    <span>My Classes</span>
                </Link>
                <Link
                    to="/teacher/quizzes"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <BookCheck size={20} />
                    <span>My Quizzes</span>
                </Link>
                <Link
                    to="/profile"
                    className="flex items-center gap-3 px-4 py-3 mt-auto rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <Settings size={20} />
                    <span>Profile</span>
                </Link>
            </nav>
        </aside>
    );
}