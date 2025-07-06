import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Users, Mail, UserPlus, UserMinus, Check } from 'lucide-react';

// Delete Class Confirmation Modal
export const DeleteClassModal = ({ isOpen, onClose, classItem, onConfirm }) => {
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
                            <h3 className="text-lg font-semibold text-gray-900">Delete Class</h3>
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
                            Are you sure you want to delete <strong>"{classItem?.name}"</strong>? 
                            This action cannot be undone.
                        </p>
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                            <p className="text-sm text-red-700">
                                <strong>Warning:</strong> This will permanently delete the class and remove all 
                                {classItem?.studentCount || 0} enrolled students. All associated quiz assignments 
                                and student progress will be lost.
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
                                onConfirm(classItem);
                                onClose();
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Delete Class
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Student Management Modal
export const StudentManagementModal = ({ isOpen, onClose, classItem, onUpdateStudents }) => {
    const [enrolledStudents, setEnrolledStudents] = useState([]);
    const [availableStudents, setAvailableStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('enrolled');

    // Mock data - replace with actual API calls
    React.useEffect(() => {
        if (isOpen) {
            // Mock enrolled students
            setEnrolledStudents([
                { id: 1, name: 'John Doe', email: 'john@example.com', enrolledAt: '2024-01-15' },
                { id: 2, name: 'Jane Smith', email: 'jane@example.com', enrolledAt: '2024-01-16' },
                { id: 3, name: 'Mike Johnson', email: 'mike@example.com', enrolledAt: '2024-01-17' }
            ]);

            // Mock available students
            setAvailableStudents([
                { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com' },
                { id: 5, name: 'David Brown', email: 'david@example.com' },
                { id: 6, name: 'Lisa Davis', email: 'lisa@example.com' }
            ]);
        }
    }, [isOpen]);

    const handleStudentToggle = (studentId) => {
        setSelectedStudents(prev => 
            prev.includes(studentId) 
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleEnrollStudents = () => {
        if (selectedStudents.length === 0) return;
        
        const studentsToEnroll = availableStudents.filter(student => 
            selectedStudents.includes(student.id)
        );
        
        onUpdateStudents({
            classItem,
            action: 'enroll',
            students: studentsToEnroll
        });
        
        setSelectedStudents([]);
        onClose();
    };

    const handleRemoveStudents = () => {
        if (selectedStudents.length === 0) return;
        
        const studentsToRemove = enrolledStudents.filter(student => 
            selectedStudents.includes(student.id)
        );
        
        onUpdateStudents({
            classItem,
            action: 'remove',
            students: studentsToRemove
        });
        
        setSelectedStudents([]);
        onClose();
    };

    if (!isOpen) return null;

    const filteredStudents = activeTab === 'enrolled' 
        ? enrolledStudents.filter(student => 
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : availableStudents.filter(student => 
            student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase())
          );

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
                                <h3 className="text-lg font-semibold text-gray-900">Manage Students</h3>
                                <p className="text-sm text-gray-500">"{classItem?.name}"</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="p-6">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-200 mb-6">
                            <button
                                onClick={() => {
                                    setActiveTab('enrolled');
                                    setSelectedStudents([]);
                                    setSearchQuery('');
                                }}
                                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                                    activeTab === 'enrolled'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Enrolled Students ({enrolledStudents.length})
                            </button>
                            <button
                                onClick={() => {
                                    setActiveTab('available');
                                    setSelectedStudents([]);
                                    setSearchQuery('');
                                }}
                                className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
                                    activeTab === 'available'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                Available Students ({availableStudents.length})
                            </button>
                        </div>

                        {/* Search */}
                        <div className="relative mb-4">
                            <input
                                type="text"
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Student List */}
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {filteredStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                        selectedStudents.includes(student.id)
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => handleStudentToggle(student.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-gray-600">
                                                    {student.name.charAt(0)}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-900">{student.name}</h4>
                                                <p className="text-sm text-gray-500">{student.email}</p>
                                                {student.enrolledAt && (
                                                    <p className="text-xs text-gray-400">
                                                        Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        {selectedStudents.includes(student.id) && (
                                            <Check className="h-5 w-5 text-blue-600" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredStudents.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No students found
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between p-6 border-t border-gray-200">
                        <p className="text-sm text-gray-500">
                            {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            {activeTab === 'enrolled' ? (
                                <button
                                    onClick={handleRemoveStudents}
                                    disabled={selectedStudents.length === 0}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <UserMinus size={16} />
                                    Remove Students
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnrollStudents}
                                    disabled={selectedStudents.length === 0}
                                    className="flex items-center gap-2 px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <UserPlus size={16} />
                                    Enroll Students
                                </button>
                            )}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Edit Class Modal
export const EditClassModal = ({ isOpen, onClose, classItem, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        subject: '',
        isActive: true
    });

    React.useEffect(() => {
        if (isOpen && classItem) {
            setFormData({
                name: classItem.name || '',
                description: classItem.description || '',
                subject: classItem.subject || '',
                isActive: classItem.isActive !== undefined ? classItem.isActive : true
            });
        }
    }, [isOpen, classItem]);

    const handleSave = () => {
        onSave({
            ...classItem,
            ...formData
        });
        onClose();
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
                    className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Edit Class</h3>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Class Name
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter class name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Subject
                            </label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter subject"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter class description"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="isActive"
                                checked={formData.isActive}
                                onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                                Active Class
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900 transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
