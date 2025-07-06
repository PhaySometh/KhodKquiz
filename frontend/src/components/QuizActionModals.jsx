import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Users, Calendar, Clock, Hash, Check } from 'lucide-react';

// Delete Confirmation Modal
export const DeleteQuizModal = ({ isOpen, onClose, quiz, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-100 rounded-full">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Delete Quiz</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-3">
                            Are you sure you want to delete <strong>"{quiz?.title}"</strong>? 
                            This action cannot be undone.
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-700">
                                <strong>Warning:</strong> This will permanently delete the quiz and all associated data, 
                                including student responses and results.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm(quiz);
                                onClose();
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete Quiz
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Class Assignment Modal
export const AssignToClassModal = ({ isOpen, onClose, quiz, onAssign }) => {
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [assignmentSettings, setAssignmentSettings] = useState({
        dueDate: '',
        timeLimit: '',
        attemptLimit: 1,
        instructions: ''
    });

    // Mock classes data - replace with actual API call
    const availableClasses = [
        { id: 1, name: 'Computer Science 101', students: 25 },
        { id: 2, name: 'Web Development Bootcamp', students: 18 },
        { id: 3, name: 'Advanced JavaScript', students: 12 },
        { id: 4, name: 'Python for Beginners', students: 30 }
    ];

    const handleClassToggle = (classId) => {
        setSelectedClasses(prev => 
            prev.includes(classId) 
                ? prev.filter(id => id !== classId)
                : [...prev, classId]
        );
    };

    const handleAssign = () => {
        if (selectedClasses.length === 0) return;
        
        onAssign({
            quiz,
            classes: selectedClasses,
            settings: assignmentSettings
        });
        onClose();
        
        // Reset form
        setSelectedClasses([]);
        setAssignmentSettings({
            dueDate: '',
            timeLimit: '',
            attemptLimit: 1,
            instructions: ''
        });
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-full">
                                <Users className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Assign to Classes</h3>
                                <p className="text-sm text-gray-500">"{quiz?.title}"</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Class Selection */}
                        <div>
                            <h4 className="text-sm font-medium text-gray-900 mb-3">Select Classes</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {availableClasses.map((classItem) => (
                                    <div
                                        key={classItem.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                            selectedClasses.includes(classItem.id)
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                        onClick={() => handleClassToggle(classItem.id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h5 className="font-medium text-gray-900">{classItem.name}</h5>
                                                <p className="text-sm text-gray-500">{classItem.students} students</p>
                                            </div>
                                            {selectedClasses.includes(classItem.id) && (
                                                <Check className="h-5 w-5 text-blue-600" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Assignment Settings */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-medium text-gray-900">Assignment Settings</h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Due Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Calendar size={14} className="inline mr-1" />
                                        Due Date (Optional)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={assignmentSettings.dueDate}
                                        onChange={(e) => setAssignmentSettings(prev => ({
                                            ...prev,
                                            dueDate: e.target.value
                                        }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                {/* Time Limit */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <Clock size={14} className="inline mr-1" />
                                        Time Limit (minutes)
                                    </label>
                                    <input
                                        type="number"
                                        placeholder={`Default: ${quiz?.time || 30} min`}
                                        value={assignmentSettings.timeLimit}
                                        onChange={(e) => setAssignmentSettings(prev => ({
                                            ...prev,
                                            timeLimit: e.target.value
                                        }))}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            {/* Attempt Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <Hash size={14} className="inline mr-1" />
                                    Number of Attempts
                                </label>
                                <select
                                    value={assignmentSettings.attemptLimit}
                                    onChange={(e) => setAssignmentSettings(prev => ({
                                        ...prev,
                                        attemptLimit: parseInt(e.target.value)
                                    }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value={1}>1 attempt</option>
                                    <option value={2}>2 attempts</option>
                                    <option value={3}>3 attempts</option>
                                    <option value={-1}>Unlimited attempts</option>
                                </select>
                            </div>

                            {/* Instructions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Special Instructions (Optional)
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Add any special instructions for students..."
                                    value={assignmentSettings.instructions}
                                    onChange={(e) => setAssignmentSettings(prev => ({
                                        ...prev,
                                        instructions: e.target.value
                                    }))}
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''} selected
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAssign}
                                disabled={selectedClasses.length === 0}
                                className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Assign Quiz
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Archive Confirmation Modal
export const ArchiveQuizModal = ({ isOpen, onClose, quiz, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gray-100 rounded-full">
                                <Users className="h-5 w-5 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Archive Quiz</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="mb-6">
                        <p className="text-gray-600 mb-3">
                            Are you sure you want to archive <strong>"{quiz?.title}"</strong>?
                        </p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                            <p className="text-sm text-gray-700">
                                Archived quizzes will be hidden from the main view but can be restored later. 
                                Students will no longer be able to access this quiz.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                onConfirm(quiz);
                                onClose();
                            }}
                            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Archive Quiz
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
