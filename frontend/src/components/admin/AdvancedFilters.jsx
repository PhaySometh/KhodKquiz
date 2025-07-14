import React, { useState } from 'react';
import {
    Search,
    Filter,
    Download,
    Upload,
    RefreshCw,
    SortAsc,
    SortDesc,
} from 'lucide-react';

export default function AdvancedFilters({
    searchTerm,
    setSearchTerm,
    selectedRole,
    setSelectedRole,
    selectedStatus,
    setSelectedStatus,
    roles,
    onExport,
    onImport,
    onRefresh,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
}) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const sortOptions = [
        { value: 'name', label: 'Name' },
        { value: 'email', label: 'Email' },
        { value: 'role', label: 'Role' },
        { value: 'status', label: 'Status' },
        { value: 'createdAt', label: 'Created Date' },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                {/* Search and Basic Filters */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            size={20}
                        />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80"
                        />
                    </div>

                    <div className="flex gap-3">
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Roles</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.name}>
                                    {role.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <Filter size={16} />
                        Advanced
                    </button>
                    <button
                        onClick={onRefresh}
                        className="flex items-center gap-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        title="Refresh Data"
                    >
                        <RefreshCw size={16} />
                    </button>
                    <button
                        onClick={onExport}
                        className="flex items-center gap-2 px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Export Users"
                    >
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Sort Options */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort By
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {sortOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={() =>
                                        setSortOrder(
                                            sortOrder === 'asc' ? 'desc' : 'asc'
                                        )
                                    }
                                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    title={`Sort ${
                                        sortOrder === 'asc'
                                            ? 'Descending'
                                            : 'Ascending'
                                    }`}
                                >
                                    {sortOrder === 'asc' ? (
                                        <SortAsc size={16} />
                                    ) : (
                                        <SortDesc size={16} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Created After
                            </label>
                            <input
                                type="date"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>

                        {/* Quick Filters */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Quick Filters
                            </label>
                            <div className="flex flex-wrap gap-2">
                                <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200">
                                    Recent Users
                                </button>
                                <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded-full hover:bg-green-200">
                                    Active Only
                                </button>
                                <button className="px-3 py-1 text-xs bg-purple-100 text-purple-800 rounded-full hover:bg-purple-200">
                                    Teachers
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Active Filters Summary */}
            {(searchTerm ||
                selectedRole !== 'all' ||
                selectedStatus !== 'all') && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-600">
                            Active filters:
                        </span>
                        {searchTerm && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                                Search: "{searchTerm}"
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {selectedRole !== 'all' && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                Role: {selectedRole}
                                <button
                                    onClick={() => setSelectedRole('all')}
                                    className="ml-1 text-green-600 hover:text-green-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {selectedStatus !== 'all' && (
                            <span className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                                Status: {selectedStatus}
                                <button
                                    onClick={() => setSelectedStatus('all')}
                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedRole('all');
                                setSelectedStatus('all');
                            }}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            Clear all filters
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
