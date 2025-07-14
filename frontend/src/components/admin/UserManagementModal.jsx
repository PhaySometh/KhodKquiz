import React, { useState, useEffect } from 'react';
import { X, User, Mail, Shield, Key } from 'lucide-react';

export default function UserManagementModal({
    isOpen,
    onClose,
    onSubmit,
    user,
    roles,
    availablePrivileges,
}) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        privileges: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'student',
                privileges: user.privileges || [],
            });
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'student',
                privileges: [],
            });
        }
        setErrors({});
    }, [user, isOpen]);

    // Update privileges when role changes
    useEffect(() => {
        const selectedRole = roles.find((role) => role.name === formData.role);
        if (selectedRole) {
            setFormData((prev) => ({
                ...prev,
                privileges: selectedRole.privileges,
            }));
        }
    }, [formData.role, roles]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.role) {
            newErrors.role = 'Role is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-xs bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {user ? 'Edit User' : 'Create New User'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded cursor-pointer transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <User size={20} />
                            Basic Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.name
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Enter full name"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email Address{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            email: e.target.value,
                                        }))
                                    }
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.email
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Enter email address"
                                />
                                {errors.email && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Shield size={20} />
                            Role Selection
                        </h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.role}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        role: e.target.value,
                                    }))
                                }
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer ${
                                    errors.role
                                        ? 'border-red-500'
                                        : 'border-gray-300'
                                }`}
                            >
                                {roles.map((role) => (
                                    <option key={role.id} value={role.name}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.role}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Privileges (Read-only, based on role) */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Key size={20} />
                            Role Privileges
                        </h3>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <p className="text-sm text-gray-600 mb-3">
                                Privileges are automatically assigned based on
                                the selected role. To modify privileges, please
                                update the role configuration.
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {formData.privileges.map((privilege) => (
                                    <div
                                        key={privilege}
                                        className="flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded px-3 py-2"
                                    >
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                        <span className="text-sm text-blue-700 font-medium">
                                            {privilege}
                                        </span>
                                    </div>
                                ))}
                                {formData.privileges.length === 0 && (
                                    <div className="col-span-full text-sm text-gray-500 italic">
                                        No privileges assigned to this role
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
                        >
                            {user ? 'Update User' : 'Create User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
