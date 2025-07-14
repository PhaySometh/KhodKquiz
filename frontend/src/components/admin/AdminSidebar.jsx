import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookCheck, ShieldUser, School } from 'lucide-react';

// The "export default" keywords are what solve the error
export default function AdminSidebar() {
    const location = useLocation();

    const getNavLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive
                ? 'bg-blue-900 text-white hover:bg-blue-800 hover:text-white'
                : 'text-blue-100 hover:bg-blue-800 hover:text-white'
        }`;
    };
    return (
        <aside className="w-64 h-screen bg-blue-950 text-white flex flex-col relative z-40">
            <div className="p-6 text-2xl font-bold border-b border-blue-900 flex items-center justify-center">
                <Link to="/">
                    Khod<span className="text-orange-400">Kquiz</span>
                </Link>
            </div>
            <nav className="flex flex-col p-4 space-y-2">
                <Link to="/admin" className={getNavLinkClass('/admin')}>
                    <ShieldUser size={20} />
                    <span>Admin Portal</span>
                </Link>
                <Link
                    to="/admin/quizzes"
                    className={getNavLinkClass('/admin/quizzes')}
                >
                    <BookCheck size={20} />
                    <span>My Quizzes</span>
                </Link>
                <Link
                    to="/admin/teacher-requests"
                    className={getNavLinkClass('/admin/teacher-requests')}
                >
                    <School size={20} />
                    <span>Teacher Requests</span>
                </Link>
            </nav>
        </aside>
    );
}
