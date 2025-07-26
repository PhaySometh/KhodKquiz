import React, { useState, useEffect } from 'react';
import {
    School,
    BookOpen,
    GraduationCap,
    Send,
    CheckCircle,
    AlertCircle,
    Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../utils/axiosConfig';
import toast from 'react-hot-toast';

export default function TeacherRequestForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        institution: '',
        subject: '',
        experience: '',
        motivation: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [existingApplication, setExistingApplication] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check for existing application on component mount
    useEffect(() => {
        checkExistingApplication();
    }, []);

    const checkExistingApplication = async () => {
        try {
            const response = await apiClient.get(
                '/api/teacher-application/my-application'
            );
            setExistingApplication(response.data.application);
        } catch (error) {
            // No existing application found (404 is expected)
            if (error.response?.status !== 404) {
                console.error('Error checking existing application:', error);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        if (
            !formData.institution.trim() ||
            !formData.subject.trim() ||
            !formData.experience.trim() ||
            !formData.motivation.trim()
        ) {
            toast.error('Please fill in all fields');
            return;
        }

        setIsSubmitting(true);

        try {
            await apiClient.post('/api/teacher-application/apply', formData);

            toast.success('Teacher application submitted successfully!', {
                icon: '🎉',
                duration: 5000,
            });

            // Refresh to show the submitted application
            await checkExistingApplication();

            // Clear form
            setFormData({
                institution: '',
                subject: '',
                experience: '',
                motivation: '',
            });
        } catch (error) {
            console.error('Error submitting teacher application:', error);
            const errorMessage =
                error.response?.data?.error || 'Failed to submit application';
            toast.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending':
                return <Clock className="w-5 h-5 text-yellow-600" />;
            case 'approved':
                return <CheckCircle className="w-5 h-5 text-green-600" />;
            case 'rejected':
                return <AlertCircle className="w-5 h-5 text-red-600" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            case 'approved':
                return 'bg-green-50 border-green-200 text-green-800';
            case 'rejected':
                return 'bg-red-50 border-red-200 text-red-800';
            default:
                return 'bg-gray-50 border-gray-200 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="relative w-full max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100">
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto p-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-100">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-orange-50 opacity-50 rounded-2xl -z-10" />

            <div className="mb-10 text-center">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent mb-3">
                    Become a Teacher
                </h2>
                <p className="text-gray-600 text-lg">
                    Join our teaching community and help students excel in their
                    studies
                </p>
            </div>

            {/* Show existing application status if exists */}
            {existingApplication ? (
                <div
                    className={`mb-8 p-6 rounded-xl border ${getStatusColor(
                        existingApplication.status
                    )}`}
                >
                    <div className="flex items-center gap-3 mb-4">
                        {getStatusIcon(existingApplication.status)}
                        <h3 className="text-lg font-semibold capitalize">
                            Application {existingApplication.status}
                        </h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p>
                                <strong>Institution:</strong>{' '}
                                {existingApplication.institution}
                            </p>
                            <p>
                                <strong>Subject:</strong>{' '}
                                {existingApplication.subject}
                            </p>
                        </div>
                        <div>
                            <p>
                                <strong>Submitted:</strong>{' '}
                                {new Date(
                                    existingApplication.createdAt
                                ).toLocaleDateString()}
                            </p>
                            {existingApplication.reviewedAt && (
                                <p>
                                    <strong>Reviewed:</strong>{' '}
                                    {new Date(
                                        existingApplication.reviewedAt
                                    ).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>

                    {existingApplication.adminNotes && (
                        <div className="mt-4 p-3 bg-white/50 rounded-lg">
                            <p className="text-sm">
                                <strong>Admin Notes:</strong>
                            </p>
                            <p className="text-sm mt-1">
                                {existingApplication.adminNotes}
                            </p>
                        </div>
                    )}

                    {existingApplication.status === 'pending' && (
                        <p className="mt-4 text-sm font-medium">
                            Your application is being reviewed. You'll be
                            notified once a decision is made.
                        </p>
                    )}

                    {existingApplication.status === 'approved' && (
                        <p className="mt-4 text-sm font-medium">
                            Congratulations! Your teacher application has been
                            approved. You now have teacher access.
                        </p>
                    )}

                    {existingApplication.status === 'rejected' && (
                        <p className="mt-4 text-sm font-medium">
                            Your application was not approved this time. You may
                            submit a new application addressing the feedback
                            above.
                        </p>
                    )}
                </div>
            ) : null}

            {/* Show form only if no pending application */}
            {!existingApplication ||
            existingApplication.status === 'rejected' ? (
                <form onSubmit={handleSubmit} className="space-y-7">
                    {/* Institution */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-700 font-semibold">
                            <School className="w-5 h-5 text-blue-600" />
                            Institution
                        </label>
                        <input
                            type="text"
                            value={formData.institution}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    institution: e.target.value,
                                }))
                            }
                            placeholder="Your school or institution name"
                            className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-text bg-white/50 backdrop-blur-sm"
                            required
                        />
                    </div>

                    {/* Subject Expertise */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-700 font-semibold">
                            <BookOpen className="w-5 h-5 text-blue-600" />
                            Subject Expertise
                        </label>
                        <input
                            type="text"
                            value={formData.subject}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    subject: e.target.value,
                                }))
                            }
                            placeholder="Your main subject or area of expertise"
                            className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all cursor-text bg-white/50 backdrop-blur-sm"
                            required
                        />
                    </div>

                    {/* Teaching Experience */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-700 font-semibold">
                            <GraduationCap className="w-5 h-5 text-blue-600" />
                            Teaching Experience
                        </label>
                        <textarea
                            value={formData.experience}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    experience: e.target.value,
                                }))
                            }
                            placeholder="Describe your teaching experience (if any)"
                            className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] cursor-text bg-white/50 backdrop-blur-sm"
                            required
                        />
                    </div>

                    {/* Motivation */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-gray-700 font-semibold">
                            <Send className="w-5 h-5 text-blue-600" />
                            Why do you want to teach?
                        </label>
                        <textarea
                            value={formData.motivation}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    motivation: e.target.value,
                                }))
                            }
                            placeholder="Tell us why you want to become a teacher on our platform"
                            className="w-full p-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all min-h-[120px] cursor-text bg-white/50 backdrop-blur-sm"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-3 shadow-lg ${
                                isSubmitting ? 'opacity-75 cursor-wait' : ''
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    {existingApplication?.status === 'rejected'
                                        ? 'Resubmit Application'
                                        : 'Submit Application'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="text-center py-8">
                    <div className="bg-blue-50 border border-blue-200 text-blue-800 px-6 py-4 rounded-xl">
                        <Clock className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                        <p className="font-medium">
                            Application Already Submitted
                        </p>
                        <p className="text-sm mt-1">
                            You have already submitted a teacher application.
                            Please wait for admin review.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
