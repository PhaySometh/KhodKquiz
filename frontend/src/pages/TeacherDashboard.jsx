import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Bell, User, Settings } from 'lucide-react';
import Sidebar from '../components/NavBarDashBoard.jsx'
const TeacherDashboard = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

    // Mock notifications
    useEffect(() => {
        setNotifications([
            { id: 1, text: 'New JavaScript quiz available!', time: '10 min ago', read: false },
            { id: 2, text: 'You earned the "Quick Learner" badge', time: '2 hours ago', read: true },
            { id: 3, text: 'Weekly progress report is ready', time: '1 day ago', read: true },
        ]);
    }, []);
    

    const markNotificationAsRead = (id) => {
        setNotifications(notifications.map(n => 
            n.id === id ? {...n, read: true} : n
        ));
    };

    const unreadNotifications = notifications.filter(n => !n.read).length;
    
    const dashboardCards = [
        {
            title: "Create New Quiz",
            description: "Add new quiz for students",
            link: "/teacher/createquiz",
            icon: (
                <div className="p-3 bg-blue-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                </div>
            ),
            bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
            borderColor: "border-blue-200"
        },
        {
            title: "Manage Quiz",
            description: "Edit existing quiz",
            // link: "/admin/properties/manage",
            icon: (
                <div className="p-3 bg-green-100 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                </div>
            ),
            bgColor: "bg-gradient-to-br from-green-50 to-green-100",
            borderColor: "border-green-200"
        },
        {
            title: "Students",
            description: "View your students performance",
            // link: "/admin/register",
            icon: (
                <div className="p-3 bg-blue-100 rounded-full">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12h4m-2 2v-4M4 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                </div>
            ),
            bgColor: "bg-gradient-to-br from-red-50 to-red-100",
            borderColor: "border-red-200"
        }
    ];
    return (
        <div className='flex h-screen bg-gray-50 overflow-hidden'>
            <Sidebar />

            <div className='w-full overflow-y-auto'>
                {/* Header */}
                <header className="relative z-10 px-6 flex justify-between items-center w-full h-16 bg-white border-b border-gray-200">
                    <div className="text-xl font-bold hidden md:block">
                        <h1 className='text-blue-950'>Teacher <span className='text-orange-400'>Dashboard</span></h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
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
                                onClick={() => setShowNotifications(!showNotifications)}
                            >
                                <Bell className="text-gray-600" size={20} />
                                {unreadNotifications > 0 && (
                                    <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>

                            <div className="relative">
                                <button 
                                    className="flex items-center space-x-2 focus:outline-none"
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                        <User size={16} />
                                    </div>
                                </button>

                                {userMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                            <User size={16} className="mr-2" /> Profile
                                        </a>
                                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                                            <Settings size={16} className="mr-2" /> Settings
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notifications dropdown */}
                    {showNotifications && (
                        <div className="absolute right-4 top-16 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                            <div className="p-3 border-b border-gray-200 font-medium text-gray-700">
                                Notifications
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div 
                                            key={notification.id} 
                                            className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                                            onClick={() => markNotificationAsRead(notification.id)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{notification.text}</p>
                                                    <p className="text-xs text-gray-500">{notification.time}</p>
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
                {/* Dashboard card */}
                <div className='p-6'>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {dashboardCards.map((card, index) => (
                            <Link 
                                key={index}
                                to={card.link}
                                className={`${card.bgColor} p-6 rounded-xl shadow-sm border ${card.borderColor} hover:shadow-md transition-all duration-300 transform hover:-translate-y-1`}
                            >
                                <div className="flex items-start space-x-4">
                                    {card.icon}
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                                        <p className="mt-1 text-sm text-gray-600">{card.description}</p>
                                    </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-800 shadow-sm">
                                        Go to section →
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TeacherDashboard;