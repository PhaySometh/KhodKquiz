import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Edit, 
    Trash2, 
    Copy, 
    Users, 
    Clock, 
    Calendar,
    MoreVertical,
    BookOpen,
    CheckCircle,
    AlertCircle,
    Archive
} from 'lucide-react';

const QuizCard = ({ 
    quiz, 
    onEdit, 
    onDelete, 
    onDuplicate, 
    onAssignToClass,
    onArchive 
}) => {
    const [showActions, setShowActions] = useState(false);

    const getStatusColor = (status) => {
        switch (status) {
            case 'published':
                return 'text-green-600 bg-green-100';
            case 'draft':
                return 'text-orange-600 bg-orange-100';
            case 'archived':
                return 'text-gray-600 bg-gray-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'published':
                return <CheckCircle size={14} />;
            case 'draft':
                return <AlertCircle size={14} />;
            case 'archived':
                return <Archive size={14} />;
            default:
                return <AlertCircle size={14} />;
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 relative"
        >
            {/* Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(quiz.status)}`}>
                    {getStatusIcon(quiz.status)}
                    {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                </span>
                
                {/* Actions Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowActions(!showActions)}
                        className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <MoreVertical size={16} className="text-gray-500" />
                    </button>
                    
                    {showActions && (
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        onEdit(quiz);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit size={14} />
                                    Edit Quiz
                                </button>
                                <button
                                    onClick={() => {
                                        onDuplicate(quiz);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Copy size={14} />
                                    Duplicate
                                </button>
                                <button
                                    onClick={() => {
                                        onAssignToClass(quiz);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Users size={14} />
                                    Assign to Class
                                </button>
                                <hr className="my-1" />
                                {quiz.status !== 'archived' && (
                                    <button
                                        onClick={() => {
                                            onArchive(quiz);
                                            setShowActions(false);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        <Archive size={14} />
                                        Archive
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        onDelete(quiz);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quiz Content */}
            <div className="pr-16">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {quiz.title}
                </h3>
                
                {quiz.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {quiz.description}
                    </p>
                )}

                {quiz.category && (
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full mb-3">
                        {quiz.category}
                    </span>
                )}

                {/* Dates */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Created: {formatDate(quiz.createdAt)}</span>
                    </div>
                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 flex gap-3 justify-center">
                <button 
                    onClick={() => onEdit(quiz)}
                    className="p-3 bg-blue-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
                    title="Edit Quiz"
                >
                    <Edit className="h-5 w-5 text-blue-600" />
                </button>
                <button 
                    onClick={() => onAssignToClass(quiz)}
                    className="p-3 bg-orange-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
                    title="Assign to Class"
                >
                    <Users className="h-5 w-5 text-orange-600" />
                </button>
            </div>
        </motion.div>
    );
};

export default QuizCard;
