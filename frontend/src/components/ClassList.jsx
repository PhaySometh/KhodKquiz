import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Plus, ChevronDown } from 'lucide-react';
import ClassCard from './ClassCard';

const ClassList = ({ 
    onCreateClass,
    onEditClass,
    onViewClass,
    onDeleteClass,
    onDuplicateClass,
    onManageStudents,
    onViewAnalytics
}) => {
    const [classes, setClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);

    // Mock data - replace with actual API call
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockClasses = [
                {
                    id: 1,
                    name: "Computer Science 101",
                    description: "Introduction to programming concepts and computer science fundamentals.",
                    subject: "Computer Science",
                    isActive: true,
                    studentCount: 25,
                    assignedQuizzes: 8,
                    createdAt: "2024-01-15T10:00:00Z",
                    updatedAt: "2024-01-20T14:30:00Z"
                },
                {
                    id: 2,
                    name: "Web Development Bootcamp",
                    description: "Intensive course covering HTML, CSS, JavaScript, and modern web frameworks.",
                    subject: "Web Development",
                    isActive: true,
                    studentCount: 18,
                    assignedQuizzes: 12,
                    createdAt: "2024-01-18T09:15:00Z",
                    updatedAt: "2024-01-22T11:20:00Z"
                },
                {
                    id: 3,
                    name: "Advanced JavaScript",
                    description: "Deep dive into JavaScript ES6+, async programming, and advanced concepts.",
                    subject: "JavaScript",
                    isActive: true,
                    studentCount: 12,
                    assignedQuizzes: 6,
                    createdAt: "2024-01-10T16:45:00Z",
                    updatedAt: "2024-01-15T08:45:00Z"
                },
                {
                    id: 4,
                    name: "Python for Beginners",
                    description: "Learn Python programming from scratch with hands-on projects.",
                    subject: "Python",
                    isActive: false,
                    studentCount: 30,
                    assignedQuizzes: 4,
                    createdAt: "2023-12-05T13:30:00Z",
                    updatedAt: "2024-01-10T10:15:00Z"
                }
            ];
            setClasses(mockClasses);
            setFilteredClasses(mockClasses);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = classes;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(classItem =>
                classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                classItem.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                classItem.subject.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(classItem => 
                statusFilter === 'active' ? classItem.isActive : !classItem.isActive
            );
        }

        // Apply subject filter
        if (subjectFilter !== 'all') {
            filtered = filtered.filter(classItem => classItem.subject === subjectFilter);
        }

        setFilteredClasses(filtered);
    }, [classes, searchQuery, statusFilter, subjectFilter]);

    const subjects = [...new Set(classes.map(classItem => classItem.subject))];
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' }
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Search and Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-blue-950">My Classes</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {filteredClasses.length} class{filteredClasses.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            placeholder="Search classes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Filter Toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                            showFilters ? 'bg-blue-50 border-blue-300 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                        }`}
                    >
                        <Filter size={16} />
                        Filters
                        <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                    </button>

                    {/* View Mode Toggle */}
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <Grid size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>

                    {/* Create Class Button */}
                    <button
                        onClick={onCreateClass}
                        className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                    >
                        <Plus size={16} />
                        Create Class
                    </button>
                </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {statusOptions.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Subject Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                                <select
                                    value={subjectFilter}
                                    onChange={(e) => setSubjectFilter(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Subjects</option>
                                    {subjects.map(subject => (
                                        <option key={subject} value={subject}>
                                            {subject}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Clear Filters */}
                            <div className="flex items-end">
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setStatusFilter('all');
                                        setSubjectFilter('all');
                                    }}
                                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Class Grid/List */}
            <AnimatePresence mode="wait">
                {filteredClasses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No classes found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery || statusFilter !== 'all' || subjectFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Create your first class to get started'
                            }
                        </p>
                        <button
                            onClick={onCreateClass}
                            className="inline-flex items-center gap-2 bg-blue-950 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
                        >
                            <Plus size={16} />
                            Create Your First Class
                        </button>
                    </motion.div>
                ) : (
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className={viewMode === 'grid' 
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                            : 'space-y-4'
                        }
                    >
                        {filteredClasses.map((classItem) => (
                            <ClassCard
                                key={classItem.id}
                                classItem={classItem}
                                onEdit={onEditClass}
                                onView={onViewClass}
                                onDelete={onDeleteClass}
                                onDuplicate={onDuplicateClass}
                                onManageStudents={onManageStudents}
                                onViewAnalytics={onViewAnalytics}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ClassList;
