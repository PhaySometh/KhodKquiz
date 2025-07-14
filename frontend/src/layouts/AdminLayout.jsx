import React from 'react';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

export default function AdminLayout({ children }) {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar />
            <div className="w-full overflow-y-auto">
                <AdminNavbar />
                <div className="pt-20 p-6 h-full w-full">{children}</div>
            </div>
        </div>
    );
}
