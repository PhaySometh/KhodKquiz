import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Code, Brain } from 'lucide-react';

/**
 * Authentication Loading Screen Component
 * Shows during initial auth check to prevent flash of unauthenticated state
 */
const AuthLoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-50 flex items-center justify-center">
            <div className="text-center">
                {/* Logo/Brand Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <motion.div
                            animate={{ 
                                rotate: [0, 360],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{ 
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            className="w-12 h-12 bg-gradient-to-r from-blue-950 to-blue-800 rounded-full flex items-center justify-center"
                        >
                            <BookOpen className="w-6 h-6 text-white" />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-blue-950">KhodKquiz</h1>
                    </div>
                    <p className="text-gray-600 text-lg">Test Your Coding Knowledge</p>
                </motion.div>

                {/* Loading Animation */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="mb-6"
                >
                    {/* Bouncing Icons */}
                    <div className="flex items-center justify-center space-x-4 mb-6">
                        {[
                            { icon: Code, delay: 0 },
                            { icon: Brain, delay: 0.2 },
                            { icon: BookOpen, delay: 0.4 }
                        ].map(({ icon: Icon, delay }, index) => (
                            <motion.div
                                key={index}
                                animate={{
                                    y: [0, -12, 0],
                                    scale: [1, 1.1, 1]
                                }}
                                transition={{
                                    duration: 1.2,
                                    repeat: Infinity,
                                    delay: delay,
                                    ease: "easeInOut"
                                }}
                                className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center"
                            >
                                <Icon className="w-5 h-5 text-white" />
                            </motion.div>
                        ))}
                    </div>

                    {/* Loading Dots */}
                    <div className="flex items-center justify-center space-x-2">
                        {[0, 1, 2].map((index) => (
                            <motion.div
                                key={index}
                                animate={{
                                    scale: [1, 1.5, 1],
                                    opacity: [0.5, 1, 0.5]
                                }}
                                transition={{
                                    duration: 1,
                                    repeat: Infinity,
                                    delay: index * 0.2,
                                    ease: "easeInOut"
                                }}
                                className="w-3 h-3 bg-blue-950 rounded-full"
                            />
                        ))}
                    </div>
                </motion.div>

                {/* Loading Text */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="text-center"
                >
                    <motion.p
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                        className="text-blue-950 font-medium text-lg"
                    >
                        Preparing your quiz experience...
                    </motion.p>
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLoadingScreen;
