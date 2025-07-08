import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bell, User, Settings, ChevronRight } from 'lucide-react';
import Sidebar from '../../../components/client/teacher/TeacherSidebar.jsx'
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../../../components/common/UserNavbar.jsx';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    const dashboardCards = [
        {
            title: "Javascript",
            description: "View your students performance",
        },
        {
            title: "Python",
            description: "View your students performance",
        },
        {
            title: "Web Development",
            description: "View your students performance",
        },
        {
            title: "Web Development",
            description: "View your students performance",
        },
    ];
    return (
        <>
            <div className='flex h-screen bg-gray-50 overflow-hidden'>
                <Sidebar />
                <div className='w-full overflow-y-auto'>
                    <UserNavbar />
                    {/* Dashboard card */}
                    <div className='p-6 h-full w-full'>
                        {/* Hero Section */}
                        <motion.div 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="relative w-full flex flex-col items-center justify-center p-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-8"
                        >
                            <h3 className="text-3xl md:text-4xl text-blue-950 font-bold text-center mb-2">
                                What will you learn today?
                            </h3>
                            <p className="text-gray-600 text-center mb-6 max-w-2xl">
                                Choose from hundreds of quizzes to test your knowledge and learn new skills.
                            </p>
                            
                            <div className="relative w-full max-w-2xl">
                                <div className="bg-white px-4 py-3 flex items-center rounded-full w-full justify-between shadow-md hover:shadow-lg transition-shadow">
                                    <Search className="text-gray-400" size={20} />
                                    <input
                                        className="text-blue-950 w-full outline-none ml-3 placeholder-gray-400"
                                        placeholder="Search for any topic or language..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full p-2 hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md">
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                        <AnimatePresence mode="wait">
                            <motion.div
                                key="categories"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {dashboardCards.map((card, index) => (
                                    <div 
                                        key={index}
                                        className='bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1'
                                    >
                                        <div className="flex items-start space-x-4">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
                                                <p className="mt-1 text-[10px] text-gray-600">{card.description}</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-3 justify-center">
                                            <button 
                                                onClick={() => navigate(`/teacher/createquiz`)}
                                                className="p-3 bg-blue-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/teacher/managequiz`)}
                                                className="p-3 bg-orange-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>
                                                </svg>
                                            </button>
                                            <button 
                                                onClick={() => navigate(`/teacher/analytic`)}
                                                className="p-3 bg-green-100 rounded-full cursor-pointer transition-all duration-300 transform hover:scale-110">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path d="M11 13H7"/><path d="M19 9h-4"/><path d="M3 3v16a2 2 0 0 0 2 2h16"/><rect x="15" y="5" width="4" height="12" rx="1"/><rect x="7" y="8" width="4" height="9" rx="1"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    )
};

export default TeacherDashboard;