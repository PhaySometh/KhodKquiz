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
import AdminStatsDashboard from '../../components/admin/AdminStatsDashboard';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import axios from '../../utils/axiosConfig';
import toast from 'react-hot-toast';

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
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'users', or 'roles'
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showViewRole, setShowViewRole] = useState(false);
    const [viewRole, setViewRole] = useState(null);

    // Loading and pagination states
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalUsers: 0,
        limit: 10,
    });

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

    // Fetch users from API
    const fetchUsers = async (
        page = 1,
        search = '',
        role = '',
        sortBy = 'createdAt',
        sortOrder = 'DESC'
    ) => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: pagination.limit.toString(),
                sortBy,
                sortOrder,
            });

            if (search) params.append('search', search);
            if (role && role !== 'all') params.append('role', role);

            const response = await axios.get(
                `${BASE_URL}/api/admin/users?${params}`
            );

            if (response.data.success) {
                setUsers(response.data.data.users);
                setPagination(response.data.data.pagination);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    // Load users on component mount and when filters change
    useEffect(() => {
        fetchUsers(
            pagination.currentPage,
            searchTerm,
            selectedRole,
            sortBy,
            sortOrder
        );
    }, [pagination.currentPage, searchTerm, selectedRole, sortBy, sortOrder]);

    // Debounce search to avoid too many API calls
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (pagination.currentPage !== 1) {
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
            } else {
                fetchUsers(1, searchTerm, selectedRole, sortBy, sortOrder);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Since we're using server-side filtering and sorting, we don't need client-side filtering
    const filteredUsers = users;

    const handleCreateUser = async (userData) => {
        try {
            setLoading(true);
            const response = await axios.post(
                `${BASE_URL}/api/admin/users`,
                userData
            );

            if (response.data.success) {
                toast.success('User created successfully');
                setIsUserModalOpen(false);
                fetchUsers(
                    pagination.currentPage,
                    searchTerm,
                    selectedRole,
                    sortBy,
                    sortOrder
                );
            }
        } catch (error) {
            console.error('Error creating user:', error);
            toast.error(
                error.response?.data?.message || 'Failed to create user'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsUserModalOpen(true);
    };

    const handleUpdateUserRole = async (userId, newRole) => {
        try {
            setLoading(true);
            const response = await axios.put(
                `${BASE_URL}/api/admin/users/${userId}/role`,
                {
                    role: newRole,
                }
            );

            if (response.data.success) {
                toast.success(`User role updated to ${newRole} successfully`);
                fetchUsers(
                    pagination.currentPage,
                    searchTerm,
                    selectedRole,
                    sortBy,
                    sortOrder
                );
            }
        } catch (error) {
            console.error('Error updating user role:', error);
            toast.error(
                error.response?.data?.message || 'Failed to update user role'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUser = (userData) => {
        if (userData.role && userData.role !== editingUser.role) {
            handleUpdateUserRole(editingUser.id, userData.role);
        }
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

    const confirmDeleteUser = async (userId) => {
        try {
            setLoading(true);
            const response = await axios.delete(
                `${BASE_URL}/api/admin/users/${userId}`
            );

            if (response.data.success) {
                toast.success('User deleted successfully');
                fetchUsers(
                    pagination.currentPage,
                    searchTerm,
                    selectedRole,
                    sortBy,
                    sortOrder
                );
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error(
                error.response?.data?.message || 'Failed to delete user'
            );
        } finally {
            setLoading(false);
        }
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
            confirmDeleteUser(confirmDialog.target);
        } else if (confirmDialog.action === 'delete-role') {
            setRoles(roles.filter((role) => role.id !== confirmDialog.target));
        }
        setConfirmDialog({ isOpen: false, action: null, target: null });
    };

    const handleExportUsers = () => {
        const csvContent = [
            ['Name', 'Email', 'Role', 'Provider', 'Created'].join(','),
            ...filteredUsers.map((user) =>
                [
                    user.name,
                    user.email,
                    user.role,
                    user.provider,
                    new Date(user.createdAt).toLocaleDateString(),
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
        fetchUsers(
            pagination.currentPage,
            searchTerm,
            selectedRole,
            sortBy,
            sortOrder
        );
        toast.success('Data refreshed');
    };

    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    const handleSortChange = (newSortBy) => {
        const newSortOrder =
            sortBy === newSortBy && sortOrder === 'ASC' ? 'DESC' : 'ASC';
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
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

                    {/* Role privileges editor removed - RBAC is now handled at application level */}

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
