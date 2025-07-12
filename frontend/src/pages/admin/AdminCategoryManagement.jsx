import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import AdminNavbar from '../../components/admin/AdminNavbar.jsx';
import Footer from '../../components/common/Footer.jsx';

const AdminCategoryManagement = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    const [expandedCategory, setExpandedCategory] = useState(null);

    const [deleteModal, setDeleteModal] = useState({ isOpen: false, category: null });
    const [editModal, setEditModal] = useState({ isOpen: false, category: null });
    const [newCategoryModal, setNewCategoryModal] = useState(false);

    const [newCategory, setNewCategory] = useState({ name: '', description: '' });
    const [editCategory, setEditCategory] = useState({ name: '', description: '' });

    useEffect(() => {
        const mockCategories = [
            { id: 1, name: 'Mathematics', description: 'All math-related quizzes including algebra, geometry, and calculus' },
            { id: 2, name: 'Science', description: 'Quizzes covering physics, chemistry, and biology topics' },
            { id: 3, name: 'History', description: 'World history, ancient civilizations, and important events' },
            { id: 4, name: 'Languages', description: 'Quizzes for language learning and grammar practice' },
            { id: 5, name: 'General Knowledge', description: 'Mixed topics and trivia questions' },
        ];
        setCategories(mockCategories);
        setFilteredCategories(mockCategories);
    }, []);

    useEffect(() => {
        const filtered = categories.filter(category =>
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    const sortedCategories = React.useMemo(() => {
        let sortableItems = [...filteredCategories];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [filteredCategories, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleCreateCategory = () => setNewCategoryModal(true);
    const handleEditCategory = (category) => {
        setEditCategory({ ...category });
        setEditModal({ isOpen: true, category });
    };
    const handleDeleteCategory = (category) => {
        setDeleteModal({ isOpen: true, category });
    };

    const handleConfirmDelete = (category) => {
        setCategories(categories.filter(c => c.id !== category.id));
        toast.success(`Category "${category.name}" has been deleted`);
        setDeleteModal({ isOpen: false, category: null });
    };

    const handleSaveNewCategory = () => {
        const newId = Math.max(...categories.map(c => c.id), 0) + 1;
        const categoryToAdd = { ...newCategory, id: newId };
        setCategories([...categories, categoryToAdd]);
        setNewCategory({ name: '', description: '' });
        setNewCategoryModal(false);
        toast.success(`Category "${newCategory.name}" created successfully`);
    };

    const handleSaveEditCategory = () => {
        setCategories(categories.map(c =>
            c.id === editModal.category.id ? { ...editCategory, id: editModal.category.id } : c
        ));
        setEditModal({ isOpen: false, category: null });
        toast.success(`Category "${editCategory.name}" updated successfully`);
    };

    const toggleExpandCategory = (categoryId) => {
        setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    };

    // Reusable Modal Component
    const Modal = ({ isOpen, onClose, onConfirm, title, confirmText = 'Confirm', confirmDisabled = false, confirmButtonStyle = 'bg-blue-600 hover:bg-blue-700', size = 'md', children }) => {
        if (!isOpen) return null;
        const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' };
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className={`bg-white rounded-lg shadow-lg w-full mx-4 p-6 ${sizeClasses[size]}`}>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">{title}</h2>
                    <div>{children}</div>
                    <div className="flex justify-end gap-2 mt-6">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Cancel</button>
                        <button onClick={onConfirm} disabled={confirmDisabled} className={`px-4 py-2 text-white rounded ${confirmButtonStyle} disabled:opacity-50 disabled:cursor-not-allowed`}>{confirmText}</button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className='flex h-screen bg-gray-50 overflow-hidden'>
                <AdminSidebar />
                <div className='w-full overflow-y-auto'>
                    <AdminNavbar />

                    <div className='p-6 h-full w-full'>
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-8"
                        >
                            <h3 className="text-2xl md:text-3xl text-blue-950 font-bold text-center mb-2">Manage Quiz Categories</h3>
                            <p className="text-gray-600 text-center max-w-2xl">Organize quizzes into categories for better management and navigation</p>
                        </motion.div>

                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button
                                onClick={handleCreateCategory}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
                            >
                                <Plus size={18} />
                                <span>New Category</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-medium text-gray-600">
                                <div className="col-span-5 md:col-span-4 flex items-center cursor-pointer" onClick={() => requestSort('name')}>
                                    <span>Category Name</span>
                                    {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />)}
                                </div>
                                <div className="col-span-5 md:col-span-6 hidden md:block">Description</div>
                                <div className="col-span-2 md:col-span-2 text-right">Actions</div>
                            </div>

                            {sortedCategories.length > 0 ? (
                                sortedCategories.map((category) => (
                                    <div key={category.id} className="border-b border-gray-200 last:border-b-0">
                                        <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50">
                                            <div className="col-span-5 md:col-span-4 font-medium text-gray-800">{category.name}</div>
                                            <div className="col-span-5 md:col-span-6 hidden md:block truncate text-gray-600">{category.description || 'No description'}</div>
                                            <div className="col-span-2 md:col-span-2 flex justify-end gap-2">
                                                <button onClick={() => handleEditCategory(category)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"><Edit size={18} /></button>
                                                <button onClick={() => handleDeleteCategory(category)} className="p-2 text-red-600 hover:bg-red-50 rounded-full"><Trash2 size={18} /></button>
                                                <button onClick={() => toggleExpandCategory(category.id)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-full md:hidden">
                                                    {expandedCategory === category.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </button>
                                            </div>
                                        </div>

                                        {expandedCategory === category.id && (
                                            <div className="md:hidden p-4 pt-0 bg-gray-50">
                                                <div className="mb-2">
                                                    <span className="font-medium text-gray-700">Description:</span>
                                                    <p className="text-gray-600">{category.description || 'No description'}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => handleEditCategory(category)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Edit</button>
                                                    <button onClick={() => handleDeleteCategory(category)} className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    {searchTerm ? 'No categories match your search' : 'No categories found. Create your first category!'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* New Category Modal */}
                <Modal
                    isOpen={newCategoryModal}
                    onClose={() => setNewCategoryModal(false)}
                    onConfirm={handleSaveNewCategory}
                    confirmText="Create"
                    title="Create New Category"
                    confirmDisabled={!newCategory.name.trim()}
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Category name"
                                value={newCategory.name}
                                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Optional description"
                                rows={3}
                                value={newCategory.description}
                                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                            />
                        </div>
                    </div>
                </Modal>

                {/* Edit Modal */}
                <Modal
                    isOpen={editModal.isOpen}
                    onClose={() => setEditModal({ isOpen: false, category: null })}
                    onConfirm={handleSaveEditCategory}
                    confirmText="Save"
                    title="Edit Category"
                    confirmDisabled={!editCategory.name.trim()}
                    size="md"
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Category name"
                                value={editCategory.name}
                                onChange={(e) => setEditCategory({ ...editCategory, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Optional description"
                                rows={3}
                                value={editCategory.description}
                                onChange={(e) => setEditCategory({ ...editCategory, description: e.target.value })}
                            />
                        </div>
                    </div>
                </Modal>

                {/* Delete Modal */}
                <Modal
                    isOpen={deleteModal.isOpen}
                    onClose={() => setDeleteModal({ isOpen: false, category: null })}
                    onConfirm={() => handleConfirmDelete(deleteModal.category)}
                    confirmText="Delete"
                    title="Delete Category"
                    confirmButtonStyle="bg-red-600 hover:bg-red-700"
                    size="sm"
                >
                    <p className="text-gray-700">Are you sure you want to delete the category "{deleteModal.category?.name}"?</p>
                    <p className="text-sm text-gray-500 mt-2">This action cannot be undone. Quizzes in this category will not be deleted but will become uncategorized.</p>
                </Modal>
            </div>
            <Footer />
        </>
    );
};

export default AdminCategoryManagement;