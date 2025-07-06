import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
    Edit, 
    Eye, 
    Trash2, 
    Copy, 
    Users, 
    BookOpen, 
    Calendar,
    MoreVertical,
    UserPlus,
    BarChart3,
    GraduationCap
} from 'lucide-react';

const ClassCard = ({ 
    classItem, 
    onEdit, 
    onView, 
    onDelete, 
    onDuplicate, 
    onManageStudents,
    onViewAnalytics 
}) => {
    const [showActions, setShowActions] = useState(false);

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
            {/* Class Status Badge */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                    classItem.isActive ? 'text-green-600 bg-green-100' : 'text-gray-600 bg-gray-100'
                }`}>
                    <GraduationCap size={14} />
                    {classItem.isActive ? 'Active' : 'Inactive'}
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
                                        onEdit(classItem);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Edit size={14} />
                                    Edit Class
                                </button>
                                <button
                                    onClick={() => {
                                        onView(classItem);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Eye size={14} />
                                    View Details
                                </button>
                                <button
                                    onClick={() => {
                                        onManageStudents(classItem);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <UserPlus size={14} />
                                    Manage Students
                                </button>
                                <button
                                    onClick={() => {
                                        onViewAnalytics(classItem);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <BarChart3 size={14} />
                                    View Analytics
                                </button>
                                <button
                                    onClick={() => {
                                        onDuplicate(classItem);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Copy size={14} />
                                    Duplicate Class
                                </button>
                                <hr className="my-1" />
                                <button
                                    onClick={() => {
                                        onDelete(classItem);
                                        setShowActions(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={14} />
                                    Delete Class
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Class Content */}
            <div className="pr-16">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {classItem.name}
                </h3>
                
                {classItem.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {classItem.description}
                    </p>
                )}

                {classItem.subject && (
                    <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full mb-3">
                        {classItem.subject}
                    </span>
                )}

                {/* Class Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{classItem.studentCount || 0} students</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <BookOpen size={14} />
                        <span>{classItem.assignedQuizzes || 0} quizzes</span>
                    </div>
                </div>

                {/* Dates */}
                <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                        <Calendar size={12} />
                        <span>Created: {formatDate(classItem.createdAt)}</span>
                    </div>
                    {classItem.updatedAt !== classItem.createdAt && (
                        <span>Updated: {formatDate(classItem.updatedAt)}</span>
                    )}
                </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mt-4 flex gap-3 justify-center">
                <button 
                    onClick={() => onEdit(classItem)}
                    className="p-3 bg-blue-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
                    title="Edit Class"
                >
                    <Edit className="h-5 w-5 text-blue-600" />
                </button>
                <button 
                    onClick={() => onManageStudents(classItem)}
                    className="p-3 bg-orange-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
                    title="Manage Students"
                >
                    <Users className="h-5 w-5 text-orange-600" />
                </button>
                <button 
                    onClick={() => onViewAnalytics(classItem)}
                    className="p-3 bg-green-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110"
                    title="View Analytics"
                >
                    <BarChart3 className="h-5 w-5 text-green-600" />
                </button>
            </div>
        </motion.div>
    );
};

export default ClassCard;
