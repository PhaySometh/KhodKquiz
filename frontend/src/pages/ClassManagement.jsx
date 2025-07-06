import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Sidebar from '../components/common/TeacherSidebar.jsx';
import ClassList from '../components/ClassList.jsx';
import { DeleteClassModal, StudentManagementModal, EditClassModal } from '../components/ClassActionModals.jsx';
import UserNavbar from '../components/common/UserNavbar.jsx';
import Footer from '../components/common/Footer.jsx';

const ClassManagement = () => {
    // Modal states
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, classItem: null });
    const [studentModal, setStudentModal] = useState({ isOpen: false, classItem: null });
    const [editModal, setEditModal] = useState({ isOpen: false, classItem: null });

    // Class action handlers
    const handleCreateClass = () => {
        // Navigate to create class page or open modal
        toast.success('Opening create class form...');
        // You can implement actual create functionality here
    };

    const handleEditClass = (classItem) => {
        setEditModal({ isOpen: true, classItem });
    };

    const handleViewClass = (classItem) => {
        // Navigate to class details page
        toast.success(`Opening details for "${classItem.name}"`);
        // You can implement actual view functionality here
    };

    const handleDeleteClass = (classItem) => {
        setDeleteModal({ isOpen: true, classItem });
    };

    const handleConfirmDelete = (classItem) => {
        // Implement actual delete logic here
        toast.success(`Class "${classItem.name}" has been deleted`);
        console.log('Deleting class:', classItem);
    };

    const handleDuplicateClass = (classItem) => {
        // Implement duplicate logic here
        toast.success(`Class "${classItem.name}" has been duplicated`);
        console.log('Duplicating class:', classItem);
    };

    const handleManageStudents = (classItem) => {
        setStudentModal({ isOpen: true, classItem });
    };

    const handleUpdateStudents = (updateData) => {
        // Implement actual student management logic here
        const { classItem, action, students } = updateData;
        const actionText = action === 'enroll' ? 'enrolled in' : 'removed from';
        toast.success(`${students.length} student${students.length !== 1 ? 's' : ''} ${actionText} "${classItem.name}"`);
        console.log('Updating students:', updateData);
    };

    const handleViewAnalytics = (classItem) => {
        // Navigate to analytics page for this class
        toast.success(`Opening analytics for "${classItem.name}"`);
        // You can implement actual analytics functionality here
    };

    const handleSaveClass = (updatedClass) => {
        // Implement actual save logic here
        toast.success(`Class "${updatedClass.name}" has been updated`);
        console.log('Saving class:', updatedClass);
    };

    return (
        <>
            <div className='flex h-screen bg-gray-50 overflow-hidden'>
                <Sidebar />
                <div className='w-full overflow-y-auto'>
                    <UserNavbar />

                    {/* Main Content */}
                    <div className='p-6 h-full w-full'>
                        {/* Welcome Section - Class management focused */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-8"
                        >
                            <h3 className="text-2xl md:text-3xl text-blue-950 font-bold text-center mb-2">
                                Manage Your Classes
                            </h3>
                            <p className="text-gray-600 text-center max-w-2xl">
                                Create and organize your classes, manage student enrollments, and track class performance.
                            </p>
                        </motion.div>

                        {/* Class Management Section */}
                        <ClassList
                            onCreateClass={handleCreateClass}
                            onEditClass={handleEditClass}
                            onViewClass={handleViewClass}
                            onDeleteClass={handleDeleteClass}
                            onDuplicateClass={handleDuplicateClass}
                            onManageStudents={handleManageStudents}
                            onViewAnalytics={handleViewAnalytics}
                        />
                    </div>
                </div>

                {/* Modals */}
                <DeleteClassModal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, classItem: null })}
                    classItem={deleteModal.classItem}
                    onConfirm={handleConfirmDelete}
                />

                <StudentManagementModal
                    isOpen={studentModal.isOpen}
                    onClose={() => setStudentModal({ isOpen: false, classItem: null })}
                    classItem={studentModal.classItem}
                    onUpdateStudents={handleUpdateStudents}
                />

                <EditClassModal
                    isOpen={editModal.isOpen}
                    onClose={() => setEditModal({ isOpen: false, classItem: null })}
                    classItem={editModal.classItem}
                    onSave={handleSaveClass}
                />
            </div>
            <Footer />
        </>
    );
};

export default ClassManagement;
