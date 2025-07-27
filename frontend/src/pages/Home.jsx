import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Navbar from '../components/common/Navbar';
import image from '../assets/image/heroBackground.svg';
import Button from '../components/Button';
import Footer from '../components/common/Footer';
import {
    BrainCircuit,
    Trophy,
    BookOpenCheck,
    User,
    Clock,
    Target,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TeacherRequestForm from '../components/TeacherRequestForm';

// Animation variants for the staggered text
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: 'spring',
            stiffness: 100,
        },
    },
};

const FeatureCard = ({ icon, title, description, index }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.2,
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: index * 0.2,
                ease: 'easeOut',
            },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={cardVariants}
            initial="hidden"
            animate={controls}
            className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center text-center"
        >
            <div className="bg-orange-100 p-4 rounded-full text-orange-500 mb-4">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-blue-950 mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
        </motion.div>
    );
};

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const controls = useAnimation();
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.5,
    });

    useEffect(() => {
        if (inView) {
            controls.start('visible');
        }
    }, [controls, inView]);

    const khodKquiz = 'KhodKquiz'.split('');

    return (
        <>
            <Navbar />
            <div className="relative mt-20 overflow-hidden">
                {/* Hero Section */}
                <div className="relative w-full h-[calc(100vh-5rem)] flex items-center justify-center z-1">
                    <motion.img
                        src={image}
                        alt="hero background"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        transition={{ duration: 1.5, ease: 'easeOut' }}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                    <motion.div
                        ref={ref}
                        initial="hidden"
                        animate={controls}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.3,
                                    delayChildren: 0.2,
                                },
                            },
                        }}
                        className="relative z-10 flex flex-col items-center text-center px-4"
                    >
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 50 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.8,
                                        ease: 'easeOut',
                                    },
                                },
                            }}
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-blue-950"
                        >
                            Challenge Your Coding Skills
                        </motion.h1>
                        <motion.h1
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mt-2"
                        >
                            {khodKquiz.map((letter, index) => (
                                <motion.span
                                    key={index}
                                    variants={letterVariants}
                                    className={
                                        index < 4
                                            ? 'text-blue-950'
                                            : 'text-orange-400'
                                    }
                                >
                                    {letter}
                                </motion.span>
                            ))}
                        </motion.h1>

                        <motion.p
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.8,
                                        ease: 'easeOut',
                                    },
                                },
                            }}
                            className="mt-4 max-w-2xl text-lg text-gray-700"
                        >
                            A full-stack real-time quiz application to test your
                            coding knowledge, compete on leaderboards, and earn
                            badges.
                        </motion.p>
                        <motion.div
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: {
                                    opacity: 1,
                                    y: 0,
                                    transition: {
                                        duration: 0.8,
                                        ease: 'easeOut',
                                    },
                                },
                            }}
                            className="flex justify-center gap-5 mt-8"
                        >
                            <Button
                                to="quiz/category"
                                label="Test Your Skills"
                                bgColor="bg-blue-950"
                                textColor="text-white"
                            />
                            {!isAuthenticated && (
                                <Button
                                    to="signup"
                                    label="Be Our User"
                                    bgColor="bg-orange-400"
                                    textColor="text-white"
                                />
                            )}
                            {isAuthenticated && (
                                <Button
                                    to="profile"
                                    label="My Profile"
                                    bgColor="bg-orange-400"
                                    textColor="text-white"
                                />
                            )}
                        </motion.div>
                    </motion.div>
                </div>

                {/* Why KhodKquiz? Section */}
                <div className="bg-gray-50 py-10">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center text-blue-950 mb-12">
                            Why KhodKquiz?
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard
                                icon={<BookOpenCheck size={32} />}
                                title="Category-based Quizzes"
                                description="Test your knowledge in various programming languages like C, C++, JavaScript, and more."
                                index={0}
                            />
                            <FeatureCard
                                icon={<Trophy size={32} />}
                                title="Real-Time Leaderboard"
                                description="Compete with other users in real-time and see where you stand on the leaderboard."
                                index={1}
                            />
                            <FeatureCard
                                icon={<BrainCircuit size={32} />}
                                title="Point System & Badges"
                                description="Earn points for correct answers, unlock badges, and showcase your achievements."
                                index={2}
                            />
                        </div>
                    </div>
                </div>

                {/* Demo Section for Teacher Registration */}
                {/* <div className="p-6 bg-muted/30 rounded-lg border">
                    <h2 className="text-2xl font-semibold mb-4 text-primary">
                        🎓 Teacher Registration Demo
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        Check out the KhodKquiz-style teacher registration form
                    </p>
                    <a
                        href="/teacher-registration"
                        className="inline-flex items-center px-6 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors"
                    >
                        View Teacher Registration Form
                    </a>
                </div> */}

                {/* Conditional Bottom Section */}
                {!isAuthenticated ? (
                    /* Get Started Section for Unauthenticated Users */
                    <div className="bg-blue-950 text-white py-20">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                Ready to Test Your Mettle?
                            </h2>
                            <p className="text-lg mb-8">
                                Sign up now and start your journey to becoming a
                                coding champion.
                            </p>
                            <Button
                                to="signup"
                                label="Sign Up for Free"
                                bgColor="bg-orange-400"
                                textColor="text-white"
                            />
                        </div>
                    </div>
                ) : (
                    /* Welcome Back Section for Authenticated Users */
                    <div className="bg-blue-950 text-white py-20">
                        <div className="container mx-auto px-6 text-center">
                            <h2 className="text-3xl font-bold mb-4">
                                Welcome back, {user?.name}!
                            </h2>
                            <p className="text-lg mb-8">
                                Continue your coding journey and improve your
                                skills.
                            </p>
                            <div className="flex justify-center gap-4">
                                <Button
                                    to="quiz/category"
                                    label="Take Quiz"
                                    bgColor="bg-orange-400"
                                    textColor="text-white"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </>
    );
}
