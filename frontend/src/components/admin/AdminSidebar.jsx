// frontend/src/components/NavBarDashBoard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, BarChart3, BookCheck, Settings } from 'lucide-react';

// The "export default" keywords are what solve the error
export default function AdminSidebar() {
    return (
        <aside className="w-64 h-screen bg-blue-950 text-white flex flex-col">
            <div className="p-6 text-2xl font-bold border-b border-blue-900">
                <Link to="/">KhodKquiz</Link>
            </div>
            <nav className="flex flex-col p-4">
                <Link
                    to="/admin/quizzes"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <BookCheck size={20} />
                    <span>My Quizzes</span>
                </Link>
                <Link
                    to="/admin/category"
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition-colors"
                >
                    <BookCheck size={20} />
                    <span>My Category</span>
                </Link>
            </nav>
        </aside>
    );
}