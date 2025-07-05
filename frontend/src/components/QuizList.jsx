import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Grid, List, Plus, ChevronDown } from 'lucide-react';
import QuizCard from './QuizCard';

const QuizList = ({ 
    onCreateQuiz,
    onEditQuiz,
    onPreviewQuiz,
    onDeleteQuiz,
    onDuplicateQuiz,
    onAssignToClass,
    onArchiveQuiz
}) => {
    const [quizzes, setQuizzes] = useState([]);
    const [filteredQuizzes, setFilteredQuizzes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(true);

    // Mock data - replace with actual API call
    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockQuizzes = [
                {
                    id: 1,
                    title: "JavaScript Fundamentals",
                    description: "Test your knowledge of JavaScript basics including variables, functions, and control structures.",
                    category: "JavaScript",
                    status: "published",
                    time: 30,
                    questionCount: 15,
                    assignedClasses: 3,
                    createdAt: "2024-01-15T10:00:00Z",
                    updatedAt: "2024-01-20T14:30:00Z"
                },
                {
                    id: 2,
                    title: "Python Data Structures",
                    description: "Comprehensive quiz on Python lists, dictionaries, sets, and tuples.",
                    category: "Python",
                    status: "draft",
                    time: 45,
                    questionCount: 20,
                    assignedClasses: 0,
                    createdAt: "2024-01-18T09:15:00Z",
                    updatedAt: "2024-01-18T09:15:00Z"
                },
                {
                    id: 3,
                    title: "HTML & CSS Basics",
                    description: "Essential web development concepts covering HTML structure and CSS styling.",
                    category: "Web Development",
                    status: "published",
                    time: 25,
                    questionCount: 12,
                    assignedClasses: 2,
                    createdAt: "2024-01-10T16:45:00Z",
                    updatedAt: "2024-01-22T11:20:00Z"
                },
                {
                    id: 4,
                    title: "React Components",
                    description: "Advanced React concepts including hooks, state management, and component lifecycle.",
                    category: "React",
                    status: "archived",
                    time: 60,
                    questionCount: 25,
                    assignedClasses: 1,
                    createdAt: "2023-12-05T13:30:00Z",
                    updatedAt: "2024-01-15T08:45:00Z"
                }
            ];
            setQuizzes(mockQuizzes);
            setFilteredQuizzes(mockQuizzes);
            setLoading(false);
        }, 1000);
    }, []);

    // Filter and search logic
    useEffect(() => {
        let filtered = quizzes;

        // Apply search filter
        if (searchQuery) {
            filtered = filtered.filter(quiz =>
                quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quiz.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                quiz.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(quiz => quiz.status === statusFilter);
        }

        // Apply category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(quiz => quiz.category === categoryFilter);
        }

        setFilteredQuizzes(filtered);
    }, [quizzes, searchQuery, statusFilter, categoryFilter]);

    const categories = [...new Set(quizzes.map(quiz => quiz.category))];
    const statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'draft', label: 'Draft' },
        { value: 'published', label: 'Published' },
        { value: 'archived', label: 'Archived' }
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
                    <h2 className="text-2xl font-bold text-blue-950">My Quizzes</h2>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {filteredQuizzes.length} quiz{filteredQuizzes.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                            placeholder="Search quizzes..."
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

                    {/* Create Quiz Button */}
                    <button
                        onClick={onCreateQuiz}
                        className="flex items-center gap-2 bg-blue-950 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors"
                    >
                        <Plus size={16} />
                        Create Quiz
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

                            {/* Category Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                <select
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
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
                                        setCategoryFilter('all');
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

            {/* Quiz Grid/List */}
            <AnimatePresence mode="wait">
                {filteredQuizzes.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12"
                    >
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
                        <p className="text-gray-500 mb-4">
                            {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                                ? 'Try adjusting your search or filters'
                                : 'Create your first quiz to get started'
                            }
                        </p>
                        <button
                            onClick={onCreateQuiz}
                            className="inline-flex items-center gap-2 bg-blue-950 text-white px-6 py-3 rounded-lg hover:bg-blue-900 transition-colors"
                        >
                            <Plus size={16} />
                            Create Your First Quiz
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
                        {filteredQuizzes.map((quiz) => (
                            <QuizCard
                                key={quiz.id}
                                quiz={quiz}
                                onEdit={onEditQuiz}
                                onPreview={onPreviewQuiz}
                                onDelete={onDeleteQuiz}
                                onDuplicate={onDuplicateQuiz}
                                onAssignToClass={onAssignToClass}
                                onArchive={onArchiveQuiz}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default QuizList;
