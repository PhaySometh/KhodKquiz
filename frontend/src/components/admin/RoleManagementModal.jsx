import React, { useState, useEffect } from 'react';
import { X, Settings, Shield, Key, AlertCircle } from 'lucide-react';

export default function RoleManagementModal({
    isOpen,
    onClose,
    onSubmit,
    role,
    availablePrivileges,
}) {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        privileges: [],
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (role) {
            setFormData({
                name: role.name || '',
                description: role.description || '',
                privileges: role.privileges || [],
            });
        } else {
            setFormData({
                name: '',
                description: '',
                privileges: [],
            });
        }
        setErrors({});
    }, [role, isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Role name is required';
        } else if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(formData.name)) {
            newErrors.name =
                'Role name must be alphanumeric and start with a letter';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (formData.privileges.length === 0) {
            newErrors.privileges = 'At least one privilege must be selected';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit({
                ...formData,
                name: formData.name.toLowerCase(),
            });
        }
    };

    const handlePrivilegeToggle = (privilege) => {
        setFormData((prev) => ({
            ...prev,
            privileges: prev.privileges.includes(privilege)
                ? prev.privileges.filter((p) => p !== privilege)
                : [...prev.privileges, privilege],
        }));
    };

    const handleSelectAllPrivileges = () => {
        setFormData((prev) => ({
            ...prev,
            privileges: availablePrivileges,
        }));
    };

    const handleClearAllPrivileges = () => {
        setFormData((prev) => ({
            ...prev,
            privileges: [],
        }));
    };

    const getPrivilegeCategory = (privilege) => {
        const categories = {
            'Quiz Management': [
                'read_quiz',
                'create_quiz',
                'edit_quiz',
                'delete_quiz',
                'take_quiz',
            ],
            'User Management': ['manage_users', 'manage_students'],
            'Content Moderation': ['moderate_content'],
            'Analytics & Reporting': [
                'view_analytics',
                'view_reports',
                'view_results',
            ],
            'System Administration': ['all_privileges'],
        };

        for (const [category, privileges] of Object.entries(categories)) {
            if (privileges.includes(privilege)) {
                return category;
            }
        }
        return 'Other';
    };

    const groupedPrivileges = availablePrivileges.reduce((acc, privilege) => {
        const category = getPrivilegeCategory(privilege);
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(privilege);
        return acc;
    }, {});

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {role ? 'Edit Role' : 'Create New Role'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 p-1 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Settings size={20} />
                            Role Information
                        </h3>

                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role Name *
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
                                    placeholder="e.g., teacher, moderator, admin"
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.name}
                                    </p>
                                )}
                                <p className="text-gray-500 text-xs mt-1">
                                    Use lowercase letters, numbers, and
                                    underscores only
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description *
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: e.target.value,
                                        }))
                                    }
                                    rows={3}
                                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.description
                                            ? 'border-red-500'
                                            : 'border-gray-300'
                                    }`}
                                    placeholder="Describe the role's purpose and responsibilities"
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Privileges */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                                <Key size={20} />
                                Privileges
                            </h3>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleSelectAllPrivileges}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Select All
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearAllPrivileges}
                                    className="text-sm text-gray-600 hover:text-gray-800"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>

                        {errors.privileges && (
                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle size={16} />
                                {errors.privileges}
                            </div>
                        )}

                        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                            {Object.entries(groupedPrivileges).map(
                                ([category, privileges]) => (
                                    <div key={category} className="space-y-2">
                                        <h4 className="font-medium text-gray-900 text-sm border-b border-gray-200 pb-1">
                                            {category}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {privileges.map((privilege) => (
                                                <label
                                                    key={privilege}
                                                    className="flex items-center space-x-2"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={formData.privileges.includes(
                                                            privilege
                                                        )}
                                                        onChange={() =>
                                                            handlePrivilegeToggle(
                                                                privilege
                                                            )
                                                        }
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {privilege.replace(
                                                            /_/g,
                                                            ' '
                                                        )}
                                                    </span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Selected Privileges Summary */}
                        {formData.privileges.length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-4">
                                <h4 className="text-sm font-medium text-blue-900 mb-2">
                                    Selected Privileges (
                                    {formData.privileges.length}):
                                </h4>
                                <div className="flex flex-wrap gap-1">
                                    {formData.privileges.map((privilege) => (
                                        <span
                                            key={privilege}
                                            className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded"
                                        >
                                            {privilege.replace(/_/g, ' ')}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePrivilegeToggle(
                                                        privilege
                                                    )
                                                }
                                                className="ml-1 text-blue-600 hover:text-blue-800"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Role Preview */}
                    {formData.name && formData.description && (
                        <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                                <Shield size={16} />
                                Role Preview:
                            </h4>
                            <div className="space-y-1 text-sm text-green-800">
                                <p>
                                    <strong>Name:</strong> {formData.name}
                                </p>
                                <p>
                                    <strong>Description:</strong>{' '}
                                    {formData.description}
                                </p>
                                <p>
                                    <strong>Privileges:</strong>{' '}
                                    {formData.privileges.length} assigned
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            {role ? 'Update Role' : 'Create Role'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
