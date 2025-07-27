import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/common/Navbar';
import ProfilePictureUpload from '../components/ProfilePictureUpload';
import toast from 'react-hot-toast';

const User = () => {
    const { user, updateProfile, loading } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedName, setEditedName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploadingPicture, setIsUploadingPicture] = useState(false);

    useEffect(() => {
        if (user) {
            setEditedName(user.name || '');
        }
    }, [user]);

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

                    {/* Profile Card */}
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
                </div>
            </main>
        </div>
    );
};

export default User;
