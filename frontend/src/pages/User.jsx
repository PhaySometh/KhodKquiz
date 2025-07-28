import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    User as UserIcon,
    Mail,
    Edit3,
    Save,
    X,
    GraduationCap,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import TeacherRequestForm from '../components/TeacherRequestForm';
import apiClient from '../utils/axiosConfig';
import toast from 'react-hot-toast';

const User = () => {
    const { user, updateProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);

    // Teacher application states
    const [activeTab, setActiveTab] = useState('profile');
    const [teacherApplication, setTeacherApplication] = useState(null);
    const [applicationLoading, setApplicationLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setEditedName(user.name || '');
            // Fetch teacher application if user is a student
            if (user.role === 'student') {
                fetchTeacherApplication();
            }
        }
    }, [user]);

    const fetchTeacherApplication = async () => {
        if (user?.role !== 'student') return;

        setApplicationLoading(true);
        try {
            const response = await apiClient.get(
                '/api/teacher-application/my-application'
            );
            setTeacherApplication(response.data.application);
        } catch (error) {
            // 404 is expected if no application exists
            if (error.response?.status !== 404) {
                console.error('Error fetching teacher application:', error);
            }
        } finally {
            setApplicationLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        if (!editedName.trim()) {
            toast.error('Name cannot be empty');
            return;
        }

        if (editedName.trim() === user.name) {
            setIsEditing(false);
            return;
        }

        setIsUpdating(true);
        const success = await updateProfile({ name: editedName.trim() });

        if (success) {
            setIsEditing(false);
        }
        setIsUpdating(false);
    };

    const handleCancelEdit = () => {
        setEditedName(user.name || '');
        setIsEditing(false);
    };

    const handleProfilePictureUpload = async (imageData) => {
        setIsUploadingPicture(true);
        try {
            const success = await updateProfile({ picture: imageData });
            if (success) {
                toast.success('Profile picture updated successfully!');
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            console.error('Profile picture upload error:', error);

            // Let the ProfilePictureUpload component handle specific errors
            // This is a fallback for any unhandled errors
            if (
                !error.message.includes('PayloadTooLargeError') &&
                !error.message.includes('request entity too large')
            ) {
                toast.error('Failed to update profile picture');
            }

            // Re-throw the error so ProfilePictureUpload can handle it
            throw error;
        } finally {
            setIsUploadingPicture(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-orange-500" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-5 h-5 text-red-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-16 h-16 bg-yellow-500 rounded-full mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded w-48 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-64"></div>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="flex items-center justify-center pt-20">
                    <div className="text-center">
                        <UserIcon
                            size={64}
                            className="mx-auto text-gray-400 mb-4"
                        />
                        <h1 className="text-2xl font-bold text-gray-700 mb-2">
                            User not found
                        </h1>
                        <p className="text-gray-500">
                            Please try logging in again.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-8"
                    >
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            My Profile
                        </h1>
                        <p className="text-gray-600">
                            Manage your account information and preferences
                        </p>
                    </motion.div>

                    {/* Tabs for students */}
                    {user?.role === 'student' && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="mb-8"
                        >
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === 'profile'
                                            ? 'bg-white text-blue-950 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    Profile Information
                                </button>
                                <button
                                    onClick={() =>
                                        setActiveTab('teacher-application')
                                    }
                                    className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                                        activeTab === 'teacher-application'
                                            ? 'bg-white text-blue-950 shadow-sm'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <GraduationCap className="w-4 h-4" />
                                    Teacher Application
                                    {teacherApplication && (
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(
                                                teacherApplication.status
                                            )}`}
                                        >
                                            {teacherApplication.status}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Content based on active tab */}
                    {user?.role !== 'student' || activeTab === 'profile' ? (
                        /* Profile Card */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            {/* Profile Header */}
                            <div className="bg-blue-950 px-6 py-8 text-white">
                                <div className="flex flex-col sm:flex-row items-center gap-6">
                                    <ProfilePictureUpload
                                        user={user}
                                        onUpload={handleProfilePictureUpload}
                                        isUploading={isUploadingPicture}
                                    />
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl font-bold mb-1">
                                            {user.name}
                                        </h2>
                                        <p className="text-blue-100 flex items-center justify-center sm:justify-start gap-2">
                                            <Mail size={16} />
                                            {user.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="p-6">
                                <div className="space-y-6">
                                    {/* Name Field */}
                                    <div>
                                        <label className="block text-sm font-bold text-orange-400 mb-2">
                                            Full Name
                                        </label>
                                        {isEditing ? (
                                            <div className="flex gap-3">
                                                <input
                                                    type="text"
                                                    value={editedName}
                                                    onChange={(e) =>
                                                        setEditedName(
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="Enter your full name"
                                                    disabled={isUpdating}
                                                />
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={isUpdating}
                                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                >
                                                    <Save size={16} />
                                                    {isUpdating
                                                        ? 'Saving...'
                                                        : 'Save'}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    disabled={isUpdating}
                                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-4 bg-gray-200 rounded-lg">
                                                <span className="text-gray-900">
                                                    {user.name}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        setIsEditing(true)
                                                    }
                                                    className="text-blue-950 hover:text-blue-700 hover:cursor-pointer flex items-center gap-2"
                                                >
                                                    <Edit3 size={16} />
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Email Field (Read-only) */}
                                    <div>
                                        <label className="block text-sm font-bold text-orange-400 mb-2">
                                            Email Address
                                        </label>
                                        <div className="p-4 bg-gray-200 rounded-lg">
                                            <span className="text-gray-900">
                                                {user.email}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {user.provider === 'google'
                                                    ? "Email cannot be changed as it's linked to your Google account"
                                                    : 'Email cannot be changed for security reasons'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Account Info */}
                                    <div>
                                        <label className="block text-sm font-bold text-orange-400 mb-2">
                                            Account Information
                                        </label>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="p-4 bg-gray-200 rounded-lg">
                                                <p className="text-sm text-gray-500">
                                                    Account ID
                                                </p>
                                                <p className="font-medium text-gray-900">
                                                    #{user.id}
                                                </p>
                                            </div>
                                            <div className="p-4 bg-gray-200 rounded-lg">
                                                <p className="text-sm text-gray-500">
                                                    Login Provider
                                                </p>
                                                <p className="font-medium text-gray-900 capitalize">
                                                    {user.provider === 'google'
                                                        ? 'Google'
                                                        : 'Email/Password'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : user?.role === 'student' &&
                      activeTab === 'teacher-application' ? (
                        /* Teacher Application Content */
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                        >
                            {applicationLoading ? (
                                <div className="p-8 text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-950 mx-auto mb-4"></div>
                                    <p className="text-gray-600">
                                        Loading application status...
                                    </p>
                                </div>
                            ) : teacherApplication ? (
                                /* Existing Application Status */
                                <div className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <GraduationCap className="w-6 h-6 text-blue-950" />
                                        <h2 className="text-xl font-bold text-gray-900">
                                            Teacher Application Status
                                        </h2>
                                        <div
                                            className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${getStatusColor(
                                                teacherApplication.status
                                            )}`}
                                        >
                                            {getStatusIcon(
                                                teacherApplication.status
                                            )}
                                            <span className="capitalize font-medium">
                                                {teacherApplication.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-bold text-orange-400 mb-2">
                                                Institution
                                            </label>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                {teacherApplication.institution}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-orange-400 mb-2">
                                                Subject
                                            </label>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                                                {teacherApplication.subject}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div>
                                            <label className="block text-sm font-bold text-orange-400 mb-2">
                                                Teaching Experience
                                            </label>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                                                {teacherApplication.experience}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-orange-400 mb-2">
                                                Motivation
                                            </label>
                                            <p className="text-gray-900 bg-gray-50 p-3 rounded-lg whitespace-pre-wrap">
                                                {teacherApplication.motivation}
                                            </p>
                                        </div>
                                    </div>

                                    {teacherApplication.adminNotes && (
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                            <label className="block text-sm font-bold text-blue-800 mb-2">
                                                Admin Notes
                                            </label>
                                            <p className="text-blue-900 whitespace-pre-wrap">
                                                {teacherApplication.adminNotes}
                                            </p>
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                                        <span>
                                            Submitted:{' '}
                                            {new Date(
                                                teacherApplication.createdAt
                                            ).toLocaleDateString()}
                                        </span>
                                        {teacherApplication.reviewedAt && (
                                            <span>
                                                Reviewed:{' '}
                                                {new Date(
                                                    teacherApplication.reviewedAt
                                                ).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {teacherApplication.status ===
                                        'rejected' && (
                                        <div className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                                            <p className="text-orange-800 text-sm mb-3">
                                                Your application was not
                                                approved this time. You can
                                                submit a new application
                                                addressing the feedback above.
                                            </p>
                                            <button
                                                onClick={() => {
                                                    setTeacherApplication(null);
                                                    fetchTeacherApplication();
                                                }}
                                                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium"
                                            >
                                                Submit New Application
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                /* No Application - Show Form */
                                <div className="p-6">
                                    <div className="text-center mb-6">
                                        <GraduationCap className="w-12 h-12 text-blue-950 mx-auto mb-4" />
                                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                                            Apply for Teacher Access
                                        </h2>
                                        <p className="text-gray-600">
                                            Join our teaching community and help
                                            students excel in their studies
                                        </p>
                                    </div>
                                    <TeacherRequestForm />
                                </div>
                            )}
                        </motion.div>
                    ) : null}
                </div>
            </main>
        </div>
    );
};

export default User;
