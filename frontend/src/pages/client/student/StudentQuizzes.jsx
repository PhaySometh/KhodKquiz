import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, Clock, Award, BarChart2, ChevronLeft, CheckCircle, XCircle, BookOpen, Search } from 'lucide-react';
import UserNavbar from "../../../components/common/UserNavbar";
import StudentSidebar from '../../../components/client/student/StudentSidebar';
import { useNavigate, useParams } from 'react-router-dom';

export default function QuizList() {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    
    // Hardcoded category details
    const category = {
        name: "JavaScript",
        icon: <Code />,
        description: "Test your knowledge of JavaScript, the world's most popular programming language",
        color: "bg-yellow-100 text-yellow-600"
    };

    // Hardcoded quizzes data
    const quizzes = [
        {
            id: 1,
            title: "JavaScript Basics",
            description: "Test your knowledge of fundamental JavaScript concepts",
            difficulty: "Beginner",
            timeLimit: 20,
            questionsCount: 15,
            attempts: 1245,
            averageAccuracy: 72
        },
        {
            id: 2,
            title: "ES6 Features",
            description: "Quiz on modern JavaScript features introduced in ES6",
            difficulty: "Intermediate",
            timeLimit: 30,
            questionsCount: 20,
            attempts: 892,
            averageAccuracy: 65
        },
        {
            id: 3,
            title: "DOM Manipulation",
            description: "Test your skills in working with the Document Object Model",
            difficulty: "Intermediate",
            timeLimit: 25,
            questionsCount: 18,
            attempts: 756,
            averageAccuracy: 68
        }
    ];

    // Filter quizzes based on search query
    const filteredQuizzes = quizzes.filter(quiz => 
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <StudentSidebar />

            <div className="w-full overflow-y-auto">
                <UserNavbar />

                <main className="p-6">
                    {/* Category Header */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => navigate(-1)}
                                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                            >
                                <ChevronLeft size={24} />
                            </button>
                            {/* <div className={`${category.color} p-3 rounded-full`}>
                                {category.icon}
                            </div> */}
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">{category.name}</h2>
                                <p className="text-gray-600">{category.description}</p>
                            </div>
                        </div>
                        
                        <div className="relative w-full md:w-64">
                            <div className="bg-white px-4 py-2 flex items-center rounded-full w-full border border-gray-200">
                                <Search className="text-gray-400" size={18} />
                                <input
                                    className="text-gray-700 w-full outline-none ml-2 placeholder-gray-400 text-sm"
                                    placeholder="Search quizzes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Quiz List */}
                    <div className="space-y-4">
                        {filteredQuizzes.length > 0 ? (
                            filteredQuizzes.map((quiz, index) => (
                                <motion.div
                                    key={quiz.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 mb-2">{quiz.title}</h3>
                                            <p className="text-gray-600 mb-4">{quiz.description}</p>
                                            
                                            <div className="flex flex-wrap gap-3">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Clock size={16} className="mr-1" />
                                                    {quiz.timeLimit} sec per question
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <BarChart2 size={16} className="mr-1" />
                                                    {quiz.questionsCount} questions
                                                </div>
                                                <div className={`flex items-center text-sm ${
                                                    quiz.difficulty === "Beginner" ? "text-green-600" :
                                                    quiz.difficulty === "Intermediate" ? "text-yellow-600" :
                                                    "text-red-600"
                                                }`}>
                                                    {quiz.difficulty === "Beginner" ? (
                                                        <CheckCircle size={16} className="mr-1" />
                                                    ) : (
                                                        <XCircle size={16} className="mr-1" />
                                                    )}
                                                    {quiz.difficulty}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="flex flex-col items-end gap-2">
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Average accuracy</p>
                                                <p className="text-lg font-bold text-blue-600">{quiz.averageAccuracy}%</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">Attempts</p>
                                                <p className="text-gray-700">{quiz.attempts.toLocaleString()}</p>
                                            </div>
                                            <button 
                                                onClick={() => navigate(`/quiz/${quiz.id}`)}
                                                className="mt-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 px-6 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
                                            >
                                                Start Quiz
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center"
                            >
                                <Award className="mx-auto text-gray-400 mb-4" size={40} />
                                <h5 className="text-lg font-medium text-gray-700 mb-2">No quizzes found</h5>
                                <p className="text-gray-500">
                                    {searchQuery ? 
                                        "No quizzes match your search. Try a different term." : 
                                        "There are currently no quizzes available for this category."}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}