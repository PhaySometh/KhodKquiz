import React from 'react';
import { Users, Shield, BookOpen, TrendingUp } from 'lucide-react';

export default function AdminStatsDashboard() {
    // Static data for demonstration
    const stats = [
        {
            title: 'Total Users',
            value: 182,
            icon: Users,
            color: 'bg-blue-500',
            change: '+12%',
            changeType: 'positive',
        },
        {
            title: 'Total Roles',
            value: 4,
            icon: Shield,
            color: 'bg-purple-500',
            change: '+2%',
            changeType: 'positive',
        },
        {
            title: 'Active Quizzes',
            value: 45,
            icon: BookOpen,
            color: 'bg-green-500',
            change: '+8%',
            changeType: 'positive',
        },
        {
            title: 'Monthly Growth',
            value: '23%',
            icon: TrendingUp,
            color: 'bg-orange-500',
            change: '+5%',
            changeType: 'positive',
        },
    ];

    // Static users by role data
    const usersByRole = [
        {
            id: 1,
            name: 'student',
            count: 150,
            color: 'bg-green-500',
        },
        {
            id: 2,
            name: 'teacher',
            count: 25,
            color: 'bg-blue-500',
        },
        {
            id: 3,
            name: 'moderator',
            count: 5,
            color: 'bg-purple-500',
        },
        {
            id: 4,
            name: 'admin',
            count: 2,
            color: 'bg-red-500',
        },
    ];

    const totalUsers = 182;

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
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {stat.change}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">
                                        vs last month
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
