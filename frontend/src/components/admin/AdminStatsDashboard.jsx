import React, { useState, useEffect } from 'react';
import { Users, Shield, BookOpen, TrendingUp, Loader2 } from 'lucide-react';
import axios from '../../utils/axiosConfig';
import toast from 'react-hot-toast';

const BASE_URL = 'http://localhost:3000';

export default function AdminStatsDashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch dashboard statistics
    const fetchDashboardStats = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}/api/admin/analytics/dashboard`
            );

            if (response.data.success) {
                setDashboardData(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
            toast.error('Failed to fetch dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="flex items-center gap-2 text-blue-950">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Loading dashboard statistics...</span>
                </div>
            </div>
        );
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-gray-500">
                        Failed to load dashboard data
                    </p>
                    <button
                        onClick={fetchDashboardStats}
                        className="mt-2 px-4 py-2 bg-blue-950 text-white rounded-lg hover:bg-blue-900"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const { overview, userDistribution, teacherApplications, trends } =
        dashboardData;

    const stats = [
        {
            title: 'Total Users',
            value: overview.totalUsers,
            icon: Users,
            color: 'bg-blue-500',
            change: `+${trends.userGrowth.growthRate}%`,
            changeType:
                trends.userGrowth.growthRate >= 0 ? 'positive' : 'negative',
        },
        {
            title: 'Teacher Applications',
            value: teacherApplications.total,
            icon: Shield,
            color: 'bg-purple-500',
            change: `${teacherApplications.pending} pending`,
            changeType: 'neutral',
        },
        {
            title: 'Active Quizzes',
            value: overview.totalQuizzes,
            icon: BookOpen,
            color: 'bg-green-500',
            change: `+${trends.quizActivity.growthRate}%`,
            changeType:
                trends.quizActivity.growthRate >= 0 ? 'positive' : 'negative',
        },
        {
            title: 'Quiz Attempts',
            value: overview.totalQuizAttempts,
            icon: TrendingUp,
            color: 'bg-orange-500',
            change: `${overview.quizAttemptsThisMonth} this month`,
            changeType: 'positive',
        },
    ];

    const usersByRole = [
        {
            id: 1,
            name: 'student',
            count: userDistribution.student,
            color: 'bg-green-500',
        },
        {
            id: 2,
            name: 'teacher',
            count: userDistribution.teacher,
            color: 'bg-blue-500',
        },
        {
            id: 3,
            name: 'admin',
            count: userDistribution.admin,
            color: 'bg-red-500',
        },
    ];

    const totalUsers = overview.totalUsers;

    return (
        <div className="space-y-6">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">
                                    {stat.title}
                                </p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                                <div className="flex items-center mt-2">
                                    <span
                                        className={`text-sm font-medium ${
                                            stat.changeType === 'positive'
                                                ? 'text-green-600'
                                                : stat.changeType === 'negative'
                                                ? 'text-red-600'
                                                : 'text-blue-600'
                                        }`}
                                    >
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">
                                        {stat.changeType === 'neutral'
                                            ? ''
                                            : 'vs last month'}
                                    </span>
                                </div>
                            </div>
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Users by Role */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Shield size={20} />
                    Users by Role
                </h3>
                <div className="space-y-4">
                    {usersByRole.map((role) => (
                        <div
                            key={role.id}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-3 h-3 rounded-full ${role.color}`}
                                ></div>
                                <span className="text-sm font-medium text-gray-900 capitalize">
                                    {role.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">
                                    {role.count} users
                                </span>
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${role.color}`}
                                        style={{
                                            width: `${Math.max(
                                                (role.count / totalUsers) * 100,
                                                5
                                            )}%`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
