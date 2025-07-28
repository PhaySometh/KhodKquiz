import React, { useState, useEffect } from 'react';
import {
    Search,
    Eye,
    CheckCircle,
    XCircle,
    School,
    Clock,
    User,
    Calendar,
    FileText,
} from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';
import StatsCard, {
    StatsGrid,
    STAT_CONFIGS,
} from '../../components/common/StatsCard';
import { TextareaField } from '../../components/common/FormField';
import apiClient from '../../utils/axiosConfig';
import { handleApiError, withErrorHandling } from '../../utils/apiErrorHandler';
import toast from 'react-hot-toast';

export default function TeacherRequests() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [reviewModal, setReviewModal] = useState({
        isOpen: false,
        application: null,
        action: null,
    });
    const [adminNotes, setAdminNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        rejected: 0,
        total: 0,
    });

    useEffect(() => {
        fetchApplications();
        fetchStats();
    }, [statusFilter]);

    const fetchApplications = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const response = await withErrorHandling(
                () => apiClient.get(`/api/teacher-application/all?${params}`),
                'fetch teacher applications'
            );
            setApplications(response.applications || []);
        } catch (error) {
            // Error already handled by withErrorHandling
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await withErrorHandling(
                () => apiClient.get('/api/teacher-application/stats'),
                'fetch application statistics',
                { showErrorToast: false } // Don't show toast for stats errors
            );
            setStats(
                response.stats || {
                    pending: 0,
                    approved: 0,
                    rejected: 0,
                    total: 0,
                }
            );
        } catch (error) {
            // Error already handled, set default stats
            setStats({ pending: 0, approved: 0, rejected: 0, total: 0 });
        }
    };

    const handleReview = async () => {
        if (!reviewModal.application || !reviewModal.action) return;

        setSubmitting(true);
        try {
            await apiClient.put(
                `/api/teacher-application/review/${reviewModal.application.id}`,
                {
                    action: reviewModal.action,
                    adminNotes: adminNotes.trim() || null,
                }
            );

            toast.success(`Application ${reviewModal.action}d successfully!`, {
                icon: reviewModal.action === 'approve' ? '✅' : '❌',
            });

            // Refresh data
            await fetchApplications();
            await fetchStats();

            // Close modal
            setReviewModal({ isOpen: false, application: null, action: null });
            setAdminNotes('');
            setSelectedApplication(null);
        } catch (error) {
            console.error('Error reviewing application:', error);
            const errorMessage =
                error.response?.data?.error || 'Failed to review application';
            toast.error(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    const openReviewModal = (application, action) => {
        setReviewModal({ isOpen: true, application, action });
        setAdminNotes('');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <AdminSidebar />
            <div className="w-full overflow-y-auto">
                <AdminNavbar />
                <div className="p-6 h-full w-full">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <School className="w-8 h-8 text-blue-600" />
                            Teacher Applications
                        </h1>
                        <p className="text-gray-600">
                            Review and manage teacher role requests
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <StatsGrid
                        stats={[
                            {
                                id: 'total',
                                icon: <FileText className="w-6 h-6" />,
                                label: 'Total',
                                value: stats.total,
                                ...STAT_CONFIGS.TOTAL,
                            },
                            {
                                id: 'pending',
                                icon: <Clock className="w-6 h-6" />,
                                label: 'Pending',
                                value: stats.pending,
                                ...STAT_CONFIGS.PENDING,
                            },
                            {
                                id: 'approved',
                                icon: <CheckCircle className="w-6 h-6" />,
                                label: 'Approved',
                                value: stats.approved,
                                ...STAT_CONFIGS.APPROVED,
                            },
                            {
                                id: 'rejected',
                                icon: <XCircle className="w-6 h-6" />,
                                label: 'Rejected',
                                value: stats.rejected,
                                ...STAT_CONFIGS.REJECTED,
                            },
                        ]}
                        columns={4}
                        animated={true}
                        className="mb-8"
                    />

                    {/* Filters and Search */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>

                    {/* Applications Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-3 text-gray-600">
                                    Loading applications...
                                </span>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Applicant
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Institution
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Subject
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Submitted
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {applications
                                            .filter(
                                                (app) =>
                                                    app.applicant.name
                                                        .toLowerCase()
                                                        .includes(
                                                            searchTerm.toLowerCase()
                                                        ) ||
                                                    app.applicant.email
                                                        .toLowerCase()
                                                        .includes(
                                                            searchTerm.toLowerCase()
                                                        )
                                            )
                                            .map((application) => (
                                                <tr
                                                    key={application.id}
                                                    className="hover:bg-gray-50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex-shrink-0 h-10 w-10">
                                                                {application
                                                                    .applicant
                                                                    .picture ? (
                                                                    <img
                                                                        className="h-10 w-10 rounded-full"
                                                                        src={
                                                                            application
                                                                                .applicant
                                                                                .picture
                                                                        }
                                                                        alt=""
                                                                    />
                                                                ) : (
                                                                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                                                        <User className="w-5 h-5 text-gray-600" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {
                                                                        application
                                                                            .applicant
                                                                            .name
                                                                    }
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {
                                                                        application
                                                                            .applicant
                                                                            .email
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {
                                                            application.institution
                                                        }
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {application.subject}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                                application.status ===
                                                                'pending'
                                                                    ? 'bg-yellow-100 text-yellow-800'
                                                                    : application.status ===
                                                                      'approved'
                                                                    ? 'bg-green-100 text-green-800'
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}
                                                        >
                                                            {application.status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                application.status.slice(
                                                                    1
                                                                )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(
                                                            application.createdAt
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() =>
                                                                    setSelectedApplication(
                                                                        application
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded cursor-pointer transition-colors"
                                                                title="View Details"
                                                            >
                                                                <Eye
                                                                    size={20}
                                                                />
                                                            </button>
                                                            {application.status ===
                                                                'pending' && (
                                                                <>
                                                                    <button
                                                                        onClick={() =>
                                                                            openReviewModal(
                                                                                application,
                                                                                'approve'
                                                                            )
                                                                        }
                                                                        className="text-green-600 hover:text-green-900 p-1 rounded cursor-pointer transition-colors"
                                                                        title="Approve"
                                                                    >
                                                                        <CheckCircle
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    </button>
                                                                    <button
                                                                        onClick={() =>
                                                                            openReviewModal(
                                                                                application,
                                                                                'reject'
                                                                            )
                                                                        }
                                                                        className="text-red-600 hover:text-red-900 p-1 rounded cursor-pointer transition-colors"
                                                                        title="Reject"
                                                                    >
                                                                        <XCircle
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        {applications.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan="6"
                                                    className="px-6 py-12 text-center"
                                                >
                                                    <div className="text-gray-500">
                                                        <School className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                                        <p className="text-lg font-medium">
                                                            No applications
                                                            found
                                                        </p>
                                                        <p className="text-sm">
                                                            No teacher
                                                            applications match
                                                            your current
                                                            filters.
                                                        </p>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Application Details Modal */}
                    {selectedApplication && (
                        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Application Details
                                        </h2>
                                        <button
                                            onClick={() =>
                                                setSelectedApplication(null)
                                            }
                                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-4">
                                            {selectedApplication.applicant
                                                .picture ? (
                                                <img
                                                    className="h-16 w-16 rounded-full"
                                                    src={
                                                        selectedApplication
                                                            .applicant.picture
                                                    }
                                                    alt=""
                                                />
                                            ) : (
                                                <div className="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center">
                                                    <User className="w-8 h-8 text-gray-600" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {
                                                        selectedApplication
                                                            .applicant.name
                                                    }
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    {
                                                        selectedApplication
                                                            .applicant.email
                                                    }
                                                </p>
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                                                        selectedApplication.status ===
                                                        'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : selectedApplication.status ===
                                                              'approved'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                    }`}
                                                >
                                                    {selectedApplication.status
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        selectedApplication.status.slice(
                                                            1
                                                        )}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">
                                                    Institution
                                                </h3>
                                                <p className="mt-1 text-gray-900">
                                                    {
                                                        selectedApplication.institution
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">
                                                    Subject Expertise
                                                </h3>
                                                <p className="mt-1 text-gray-900">
                                                    {
                                                        selectedApplication.subject
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">
                                                    Submitted
                                                </h3>
                                                <p className="mt-1 text-gray-900">
                                                    {new Date(
                                                        selectedApplication.createdAt
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                            {selectedApplication.reviewedAt && (
                                                <div>
                                                    <h3 className="text-sm font-medium text-gray-500">
                                                        Reviewed
                                                    </h3>
                                                    <p className="mt-1 text-gray-900">
                                                        {new Date(
                                                            selectedApplication.reviewedAt
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Teaching Experience
                                            </h3>
                                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                                                {selectedApplication.experience}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Motivation
                                            </h3>
                                            <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                                                {selectedApplication.motivation}
                                            </p>
                                        </div>

                                        {selectedApplication.adminNotes && (
                                            <div>
                                                <h3 className="text-sm font-medium text-gray-500">
                                                    Admin Notes
                                                </h3>
                                                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                                                    {
                                                        selectedApplication.adminNotes
                                                    }
                                                </p>
                                            </div>
                                        )}

                                        {selectedApplication.status ===
                                            'pending' && (
                                            <div className="flex gap-3 pt-6">
                                                <button
                                                    onClick={() => {
                                                        openReviewModal(
                                                            selectedApplication,
                                                            'approve'
                                                        );
                                                        setSelectedApplication(
                                                            null
                                                        );
                                                    }}
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    <CheckCircle size={20} />
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        openReviewModal(
                                                            selectedApplication,
                                                            'reject'
                                                        );
                                                        setSelectedApplication(
                                                            null
                                                        );
                                                    }}
                                                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                                                >
                                                    <XCircle size={20} />
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Review Modal */}
                    {reviewModal.isOpen && (
                        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-md w-full">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            {reviewModal.action === 'approve'
                                                ? 'Approve'
                                                : 'Reject'}{' '}
                                            Application
                                        </h2>
                                        <button
                                            onClick={() =>
                                                setReviewModal({
                                                    isOpen: false,
                                                    application: null,
                                                    action: null,
                                                })
                                            }
                                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-gray-600 mb-4">
                                            Are you sure you want to{' '}
                                            {reviewModal.action} the application
                                            from{' '}
                                            <strong>
                                                {
                                                    reviewModal.application
                                                        ?.applicant.name
                                                }
                                            </strong>
                                            ?
                                        </p>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Admin Notes (Optional)
                                            </label>
                                            <textarea
                                                value={adminNotes}
                                                onChange={(e) =>
                                                    setAdminNotes(
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Add any notes for the applicant..."
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() =>
                                                setReviewModal({
                                                    isOpen: false,
                                                    application: null,
                                                    action: null,
                                                })
                                            }
                                            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleReview}
                                            disabled={submitting}
                                            className={`flex-1 font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                                                reviewModal.action === 'approve'
                                                    ? 'bg-green-600 hover:bg-green-700 text-white'
                                                    : 'bg-red-600 hover:bg-red-700 text-white'
                                            } ${
                                                submitting
                                                    ? 'opacity-75 cursor-wait'
                                                    : ''
                                            }`}
                                        >
                                            {submitting ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Processing...
                                                </>
                                            ) : (
                                                <>
                                                    {reviewModal.action ===
                                                    'approve' ? (
                                                        <CheckCircle
                                                            size={20}
                                                        />
                                                    ) : (
                                                        <XCircle size={20} />
                                                    )}
                                                    {reviewModal.action ===
                                                    'approve'
                                                        ? 'Approve'
                                                        : 'Reject'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
