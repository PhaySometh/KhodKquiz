import React from 'react';
import NavBar from '../components/NavBar';
import image from '../assets/image/heroBackground.png';

export default function Home() {
    return (
        <>
            <NavBar />
            <div className="relative mt-20 ">
                <img src={image} alt='hero background' className='w-full h-auto'/>
                <h1 className='flex justify-center top-1/2 absolute text-blue-950 text-5xl font-bold w-full item-center'>
                    Welcome to KhodKquiz
                </h1>
            </div>
            
        </>
    );
}
