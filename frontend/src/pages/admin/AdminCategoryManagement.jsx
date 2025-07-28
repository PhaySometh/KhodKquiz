import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Plus,
    Edit,
    Trash2,
    Search,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AdminSidebar from '../../components/admin/AdminSidebar.jsx';
import AdminNavbar from '../../components/admin/AdminNavbar.jsx';
import StatsCard, {
    StatsGrid,
    STAT_CONFIGS,
} from '../../components/common/StatsCard';
import FormField, { TextareaField } from '../../components/common/FormField';
import StandardModal, {
    ModalBody,
    ModalFooter,
    PrimaryButton,
    SecondaryButton,
    DangerButton,
    ConfirmationModal,
} from '../../components/common/StandardModal';
import CategoryIconUpload, {
    CategoryIconDisplay,
} from '../../components/admin/CategoryIconUpload';
import Footer from '../../components/common/Footer.jsx';
import apiClient from '../../utils/axiosConfig';
import { handleApiError, withErrorHandling } from '../../utils/apiErrorHandler';

const AdminCategoryManagement = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({
        key: 'name',
        direction: 'asc',
    });
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [quizCounts, setQuizCounts] = useState({});

    const [showCreateCategory, setShowCreateCategory] = useState(false);
    const [showEditCategory, setShowEditCategory] = useState(false);
    const [showDeleteCategory, setShowDeleteCategory] = useState(false);

    const [categoryForm, setCategoryForm] = useState({
        name: '',
        description: '',
        icon: null,
    });
    const [iconFile, setIconFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    // Icon upload handlers
    const handleIconChange = async (file) => {
        setIconFile(file);
        setCategoryForm((prev) => ({
            ...prev,
            icon: URL.createObjectURL(file),
        }));
    };

    const handleIconRemove = () => {
        setIconFile(null);
        setCategoryForm((prev) => ({ ...prev, icon: null }));
    };

    // Fetch quiz counts for each category
    const fetchQuizCounts = async () => {
        try {
            const response = await apiClient.get('/api/admin/quiz');
            if (response.data.success) {
                const quizzes = response.data.data || [];
                const counts = {};

                // Count quizzes per category
                quizzes.forEach((quiz) => {
                    const categoryId = quiz.category;
                    if (categoryId) {
                        counts[categoryId] = (counts[categoryId] || 0) + 1;
                    }
                });

                setQuizCounts(counts);
            }
        } catch (error) {
            console.error('Error fetching quiz counts:', error);
            setQuizCounts({});
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/api/admin/category');
                setCategories(response.data.data || []);
                setFilteredCategories(response.data.data || []);

                // Also fetch quiz counts
                await fetchQuizCounts();
            } catch (error) {
                console.error('Error fetching categories:', error);
                toast.error('Failed to load categories');
                setCategories([]);
                setFilteredCategories([]);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const filtered = categories.filter((category) => {
            if (!category || !category.name) return false;
            const nameMatch = category.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const descMatch = category.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());
            return nameMatch || descMatch;
        });
        setFilteredCategories(filtered);
    }, [searchTerm, categories]);

    const sortedCategories = React.useMemo(() => {
        let sortableItems = [...filteredCategories];
        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key])
                    return sortConfig.direction === 'asc' ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key])
                    return sortConfig.direction === 'asc' ? 1 : -1;
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

    const handleCreateCategory = async () => {
        if (!categoryForm.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setSubmitting(true);
        try {
            // Use FormData for file upload support, fallback to JSON if no file
            let requestData;
            let headers = {};

            if (iconFile) {
                // Use FormData when file is present
                const formData = new FormData();
                formData.append('name', categoryForm.name.trim());
                formData.append('description', categoryForm.description.trim());
                formData.append('icon', iconFile);
                requestData = formData;
                headers['Content-Type'] = 'multipart/form-data';
            } else {
                // Use JSON when no file
                requestData = {
                    name: categoryForm.name.trim(),
                    description: categoryForm.description.trim(),
                };
                headers['Content-Type'] = 'application/json';
            }

            const response = await apiClient.post(
                '/api/admin/category',
                requestData,
                { headers }
            );

            if (response.data.success) {
                toast.success('Category created successfully');
                setCategories([...categories, response.data.data]);
                setCategoryForm({ name: '', description: '', icon: null });
                setIconFile(null);
                setShowCreateCategory(false);
                // Refresh quiz counts
                await fetchQuizCounts();
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                'Failed to create category. Please try again.';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const handleShowEditCategory = (category) => {
        setCategoryForm({
            id: category.id,
            name: category.name,
            description: category.description || '',
            icon: category.icon,
        });
        setIconFile(null); // Reset icon file for editing
        setShowEditCategory(true);
    };

    const handleEditCategory = async () => {
        if (!categoryForm.name.trim()) {
            toast.error('Category name is required');
            return;
        }

        setSubmitting(true);
        try {
            // Use FormData for file upload support, fallback to JSON if no file
            let requestData;
            let headers = {};

            if (iconFile) {
                // Use FormData when file is present
                const formData = new FormData();
                formData.append('name', categoryForm.name.trim());
                formData.append('description', categoryForm.description.trim());
                formData.append('icon', iconFile);
                requestData = formData;
                headers['Content-Type'] = 'multipart/form-data';
            } else {
                // Use JSON when no file
                requestData = {
                    name: categoryForm.name.trim(),
                    description: categoryForm.description.trim(),
                };
                headers['Content-Type'] = 'application/json';
            }

            const response = await apiClient.put(
                `/api/admin/category/${categoryForm.id}`,
                requestData,
                { headers }
            );

            if (response.data.success) {
                toast.success('Category updated successfully');
                const updatedCategories = categories.map((cat) =>
                    cat.id === categoryForm.id ? response.data.data : cat
                );
                setCategories(updatedCategories);
                setCategoryForm({ name: '', description: '', icon: null });
                setIconFile(null);
                setShowEditCategory(false);
                // Refresh quiz counts
                await fetchQuizCounts();
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                'Failed to update category. Please try again.';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const confirmDeleteCategory = async () => {
        setSubmitting(true);
        try {
            const response = await apiClient.delete(
                `/api/admin/category/${categoryToDelete.id}`
            );

            if (response.data.success) {
                toast.success('Category deleted successfully');
                setCategories(
                    categories.filter((c) => c.id !== categoryToDelete.id)
                );
                setShowDeleteCategory(false);
                setCategoryToDelete(null);
                // Refresh quiz counts
                await fetchQuizCounts();
            }
        } catch (error) {
            const errorMessage =
                error.response?.data?.message ||
                'Failed to delete category. Please try again.';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const toggleExpandCategory = (categoryId) => {
        setExpandedCategory(
            expandedCategory === categoryId ? null : categoryId
        );
    };

    return (
        <>
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <AdminSidebar />
                <div className="w-full overflow-y-auto">
                    <AdminNavbar />

                    <div className="p-6 h-full w-full">
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full flex flex-col items-center justify-center p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-8"
                        >
                            <h3 className="text-2xl md:text-3xl text-blue-950 font-bold text-center mb-2">
                                Manage Quiz Categories
                            </h3>
                            <p className="text-gray-600 text-center max-w-2xl">
                                Organize quizzes into categories for better
                                management and navigation
                            </p>
                        </motion.div>

                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <div className="relative w-full md:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                            </div>
                            <button
                                onClick={() => setShowCreateCategory(true)}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full md:w-auto"
                            >
                                <Plus size={18} />
                                <span>New Category</span>
                            </button>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="grid grid-cols-12 bg-gray-50 p-4 border-b border-gray-200 font-medium text-gray-600">
                                <div className="col-span-1 flex items-center">
                                    <span>Icon</span>
                                </div>
                                <div
                                    className="col-span-3 md:col-span-2 flex items-center cursor-pointer"
                                    onClick={() => requestSort('name')}
                                >
                                    <span>Category Name</span>
                                    {sortConfig.key === 'name' &&
                                        (sortConfig.direction === 'asc' ? (
                                            <ChevronUp
                                                size={16}
                                                className="ml-1"
                                            />
                                        ) : (
                                            <ChevronDown
                                                size={16}
                                                className="ml-1"
                                            />
                                        ))}
                                </div>
                                <div className="col-span-4 md:col-span-5 hidden md:block">
                                    Description
                                </div>
                                <div className="col-span-2 md:col-span-1 text-center">
                                    <span>Quizzes</span>
                                </div>
                                <div className="col-span-2 md:col-span-3 text-right">
                                    Actions
                                </div>
                            </div>

                            {sortedCategories.length > 0 ? (
                                sortedCategories.map((category) => (
                                    <div
                                        key={category.id}
                                        className="border-b border-gray-200 last:border-b-0"
                                    >
                                        <div className="grid grid-cols-12 p-4 items-center hover:bg-gray-50">
                                            <div className="col-span-1 flex items-center">
                                                <CategoryIconDisplay
                                                    icon={category.icon}
                                                    categoryName={category.name}
                                                    size="sm"
                                                />
                                            </div>
                                            <div className="col-span-3 md:col-span-2 font-medium text-gray-800">
                                                {category.name}
                                            </div>
                                            <div className="col-span-4 md:col-span-5 hidden md:block truncate text-gray-600">
                                                {category.description ||
                                                    'No description'}
                                            </div>
                                            <div className="col-span-2 md:col-span-1 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                                                    {quizCounts[category.id] ||
                                                        0}
                                                </span>
                                            </div>
                                            <div className="col-span-2 md:col-span-3 flex justify-end gap-2">
                                                <button
                                                    onClick={() =>
                                                        handleShowEditCategory(
                                                            category
                                                        )
                                                    }
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setShowDeleteCategory(
                                                            true
                                                        );
                                                        setCategoryToDelete(
                                                            category
                                                        );
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        toggleExpandCategory(
                                                            category.id
                                                        )
                                                    }
                                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-full md:hidden"
                                                >
                                                    {expandedCategory ===
                                                    category.id ? (
                                                        <ChevronUp size={18} />
                                                    ) : (
                                                        <ChevronDown
                                                            size={18}
                                                        />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        {expandedCategory === category.id && (
                                            <div className="md:hidden p-4 pt-0 bg-gray-50">
                                                <div className="mb-2">
                                                    <span className="font-medium text-gray-700">
                                                        Description:
                                                    </span>
                                                    <p className="text-gray-600">
                                                        {category.description ||
                                                            'No description'}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() =>
                                                            handleShowEditCategory(
                                                                category
                                                            )
                                                        }
                                                        className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteCategory(
                                                                true
                                                            );
                                                            setCategoryToDelete(
                                                                category
                                                            );
                                                        }}
                                                        className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-500">
                                    {searchTerm
                                        ? 'No categories match your search'
                                        : 'No categories found. Create your first category!'}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Create Modal */}
                <StandardModal
                    isOpen={showCreateCategory}
                    onClose={() => setShowCreateCategory(false)}
                    title="Create New Category"
                    size="md"
                    preventClose={submitting}
                >
                    <ModalBody>
                        <div className="space-y-6">
                            <FormField
                                label="Category Name"
                                name="name"
                                value={categoryForm.name}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter category name"
                                required
                                disabled={submitting}
                            />

                            <TextareaField
                                label="Description"
                                name="description"
                                value={categoryForm.description}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter category description (optional)"
                                rows={3}
                                disabled={submitting}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Icon
                                </label>
                                <CategoryIconUpload
                                    currentIcon={categoryForm.icon}
                                    onIconChange={handleIconChange}
                                    onIconRemove={handleIconRemove}
                                    categoryName={categoryForm.name}
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <SecondaryButton
                            onClick={() => setShowCreateCategory(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={handleCreateCategory}
                            loading={submitting}
                        >
                            Create Category
                        </PrimaryButton>
                    </ModalFooter>
                </StandardModal>

                {/* Edit Modal */}
                <StandardModal
                    isOpen={showEditCategory}
                    onClose={() => setShowEditCategory(false)}
                    title="Edit Category"
                    size="md"
                    preventClose={submitting}
                >
                    <ModalBody>
                        <div className="space-y-6">
                            <FormField
                                label="Category Name"
                                name="name"
                                value={categoryForm.name}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="Enter category name"
                                required
                                disabled={submitting}
                            />

                            <TextareaField
                                label="Description"
                                name="description"
                                value={categoryForm.description}
                                onChange={(e) =>
                                    setCategoryForm({
                                        ...categoryForm,
                                        description: e.target.value,
                                    })
                                }
                                placeholder="Enter category description (optional)"
                                rows={3}
                                disabled={submitting}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Category Icon
                                </label>
                                <CategoryIconUpload
                                    currentIcon={categoryForm.icon}
                                    onIconChange={handleIconChange}
                                    onIconRemove={handleIconRemove}
                                    categoryName={categoryForm.name}
                                    disabled={submitting}
                                />
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <SecondaryButton
                            onClick={() => setShowEditCategory(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            onClick={handleEditCategory}
                            loading={submitting}
                        >
                            Update Category
                        </PrimaryButton>
                    </ModalFooter>
                </StandardModal>

                {/* Delete Modal */}
                <ConfirmationModal
                    isOpen={showDeleteCategory}
                    onClose={() => setShowDeleteCategory(false)}
                    onConfirm={confirmDeleteCategory}
                    title="Delete Category"
                    message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
                    confirmText="Delete Category"
                    cancelText="Cancel"
                    type="danger"
                    loading={submitting}
                />
            </div>
        </>
    );
};

export default AdminCategoryManagement;
