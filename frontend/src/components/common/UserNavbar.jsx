import UserProfile from "./UserProfile";
import { Bell, Settings, ChevronRight } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function UserNavbar() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

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
    return (
        <>
            {/* Header */}
            <header className="relative z-10 px-6 flex justify-between items-center w-full h-20 bg-white border-b border-gray-200">
                <div className="text-xl font-bold hidden md:block">
                    <h1 className='text-blue-950'>Khod<span className='text-orange-400'>Kquiz</span></h1>
                </div>
                <div className="flex items-center space-x-4">

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
                            >
                                <div className="flex items-center gap-4 w-full justify-end">
                                    {/* Sign Up button (only visible on lg and up) */}
                                    <UserProfile />
                                </div>
                            </button>
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
        </>
    )
};