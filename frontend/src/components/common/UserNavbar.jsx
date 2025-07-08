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
            </header>
        </>
    )
};