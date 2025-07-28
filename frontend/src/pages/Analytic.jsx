import Sidebar from '../components/client/teacher/TeacherSidebar';
import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Settings } from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts';

/**
 * Quiz Analytics Component
 *
 * This component provides analytics and insights for quiz submissions.
 * Currently displays placeholder data - should be connected to real analytics API
 * when quiz submission tracking is fully implemented.
 */

const COLORS = ['#22c55e', '#facc15', '#f97316', '#ef4444', '#6366f1'];

const QuizAnalytics = () => {
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [quizSubmissions, setQuizSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Initialize component with empty data
     * TODO: Replace with actual API calls when analytics backend is implemented
     */
    useEffect(() => {
        // Initialize with empty data for now
        setQuizSubmissions([]);
        setNotifications([]);
        setLoading(false);

        // Future implementation:
        // fetchQuizAnalytics();
        // fetchNotifications();
    }, []);

    const markNotificationAsRead = (id) => {
        setNotifications(
            notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        );
    };

    const unreadNotifications = notifications.filter((n) => !n.read).length;

    const averageScore = (subs) =>
        (subs.reduce((sum, s) => sum + s.score, 0) / subs.length).toFixed(1);

    const topScore = Math.max(...selectedQuiz.submissions.map((s) => s.score));

    const chartData = [
        {
            range: '50–59',
            count: selectedQuiz.submissions.filter(
                (s) => s.score >= 50 && s.score < 60
            ).length,
        },
        {
            range: '60–69',
            count: selectedQuiz.submissions.filter(
                (s) => s.score >= 60 && s.score < 70
            ).length,
        },
        {
            range: '70–79',
            count: selectedQuiz.submissions.filter(
                (s) => s.score >= 70 && s.score < 80
            ).length,
        },
        {
            range: '80–89',
            count: selectedQuiz.submissions.filter(
                (s) => s.score >= 80 && s.score < 90
            ).length,
        },
        {
            range: '90–100',
            count: selectedQuiz.submissions.filter((s) => s.score >= 90).length,
        },
    ];

    const pieData = chartData.map((d) => ({
        name: d.range,
        value: d.count,
    }));

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar />
            <div className="w-full overflow-y-auto">
                {/* Header */}
                <header className="relative z-10 px-6 flex justify-between items-center w-full h-20 bg-white border-b border-gray-200">
                    <div className="text-xl font-bold hidden md:block">
                        <h1 className="text-blue-950">
                            Teacher{' '}
                            <span className="text-orange-400">Dashboard</span>
                        </h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={20}
                            />
                            <input
                                className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center space-x-2">
                            <button
                                className="relative p-1 rounded-full hover:bg-gray-100"
                                onClick={() =>
                                    setShowNotifications(!showNotifications)
                                }
                            >
                                <Bell className="text-gray-600" size={20} />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            <div className="relative">
                                <button
                                    className="flex items-center space-x-2 focus:outline-none"
                                    onClick={() =>
                                        setUserMenuOpen(!userMenuOpen)
                                    }
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <User size={16} />
                                    </div>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <a
                                            href="#"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <User size={16} className="mr-2" />{' '}
                                            Profile
                                        </a>
                                        <a
                                            href="#"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <Settings
                                                size={16}
                                                className="mr-2"
                                            />{' '}
                                            Settings
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {showNotifications && (
                        <div className="absolute right-4 top-16 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-3 border-b border-gray-200 font-medium text-gray-700">
                                Notifications
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                                                !notification.read
                                                    ? 'bg-blue-50'
                                                    : ''
                                            }`}
                                            onClick={() =>
                                                markNotificationAsRead(
                                                    notification.id
                                                )
                                            }
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {notification.text}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {notification.time}
                                                    </p>
                                                </div>
                                                {!notification.read && (
                                                    <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-gray-500 text-sm">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                            <div className="p-2 text-center text-sm text-blue-600 hover:bg-gray-50 cursor-pointer border-t border-gray-200">
                                View all notifications
                            </div>
                        </div>
                    )}
                </header>

                <div className="p-6 space-y-6">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-blue-900 w-full">
                            📊 Quiz Analytics
                        </h1>
                        <select
                            className="w-100 p-2 border border-gray-300 rounded"
                            onChange={(e) => {
                                const id = parseInt(e.target.value);
                                setSelectedQuiz(
                                    mockSubmissions.find((q) => q.quizId === id)
                                );
                            }}
                        >
                            {mockSubmissions.map((quiz) => (
                                <option key={quiz.quizId} value={quiz.quizId}>
                                    {quiz.quizTitle}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex gap-5 flex-wrap">
                        <div className="flex-1 bg-white border p-4 rounded shadow space-y-2 min-w-[280px]">
                            <h2 className="text-xl font-semibold">
                                {selectedQuiz.quizTitle}
                            </h2>
                            <div className="border border-gray-300 rounded-lg p-6">
                                <p>
                                    Total Submissions:{' '}
                                    {selectedQuiz.submissions.length}
                                </p>
                                <p>
                                    Average Score:{' '}
                                    {averageScore(selectedQuiz.submissions)}%
                                </p>
                            </div>
                        </div>

                        <div className="flex-[2] min-w-[300px] h-64 bg-white p-4 border rounded shadow">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="range" />
                                    <YAxis allowDecimals={false} />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#4f46e5" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="flex-[1] min-w-[300px] h-64 bg-white p-4 border rounded shadow">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        label
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={
                                                    COLORS[
                                                        index % COLORS.length
                                                    ]
                                                }
                                            />
                                        ))}
                                    </Pie>
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border border-gray-300">
                            <thead className="bg-blue-100 text-sm text-blue-900">
                                <tr>
                                    <th className="px-4 py-2 border border-gray-300">
                                        Student
                                    </th>
                                    <th className="px-4 py-2 border border-gray-300">
                                        Score
                                    </th>
                                    <th className="px-4 py-2 border border-gray-300">
                                        Time Taken
                                    </th>
                                    <th className="px-4 py-2 border border-gray-300">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedQuiz.submissions.map((s, i) => {
                                    const scoreColor =
                                        s.score >= 85
                                            ? 'bg-green-100 text-green-800'
                                            : s.score >= 70
                                            ? 'bg-orange-100 text-orange-800'
                                            : 'bg-red-100 text-red-800';
                                    return (
                                        <tr
                                            key={i}
                                            className="text-sm even:bg-gray-50 hover:bg-blue-50"
                                        >
                                            <td className="px-4 py-2 border border-gray-300">
                                                {s.studentName}
                                                {s.score === topScore && (
                                                    <span className="ml-2 inline-block bg-yellow-300 text-yellow-900 text-xs px-2 py-0.5 rounded-full">
                                                        🏆 Top
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full font-medium ${scoreColor}`}
                                                >
                                                    {s.score}%
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                {s.timeTaken}
                                            </td>
                                            <td className="px-4 py-2 border border-gray-300">
                                                {s.submittedAt}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizAnalytics;
