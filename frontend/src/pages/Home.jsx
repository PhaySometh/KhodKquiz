import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import NavBar from '../components/NavBar';
import image from '../assets/image/heroBackground.svg';
import Button from '../components/Button';

export default function Home() {
    const [scrollY, setScrollY] = useState(0);
    const controls = useAnimation();

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            setScrollY(currentY);

            // You can animate or update opacity based on scroll if desired
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <NavBar />
            <div className="relative mt-20 overflow-hidden">
                {/* Background SVG with fade-in effect */}
                <motion.img
                    src={image}
                    alt="hero background"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="w-full h-auto"
                />

                {/* Welcome text with rise and fade animation */}
                <motion.h1
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, delay: 0.5, ease: 'easeOut' }}
                    style={{
                        opacity: scrollY > 200 ? 0.3 : 1,
                        transition: 'opacity 0.4s ease',
                    }}
                    className="flex justify-center flex-col items-center absolute top-1/2 transform -translate-y-1/2 text-blue-950 w-full text-center px-4
                    text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold">
                    <div>
                        <div>Welcome to {''}</div>
                        <div className="">
                            <span className="text-blue-950 ml-2">Khod</span>
                            <span className="text-orange-400">Kquiz</span>
                        </div>
                    </div>
                    <div className='flex justify-between gap-5 mt-5 text-xl'>
                        <Button
                            to="quiz"
                            label="Test Your Skills"
                            bgColor="bg-blue-950"
                            textColor="text-white"
                        />
                        <Button
                            to="signup"
                            label="Be Our User"
                            bgColor="bg-orange-400"
                            textColor="text-white"
                        />
                    </div>
                </motion.h1>
                <div className='flex justify-center items-center font-bold text-5xl '>
                    second section
                </div>
            </div>
        </>
    );
}
