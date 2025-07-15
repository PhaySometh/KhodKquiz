import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    UserPlus,
    Settings,
    Shield,
    Edit,
    Trash2,
    Eye,
    BarChart3,
} from 'lucide-react';
import UserManagementModal from '../../components/admin/UserManagementModal';
import RolePrivilegesEditor from '../../components/admin/RoleManagementModal.jsx';
import AdminStatsDashboard from '../../components/admin/AdminStatsDashboard';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import axios from '../../utils/axiosConfig';
import toast from 'react-hot-toast';

// Mock data for demonstration
const MOCK_USERS = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'student',
        status: 'active',
        createdAt: '2024-01-15',
        privileges: ['read_quiz', 'take_quiz'],
    },
    {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'teacher',
        status: 'active',
        createdAt: '2024-01-10',
        privileges: [
            'read_quiz',
            'create_quiz',
            'edit_quiz',
            'manage_students',
        ],
    },
    {
        id: 3,
        name: 'Bob Wilson',
        email: 'bob@example.com',
        role: 'student',
        status: 'inactive',
        createdAt: '2024-01-20',
        privileges: ['read_quiz'],
    },
    {
        id: 4,
        name: 'Alice Johnson',
        email: 'alice@example.com',
        role: 'moderator',
        status: 'active',
        createdAt: '2024-01-05',
        privileges: ['read_quiz', 'moderate_content', 'manage_users'],
    },
];

const MOCK_ROLES = [
    {
        id: 1,
        name: 'students',
        description: 'Basic student access to take quizzes',
        privileges: ['read_quiz', 'take_quiz', 'view_results'],
        userCount: 150,
    },
    {
        id: 2,
        name: 'teachers',
        description: 'Educator with quiz creation and management capabilities',
        privileges: [
            'read_quiz',
            'create_quiz',
            'edit_quiz',
            'manage_students',
            'view_analytics',
        ],
        userCount: 25,
    },
];

const AVAILABLE_PRIVILEGES = [
    'read_quiz',
    'take_quiz',
    'create_quiz',
    'edit_quiz',
    'delete_quiz',
    'manage_students',
    'manage_users',
    'moderate_content',
    'view_analytics',
    'view_reports',
    'view_results',
    'all_privileges',
];

const BASE_URL = 'http://localhost:3000';

export default function AdminGrantAccess() {
    const [users, setUsers] = useState(MOCK_USERS);
    const [roles, setRoles] = useState(MOCK_ROLES);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'users', or 'roles'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showViewRole, setShowViewRole] = useState(false);
    const [viewRole, setViewRole] = useState(null);

    // Modal states
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [editingRole, setEditingRole] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        action: null,
        target: null,
    });

    // Filter and sort users based on search and filters
    const filteredUsers = users
        .filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesRole =
                selectedRole === 'all' || user.role === selectedRole;
            const matchesStatus =
                selectedStatus === 'all' || user.status === selectedStatus;

            return matchesSearch && matchesRole && matchesStatus;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

    const handleCreateUser = (userData) => {
        const newUser = {
            id: users.length + 1,
            ...userData,
            createdAt: new Date().toISOString().split('T')[0],
            status: 'active',
        };
        setUsers([...users, newUser]);
        setIsUserModalOpen(false);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleUpdateUser = (userData) => {
        setUsers(
            users.map((user) =>
                user.id === editingUser.id ? { ...user, ...userData } : user
            )
        );
        setEditingUser(null);
        setIsUserModalOpen(false);
    };

    const handleDeleteUser = (userId) => {
        setConfirmDialog({
            isOpen: true,
            action: 'delete-user',
            target: userId,
            title: 'Delete User',
            message:
                'Are you sure you want to delete this user? This action cannot be undone.',
        });
    };

    const handleCreateRole = (roleData) => {
        const newRole = {
            id: roles.length + 1,
            ...roleData,
            userCount: 0,
        };
        setRoles([...roles, newRole]);
        setIsRoleModalOpen(false);
    };

    // const handleEditRole = (role) => {
    //     setEditingRole(role);
    //     setIsRoleModalOpen(true);
    // };

    const handleUpdateRole = (roleData) => {
        setRoles(
            roles.map((role) =>
                role.id === editingRole.id ? { ...role, ...roleData } : role
            )
        );
        setEditingRole(null);
        setIsRoleModalOpen(false);
    };

    // const handleDeleteRole = (roleId) => {
    //     setConfirmDialog({
    //         isOpen: true,
    //         action: 'delete-role',
    //         target: roleId,
    //         title: 'Delete Role',
    //         message:
    //             'Are you sure you want to delete this role? All users with this role will need to be reassigned.',
    //     });
    // };

    const handleViewRole = (role) => {
        setShowViewRole(true);
        setViewRole(role);
    };

    const handleConfirmAction = () => {
        if (confirmDialog.action === 'delete-user') {
            setUsers(users.filter((user) => user.id !== confirmDialog.target));
        } else if (confirmDialog.action === 'delete-role') {
            setRoles(roles.filter((role) => role.id !== confirmDialog.target));
        }
        setConfirmDialog({ isOpen: false, action: null, target: null });
    };

    const handleExportUsers = () => {
        const csvContent = [
            ['Name', 'Email', 'Role', 'Created', 'Privileges'].join(','),
            ...filteredUsers.map((user) =>
                [
                    user.name,
                    user.email,
                    user.role,
                    user.createdAt,
                    user.privileges.join(';'),
                ].join(',')
            ),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `khodkquiz_users_${
            new Date().toISOString().split('T')[0]
        }.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handleRefreshData = () => {
        // Placeholder for refresh functionality
        console.log('Refreshing data...');
    };

    const getRoleColor = (role) => {
        const colors = {
            admin: 'bg-red-100 text-red-800',
            moderator: 'bg-purple-100 text-purple-800',
            teacher: 'bg-blue-100 text-blue-800',
            student: 'bg-green-100 text-green-800',
        };
        return colors[role] || 'bg-gray-100 text-gray-800';
    };

    const getStatusColor = (status) => {
        return status === 'active'
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar />
            <div className="w-full overflow-y-auto">
                <AdminNavbar />
                <div className="p-6 h-full w-full">
                    {/* Tab Navigation */}
                    <div className="mb-6">
                        <div className="border-b border-gray-200">
                            <nav className="-mb-px flex space-x-8">
                                <button
                                    onClick={() => setCurrentView('dashboard')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        currentView === 'dashboard'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <BarChart3 size={16} />
                                        Dashboard
                                    </div>
                                </button>
                                <button
                                    onClick={() => setCurrentView('users')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        currentView === 'users'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Shield size={16} />
                                        User Management
                                    </div>
                                </button>
                                <button
                                    onClick={() => setCurrentView('roles')}
                                    className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                        currentView === 'roles'
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Settings size={16} />
                                        Role Management
                                    </div>
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Dashboard View */}
                    {currentView === 'dashboard' && (
                        <>
                            <AdminStatsDashboard />
                        </>
                    )}

                    {/* Users View */}
                    {currentView === 'users' && (
                        <>
                            {/* Simple Search */}
                            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                                <div className="relative flex-1 max-w-md">
                                    <Search
                                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                        size={20}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={selectedRole}
                                        onChange={(e) =>
                                            setSelectedRole(e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                                    >
                                        <option value="">All Roles</option>
                                        {roles.map((role) => (
                                            <option
                                                key={role.id}
                                                value={role.name}
                                            >
                                                {role.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Create User Button */}
                            <div className="mb-6 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        User Management
                                    </h2>
                                    <p className="text-gray-600">
                                        Showing {filteredUsers.length} of{' '}
                                        {users.length} users
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsUserModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
                                >
                                    <UserPlus size={20} />
                                    Create User
                                </button>
                            </div>

                            {/* Users Table */}
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Privileges
                                                </th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredUsers.map((user) => (
                                                <tr
                                                    key={user.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.name}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(
                                                                user.role
                                                            )}`}
                                                        >
                                                            {user.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {user.createdAt}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-wrap gap-1">
                                                            {(() => {
                                                                const userRole =
                                                                    roles.find(
                                                                        (
                                                                            role
                                                                        ) =>
                                                                            role.name ===
                                                                            user.role
                                                                    );
                                                                const rolePrivileges =
                                                                    userRole
                                                                        ? userRole.privileges
                                                                        : [];
                                                                return rolePrivileges
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (
                                                                            privilege
                                                                        ) => (
                                                                            <span
                                                                                key={
                                                                                    privilege
                                                                                }
                                                                                className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded font-medium"
                                                                            >
                                                                                {
                                                                                    privilege
                                                                                }
                                                                            </span>
                                                                        )
                                                                    );
                                                            })()}
                                                            {(() => {
                                                                const userRole =
                                                                    roles.find(
                                                                        (
                                                                            role
                                                                        ) =>
                                                                            role.name ===
                                                                            user.role
                                                                    );
                                                                const rolePrivileges =
                                                                    userRole
                                                                        ? userRole.privileges
                                                                        : [];
                                                                return (
                                                                    rolePrivileges.length >
                                                                        2 && (
                                                                        <span className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded font-medium">
                                                                            +
                                                                            {rolePrivileges.length -
                                                                                2}{' '}
                                                                            more
                                                                        </span>
                                                                    )
                                                                );
                                                            })()}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditUser(
                                                                        user
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded cursor-pointer transition-colors"
                                                                title="Edit User"
                                                            >
                                                                <Edit
                                                                    size={16}
                                                                />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleDeleteUser(
                                                                        user.id
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900 p-1 rounded cursor-pointer transition-colors"
                                                                title="Delete User"
                                                            >
                                                                <Trash2
                                                                    size={16}
                                                                />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Roles View */}
                    {currentView === 'roles' && (
                        <>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">
                                        Role Management
                                    </h2>
                                    <p className="text-gray-600">
                                        Define and manage roles with specific
                                        privileges
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsRoleModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Settings size={20} />
                                    Create Role
                                </button>
                            </div>

                            {/* Roles Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {roles.map((role) => (
                                    <div
                                        key={role.id}
                                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 capitalize">
                                                    {role.name}
                                                </h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {role.description}
                                                </p>
                                                <p className="text-sm text-blue-600 mt-2">
                                                    {role.userCount} users
                                                    assigned
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleViewRole(role)
                                                    }
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded"
                                                    title="View Role"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* <div>
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                                                Privileges:
                                            </h4>
                                            <div className="flex flex-wrap gap-1">
                                                {role.privileges.map(
                                                    (privilege) => (
                                                        <span
                                                            key={privilege}
                                                            className="inline-flex px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                                        >
                                                            {privilege}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div> */}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Modals */}
                    <UserManagementModal
                        isOpen={isUserModalOpen}
                        onClose={() => {
                            setIsUserModalOpen(false);
                            setEditingUser(null);
                        }}
                        onSubmit={
                            editingUser ? handleUpdateUser : handleCreateUser
                        }
                        user={editingUser}
                        roles={roles}
                    />

                    {showViewRole && (
                        <RolePrivilegesEditor
                            isOpen={showViewRole}
                            onClose={() => setShowViewRole(false)}
                            roleName={viewRole.name}
                        />
                    )}

                    <ConfirmationDialog
                        isOpen={confirmDialog.isOpen}
                        onClose={() =>
                            setConfirmDialog({
                                isOpen: false,
                                action: null,
                                target: null,
                            })
                        }
                        onConfirm={handleConfirmAction}
                        title={confirmDialog.title}
                        message={confirmDialog.message}
                    />
                </div>
            </div>
        </div>
    );
}