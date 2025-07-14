import React, { useState } from 'react';
import { Search, Eye, CheckCircle, XCircle, School } from 'lucide-react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminNavbar from '../../components/admin/AdminNavbar';

// Mock data for demonstration
const MOCK_REQUESTS = [
    {
        id: 1,
        userId: 'USR001',
        name: 'John Doe',
        email: 'john@example.com',
        institution: 'Cambridge University',
        subject: 'Mathematics',
        experience:
            '3 years of teaching experience in high school mathematics...',
        motivation:
            'I am passionate about making mathematics accessible to everyone...',
        status: 'pending',
        submittedAt: '2025-07-10T10:30:00Z',
    },
    // Add more mock data as needed
];

export default function TeacherRequests() {
    const [requests, setRequests] = useState(MOCK_REQUESTS);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState(null);

    const handleApprove = (requestId) => {
        // Will be implemented with backend
        console.log('Approved request:', requestId);
    };

    const handleReject = (requestId) => {
        // Will be implemented with backend
        console.log('Rejected request:', requestId);
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

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
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
                    </div>

                    {/* Requests Table */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                                            Submitted
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {requests.map((request) => (
                                        <tr
                                            key={request.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {request.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        {request.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.institution}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {request.subject}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(
                                                    request.submittedAt
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() =>
                                                            setSelectedRequest(
                                                                request
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 p-1 rounded cursor-pointer transition-colors"
                                                        title="View Details"
                                                    >
                                                        <Eye size={20} />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleApprove(
                                                                request.id
                                                            )
                                                        }
                                                        className="text-green-600 hover:text-green-900 p-1 rounded cursor-pointer transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle
                                                            size={20}
                                                        />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleReject(
                                                                request.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-900 p-1 rounded cursor-pointer transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle size={20} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Request Details Modal */}
                    {selectedRequest && (
                        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-xl font-semibold text-gray-900">
                                            Application Details
                                        </h2>
                                        <button
                                            onClick={() =>
                                                setSelectedRequest(null)
                                            }
                                            className="text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            <XCircle size={24} />
                                        </button>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Applicant
                                            </h3>
                                            <p className="mt-1 text-lg text-gray-900">
                                                {selectedRequest.name}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {selectedRequest.email}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Institution
                                            </h3>
                                            <p className="mt-1 text-lg text-gray-900">
                                                {selectedRequest.institution}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Subject Expertise
                                            </h3>
                                            <p className="mt-1 text-lg text-gray-900">
                                                {selectedRequest.subject}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Teaching Experience
                                            </h3>
                                            <p className="mt-1 text-gray-900">
                                                {selectedRequest.experience}
                                            </p>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-500">
                                                Motivation
                                            </h3>
                                            <p className="mt-1 text-gray-900">
                                                {selectedRequest.motivation}
                                            </p>
                                        </div>

                                        <div className="flex gap-3 pt-6">
                                            <button
                                                onClick={() => {
                                                    handleApprove(
                                                        selectedRequest.id
                                                    );
                                                    setSelectedRequest(null);
                                                }}
                                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <CheckCircle size={20} />
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleReject(
                                                        selectedRequest.id
                                                    );
                                                    setSelectedRequest(null);
                                                }}
                                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                                            >
                                                <XCircle size={20} />
                                                Reject
                                            </button>
                                        </div>
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
