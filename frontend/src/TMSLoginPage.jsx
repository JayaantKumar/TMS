import React, { useState, useEffect } from 'react';

const CrisLogo = () => <div className="h-8 w-16 bg-white/80 flex items-center justify-center text-xs text-black font-bold">CRIS</div>;

// ==================== START: NEW IMAGES ARRAY ====================
// URLs for your background images. Add or change them here.
const backgroundImages = [
    'https://tse1.mm.bing.net/th/id/OIP.raxJw0DRpizy6Xoi8g2CkgHaE8?pid=Api&P=0&h=180', // Image of tracks from a station
    'https://tse1.mm.bing.net/th/id/OIP.3KsWQvvT00xnWiQyNLADHgHaEK?pid=Api&P=0&h=180', // Image of railway workers
    'https://tse3.mm.bing.net/th/id/OIP.lPRGW7I2TSR-GfaC0Y4hlgHaE7?pid=Api&P=0&h=180', // Image of a train moving
    'https://tse2.mm.bing.net/th/id/OIP.lIWgMLUyGsdpOyx8TuTaYwHaEK?pid=Api&P=0&h=180'  // Original complex track image
];
// ===================== END: NEW IMAGES ARRAY =====================


const TMSLoginPage = () => {

    // ==================== START: NEW STATE AND EFFECT FOR SLIDESHOW ====================
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % backgroundImages.length
            );
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(timer); // Cleanup the timer on component unmount
    }, []);
    // ===================== END: NEW STATE AND EFFECT FOR SLIDESHOW =====================

    return (
        <div className="relative min-h-screen w-full flex flex-col items-center text-white">
            
            {/* ==================== START: NEW BACKGROUND RENDERING LOGIC ==================== */}
            {backgroundImages.map((imageUrl, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                    style={{ backgroundImage: `url(${imageUrl})` }}
                />
            ))}
            {/* ===================== END: NEW BACKGROUND RENDERING LOGIC ===================== */}

            {/* Background Overlay */}
            <div className="absolute inset-0 bg-black/60 z-0"></div>

            {/* Header */}
            <header className="w-full bg-[#a96628] p-3 shadow-md z-10">
                <div className="flex justify-between items-center max-w-7xl mx-auto">
                    <div className="bg-white p-1 rounded-full">
                        <img 
                            src="https://indianrailways.gov.in/railwayboard/images/logo.png" 
                            alt="Indian Railways Logo" 
                            className="h-12 w-12" 
                        />
                    </div>
                    <div className="text-center text-white">
                        <h1 className="text-xl md:text-3xl font-bold">रेलपथ प्रबंधन प्रणाली</h1>
                        <h2 className="text-lg md:text-2xl font-semibold">Track Management System</h2>
                    </div>
                    <div className="flex items-center space-x-4">
                        <img 
                            src="https://s3-ap-south-1.amazonaws.com/kmrldata/wp-content/uploads/2017/08/13090743/g20-logo-with-AKAM-01S.jpg" 
                            alt="G20 Logo" 
                            className="h-14" 
                        />
                    </div>
                </div>
            </header>
            
            {/* Main Content - Login Form */}
            <main className="z-10 flex-grow flex justify-end items-center w-full p-4 pr-24">
                <div className="bg-[#d8a56d]/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl w-full max-w-md text-gray-800">
                    {/* ... your form code remains the same ... */}
                    <div className="text-center mb-6">
                        <div className="inline-block p-3 bg-gray-700 rounded-full mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <p className="font-semibold text-lg">यूजर आईडी और पासवर्ड प्रविष्ट करे</p>
                        <p className="font-semibold text-lg">Please Enter User ID & Password</p>
                    </div>

                    <form className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <input
                                type="text"
                                placeholder="Enter your user id"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-700 focus:border-yellow-700"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-700 focus:border-yellow-700"
                            />
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 bg-gray-200 border border-gray-400 px-4 py-2 rounded-md font-mono text-xl tracking-widest">
                                a u 9 v g
                            </div>
                            <input
                                type="text"
                                placeholder="Enter captcha text"
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-700 focus:border-yellow-700"
                            />
                        </div>
                        
                        <button type="submit" className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700">
                             लॉग इन करें / Login
                        </button>
                    </form>

                    <a href="#" className="block text-sm text-center mt-4 text-gray-700 hover:text-black hover:underline">
                        पासवर्ड भूल गए / Forgot Password ?
                    </a>
                    
                    <div className="flex items-center my-4">
                        <hr className="flex-grow border-gray-400"/>
                        <span className="px-2 text-gray-600 font-semibold">OR</span>
                        <hr className="flex-grow border-gray-400"/>
                    </div>

                    <button className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#2b95a2] hover:bg-[#25818d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2b95a2]">
                        Login using IR-SSO
                    </button>
                </div>
            </main>

            {/* Footer */}
            <footer className="absolute bottom-0 left-0 right-0 z-10 flex justify-between items-center p-2 bg-[#a96628] text-xs text-white">
                <div className="flex items-center space-x-2">
                    <span>Designed & Developed by</span>
                    <CrisLogo />
                </div>
                <div>
                    Last updated on: 10/09/2025, 10:30
                </div>
                <div>
                    © 2009, Ministry of Railways, India. All rights reserved
                </div>
            </footer>
        </div>
    );
};

export default TMSLoginPage;