import React, { useState } from 'react';
import { School, BookOpen, GraduationCap, Send } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function TeacherRequestForm() {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        userId: user?.id,
        name: user?.name || '',
        email: user?.email || '',
        institution: '',
        subject: '',
        experience: '',
        motivation: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Will be implemented later with backend
            console.log('Teacher request submitted:', formData);

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000); // Hide success message after 5s
        } catch (error) {
            console.error('Error submitting request:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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

                {/* Submit Button and Success Message */}
                <div className="pt-6 space-y-4">
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
                                Submit Application
                            </>
                        )}
                    </button>

                    {/* Success Message */}
                    {showSuccess && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center gap-3 animate-fade-in shadow-sm">
                            <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                <svg
                                    className="w-6 h-6 text-green-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <p className="flex-1 font-medium">
                                Your application has been submitted
                                successfully! We'll review it soon.
                            </p>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
