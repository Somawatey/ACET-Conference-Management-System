import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import Login from '../Pages/Auth/Login.jsx';

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const testimonialsData = [
        {
            name: 'Hikmet Atceken',
            title: 'Natural Language Processing',
            text: "Pulsefy's our daily tool to bypass averages and reveal true insights, for the whole team!",
            avatar: 'https://i.pravatar.cc/150?img=1',
        },
        {
            name: 'Arda Guler',
            title: 'Artificial Intelligence in Technology',
            text: "Pulsefy levels the analytics field for our team, enabling both beginners and pros to easily bypass average data and uncover the actionable insights that truly shape our marketing strategies.",
            avatar: 'https://i.pravatar.cc/150?img=2',
        },
        {
            name: 'Maria Ancelotti',
            title: 'How does ChatGPT replace human job',
            text: "From novice to pro, Pulsefy helps our team uncover the extraordinary in our marketing data!",
            avatar: 'https://i.pravatar.cc/150?img=3',
        },
        {
            name: 'Ragip Diler',
            title: 'The future of Artificial Intelligence',
            text: "Pulsefy empowers our whole team, techies or not, to dive into marketing analytics and spot the insights that really matter—no more average data!",
            avatar: 'https://i.pravatar.cc/150?img=4',
        },
        {
            name: 'Jenny Wilson',
            title: 'The impact of AI on marketing strategies',
            text: "Pulsefy's user-friendly analytics let our whole team, regardless of skill, bypass averages to unearth and act on true, game-changing marketing insights every day.",
            avatar: 'https://i.pravatar.cc/150?img=5',
        },
        {
            name: 'Guy Hawkins',
            title: 'Artificial Intelligence in modern warfare',
            text: "Pulsefy is a game-changer for our team—easy for beginners and powerful for digging beyond average data. It's our daily ally in unearthing those pivotal marketing insights that really drive strategy!",
            avatar: 'https://i.pravatar.cc/150?img=6',
        },
    ];

    const handleImageError = () => {
        document
            .getElementById('screenshot-container')
            ?.classList.add('!hidden');
        document.getElementById('docs-card')?.classList.add('!row-span-1');
        document
            .getElementById('docs-card-content')
            ?.classList.add('!flex-row');
        document.getElementById('background')?.classList.add('!hidden');
    };

    const [showLogin, setShowLogin] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Generate user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

  // Check if user has a profile photo - DEFINE THIS FUNCTION
    const hasProfilePhoto = () => {
        return auth?.user?.profile_photo_path || auth?.user?.profile_photo_url;
    };

    // Get profile photo URL
    const getProfilePhotoUrl = () => {
        if (auth?.user?.profile_photo_path) {
            return `/storage/${auth.user.profile_photo_path}`;
        }
        if (auth?.user?.profile_photo_url) {
            return auth.user.profile_photo_url;
        }
        return null;
    };


    const Li = (text) => <li className='duration-300 ease-in-out hover:scale-105'>{text}</li>;
    
    return (
        <>
            <Head title="Welcome" />
            <div className="">
                {/* Navbar */}
                <header className='flex items-center justify-between mx-auto w-full max-w-screen-xl px-4 lg:py-[10px]'>
                    <div className='flex-1 items-center justify-center '>
                        <img src="/ACET.png" alt="Confora Logo" className='h-[30px]' />
                    </div>
                    <nav className=' flex justify-center items-center list-none cursor-pointer gap-[70px]'>
                        {Li('Home')}
                        {Li('Agenda')}
                        {Li('Publisher')}
                        {Li('Papers')}
                    </nav>
                    <nav className="flex-1 flex justify-end gap-2 items-center">
                        {auth?.user ? (
                            <div className="flex items-center space-x-4">
                                {/* Profile Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="flex items-center space-x-2 group focus:outline-none p-2 rounded-lg hover:bg-gray-100 transition-all duration-200"
                                    >
                                        {hasProfilePhoto() ? (
                                            <img
                                                src={getProfilePhotoUrl()}
                                                alt={auth.user.name}
                                                className="w-8 h-8 rounded-full object-cover border-2 border-blue-400 group-hover:ring-2 group-hover:ring-blue-500 transition-all"
                                            />
                                        ) : (
                                            <div 
                                                className="w-8 h-8 rounded-full border-2 border-blue-400 group-hover:ring-2 group-hover:ring-blue-500 transition-all duration-200 flex items-center justify-center text-white font-bold text-sm"
                                                style={{
                                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                                                }}
                                            >
                                                {getUserInitials(auth.user.name)}
                                            </div>
                                        )}
                                        
                                        {/* User Info - Hidden on mobile */}
                                        <div className="hidden md:block text-left">
                                            <p className="text-sm font-medium text-gray-900">{auth.user.name}</p>
                                            <p className="text-xs text-gray-500">{auth.user.email}</p>
                                        </div>
                                        
                                        {/* Dropdown Arrow */}
                                        <svg 
                                            className={`w-4 h-4 text-gray-400 transition-all duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} 
                                            fill="none" 
                                            stroke="currentColor" 
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    {dropdownOpen && (
                                        <>
                                            {/* Invisible overlay to close dropdown */}
                                            <div 
                                                className="fixed inset-0 z-10" 
                                                onClick={() => setDropdownOpen(false)}
                                            />
                                            <div
                                                className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl z-20 py-1 border border-gray-100"
                                                style={{ transformOrigin: 'top right' }}
                                            >
                                                {/* User Info in Mobile */}
                                                <div className="md:hidden px-4 py-3 border-b border-gray-100">
                                                    <div className="flex items-center space-x-3">
                                                         {hasProfilePhoto() ? (
                                                            <img
                                                                src={getProfilePhotoUrl()}
                                                                alt={auth.user.name}
                                                                className="w-10 h-10 rounded-full object-cover border-2 border-blue-400"
                                                            />
                                                        ) : (
                                                            <div 
                                                                className="w-10 h-10 rounded-full border-2 border-blue-400 flex items-center justify-center text-white font-bold"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                                                                }}
                                                            >
                                                                {getUserInitials(auth.user.name)}
                                                            </div>
                                                        )}
                                                                                                            <div>
                                                            <p className="text-sm font-medium text-gray-900 truncate">{auth.user.name}</p>
                                                            <p className="text-xs text-gray-500 truncate">{auth.user.email}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <Link
                                                    href={route('dashboard')}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 space-x-3"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                                    </svg>
                                                    <span>Dashboard</span>
                                                </Link>
                                                
                                                <Link
                                                    href={route('profile.edit')}
                                                    className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200 space-x-3"
                                                    onClick={() => setDropdownOpen(false)}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>Profile Settings</span>
                                                </Link>
                                                
                                                <div className="border-t border-gray-100">
                                                    <Link
                                                        href={route('logout')}
                                                        method="post"
                                                        as="button"
                                                        className="flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 space-x-3"
                                                        onClick={() => setDropdownOpen(false)}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        <span>Sign Out</span>
                                                    </Link>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <button 
                                    onClick={() => setShowLogin(true)} 
                                    className='bg-blue rounded-md px-3 py-2 text-white ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[blue] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white hover:bg-green-700 hover:scale-105 ease-in-out duration-300'
                                >
                                    Log in
                                </button>
                                <Link
                                    href={route('register')}
                                    className='bg-blue rounded-md px-3 py-2 text-white ring-1 ring-transparent transition hover:text-black/70 focus:outline-none focus-visible:ring-[blue] dark:text-white dark:hover:text-white/80 dark:focus-visible:ring-white hover:bg-green-700 hover:scale-105 ease-in-out duration-300'
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Rest of your existing code remains the same */}
                {showLogin && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
                        <div className="w-full max-w-lg h-[600px] bg-white rounded-lg shadow-lg relative flex items-center justify-center">
                            <button
                                onClick={() => setShowLogin(false)}
                                className="absolute top-2 right-2 text-gray-500 text-bold"
                            >
                                ✕
                            </button>
                            <Login />
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <section className="px-8 py-16 text-center bg-gray-100">
                    <h1 className="text-4xl md:text-5xl font-bold leading-snug">
                        Welcome to Confora <br />
                        <span className="text-blue">Conferences Management</span>
                    </h1>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto">Bringing researchers together, one paper at a time. Your work deserves the world's stage.</p>
                    <div className="flex justify-center gap-4 mt-8">
                       <div className="flex justify-center gap-4 mt-8">
                            <Link
                                href={route('submissions.create')}  // ✅ Consistent with your pattern
                                className="bg-blue text-white px-6 py-3 rounded-full hover:bg-green-700 hover:scale-105 ease-in-out duration-300"
                            >
                                Submit Your Paper
                            </Link>
                            <button className="border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-100 hover:scale-105 ease-in-out duration-300">
                                Get The Templates
                            </button>
                        </div>
                    </div>
                    {/* Rating */}
                    <div className="mt-6 flex flex-col justify-center items-center gap-2 text-yellow-500">
                        <div className='flex justify-center gap-2'>
                            {"★★★★★"}
                            <span className="text-gray-700 font-medium">5.0</span>
                        </div>
                        <span className="text-gray-500">from 80+ reviews</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
                        {/* Image Card */}
                        <div className="rounded-lg overflow-hidden">
                            <img src="/Conferences.png" alt="Factory" className="w-full h-full object-cover"/>
                        </div>

                        {/* Clients */}
                        <div className="bg-blue-950 text-white flex flex-col justify-center items-center rounded-lg p-6">
                            <h2 className="text-3xl font-bold">100+</h2>
                            <p className="text-center text-sm">Our Speaker and Publisher</p>
                        </div>

                        {/* Projects */}
                        <div className="bg-white border rounded-lg p-6 text-center shadow-sm">
                            <p className="text-sm text-gray-500">Total Submitted Paper</p>
                            <h2 className="text-3xl font-bold">1951+</h2>
                            <p className="text-blue text-sm">Increase of 126 this month</p>
                        </div>

                        {/* Years */}
                        <div className="bg-blue-100 flex flex-col justify-center items-center rounded-lg p-6">
                            <h2 className="text-3xl font-bold">6+</h2>
                            <p className="text-sm">Years of Dedicated Service</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Rest of your existing content remains exactly the same... */}
            <div className="relative bg-[url('/image.png')] bg-cover bg-center h-screen flex justify-center items-center">
                <div className="absolute inset-0 bg-black/50"></div>
                <div className='w-50'>
                    <h1 className='relative font-bold text-center text-white text-[35px]'>"Confora help you to streamlines paper submissions, reviewer assignments, and conference management — making events smoother, faster, and more impactful."</h1>
                </div>
            </div>

            {/* ... rest of your existing content continues here ... */}
            <div className="bg-gray-100 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[blue] selection:text-white">
                    <div className="relative w-full max-w-2xl px-6 lg:max-w-7xl">
                        <main className="py-16">
                            <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                                <a
                                    href="#"
                                    id="docs-card"
                                    className="flex flex-col items-start gap-6 overflow-hidden rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[blue] md:row-span-3 lg:p-10 lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[blue]"
                                >
                                    <div>
                                        <img src="/Meeting.jpg" alt="" className='w-full h-full' />
                                    </div>
                                    <div
                                        id="screenshot-container"
                                        className="relative flex w-full flex-1 items-stretch"
                                    >
                                        <div className="absolute -bottom-16 -left-16 h-40 w-[calc(100%+8rem)] bg-gradient-to-b from-transparent via-white to-white dark:via-zinc-900 dark:to-zinc-900"></div>
                                    </div>

                                    <div className="relative flex items-center gap-6 lg:items-end">
                                        <div
                                            id="docs-card-content"
                                            className="flex items-start gap-6 lg:flex-col"
                                        >
                                            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[blue]/10 sm:size-16">
                                                <svg
                                                    className="size-5 sm:size-6"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        fill="blue"
                                                        d="M23 4a1 1 0 0 0-1.447-.894L12.224 7.77a.5.5 0 0 1-.448 0L2.447 3.106A1 1 0 0 0 1 4v13.382a1.99 1.99 0 0 0 1.105 1.79l9.448 4.728c.14.065.293.1.447.1.154-.005.306-.04.447-.105l9.453-4.724a1.99 1.99 0 0 0 1.1-1.789V4ZM3 6.023a.25.25 0 0 1 .362-.223l7.5 3.75a.251.251 0 0 1 .138.223v11.2a.25.25 0 0 1-.362.224l-7.5-3.75a.25.25 0 0 1-.138-.22V6.023Zm18 11.2a.25.25 0 0 1-.138.224l-7.5 3.75a.249.249 0 0 1-.329-.099.249.249 0 0 1-.033-.12V9.772a.251.251 0 0 1 .138-.224l7.5-3.75a.25.25 0 0 1 .362.224v11.2Z"
                                                    />
                                                    <path
                                                        fill="blue"
                                                        d="m3.55 1.893 8 4.048a1.008 1.008 0 0 0 .9 0l8-4.048a1 1 0 0 0-.9-1.785l-7.322 3.706a.506.506 0 0 1-.452 0L4.454.108a1 1 0 0 0-.9 1.785H3.55Z"
                                                    />
                                                </svg>
                                            </div>

                                            <div className="pt-3 sm:pt-5 lg:pt-0">
                                                <h2 className="text-xl font-semibold text-black dark:text-white">
                                                    About Us
                                                </h2>

                                                <p className="mt-4 text-sm/relaxed">
                                                    We are dedicated to transforming how conferences are organized and managed. Our platform brings together organizers, researchers, and reviewers in one seamless system, making paper submissions, reviews, and event coordination simple and efficient. With a focus on transparency, collaboration, and innovation, we help turn great ideas into successful events.
                                                </p>
                                            </div>
                                        </div>

                                        <svg
                                            className="size-6 shrink-0 stroke-[blue]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                            />
                                        </svg>
                                    </div>
                                </a>

                                {/* Rest of your grid items... */}
                                <a
                                    href="#"
                                    className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[blue] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[blue]"
                                >   
                                    <div>
                                        <div className="flex justify-center items-center size-12 shrink-0 rounded-full bg-[blue]/10 sm:size-16">
                                            <svg
                                                className="size-5 sm:size-6"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <g fill="blue">
                                                    <path d="M24 8.25a.5.5 0 0 0-.5-.5H.5a.5.5 0 0 0-.5.5v12a2.5 2.5 0 0 0 2.5 2.5h19a2.5 2.5 0 0 0 2.5-2.5v-12Zm-7.765 5.868a1.221 1.221 0 0 1 0 2.264l-6.626 2.776A1.153 1.153 0 0 1 8 18.123v-5.746a1.151 1.151 0 0 1 1.609-1.035l6.626 2.776ZM19.564 1.677a.25.25 0 0 0-.177-.427H15.6a.106.106 0 0 0-.072.03l-4.54 4.543a.25.25 0 0 0 .177.427h3.783c.027 0 .054-.01.073-.03l4.543-4.543ZM22.071 1.318a.047.047 0 0 0-.045.013l-4.492 4.492a.249.249 0 0 0 .038.385.25.25 0 0 0 .14.042h5.784a.5.5 0 0 0 .5-.5v-2a2.5 2.5 0 0 0-1.925-2.432ZM13.014 1.677a.25.25 0 0 0-.178-.427H9.101a.106.106 0 0 0-.073.03l-4.54 4.543a.25.25 0 0 0 .177.427H8.4a.106.106 0 0 0 .073-.03l4.54-4.543ZM6.513 1.677a.25.25 0 0 0-.177-.427H2.5A2.5 2.5 0 0 0 0 3.75v2a.5.5 0 0 0 .5.5h1.4a.106.106 0 0 0 .073-.03l4.54-4.543Z" />
                                                </g>
                                            </svg>
                                        </div>

                                        <div className="pt-3 sm:pt-5">
                                            <h2 className="text-xl font-semibold text-black dark:text-white">
                                                Paper Submission
                                            </h2>

                                            <p className="mt-4 text-sm/relaxed">
                                                Easily submit, organize, and track research papers with our streamlined submission system.
                                            </p>
                                        </div>
                                        <svg
                                            className="size-6 shrink-0 self-center stroke-[blue]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                            />
                                        </svg>
                                    </div>
                                </a>

                                <a
                                    href="#"
                                    className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] transition duration-300 hover:text-black/70 hover:ring-black/20 focus:outline-none focus-visible:ring-[blue] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800 dark:hover:text-white/70 dark:hover:ring-zinc-700 dark:focus-visible:ring-[blue]"
                                >
                                    <div>
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[blue]/10 sm:size-16">
                                            <svg
                                                className="size-5 sm:size-6"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <g fill="blue">
                                                    <path d="M8.75 4.5H5.5c-.69 0-1.25.56-1.25 1.25v4.75c0 .69.56 1.25 1.25 1.25h3.25c.69 0 1.25-.56 1.25-1.25V5.75c0-.69-.56-1.25-1.25-1.25Z" />
                                                    <path d="M24 10a3 3 0 0 0-3-3h-2V2.5a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2V20a3.5 3.5 0 0 0 3.5 3.5h17A3.5 3.5 0 0 0 24 20V10ZM3.5 21.5A1.5 1.5 0 0 1 2 20V3a.5.5 0 0 1 .5-.5h14a.5.5 0 0 1 .5.5v17c0 .295.037.588.11.874a.5.5 0 0 1-.484.625L3.5 21.5ZM22 20a1.5 1.5 0 1 1-3 0V9.5a.5.5 0 0 1 .5-.5H21a1 1 0 0 1 1 1v10Z" />
                                                    <path d="M12.751 6.047h2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-2A.75.75 0 0 1 12 7.3v-.5a.75.75 0 0 1 .751-.753ZM12.751 10.047h2a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-2A.75.75 0 0 1 12 11.3v-.5a.75.75 0 0 1 .751-.753ZM4.751 14.047h10a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-10A.75.75 0 0 1 4 15.3v-.5a.75.75 0 0 1 .751-.753ZM4.75 18.047h7.5a.75.75 0 0 1 .75.75v.5a.75.75 0 0 1-.75.75h-7.5A.75.75 0 0 1 4 19.3v-.5a.75.75 0 0 1 .75-.753Z" />
                                                </g>
                                            </svg>
                                        </div>

                                        <div className="pt-3 sm:pt-5">
                                            <h2 className="text-xl font-semibold text-black dark:text-white">
                                                Reviewer Collaboration
                                            </h2>

                                            <p className="mt-4 text-sm/relaxed">
                                                Assign the right reviewers, track their feedback, and ensure high-quality evaluations on time.
                                            </p>
                                        </div>
                                        <svg
                                            className="size-6 shrink-0 self-center stroke-[blue]"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                                            />
                                        </svg>
                                    </div>

                                </a>

                                <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white p-6 shadow-[0px_14px_34px_0px_rgba(0,0,0,0.08)] ring-1 ring-white/[0.05] lg:pb-10 dark:bg-zinc-900 dark:ring-zinc-800">
                                    <div>
                                        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[blue]/10 sm:size-16">
                                            <svg
                                                className="size-5 sm:size-6"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <g fill="blue">
                                                    <path d="M16.597 12.635a.247.247 0 0 0-.08-.237 2.234 2.234 0 0 1-.769-1.68c.001-.195.03-.39.084-.578a.25.25 0 0 0-.09-.267 8.8 8.8 0 0 0-4.826-1.66.25.25 0 0 0-.268.181 2.5 2.5 0 0 1-2.4 1.824.045.045 0 0 0-.045.037 12.255 12.255 0 0 0-.093 3.86.251.251 0 0 0 .208.214c2.22.366 4.367 1.08 6.362 2.118a.252.252 0 0 0 .32-.079 10.09 10.09 0 0 0 1.597-3.733ZM13.616 17.968a.25.25 0 0 0-.063-.407A19.697 19.697 0 0 0 8.91 15.98a.25.25 0 0 0-.287.325c.151.455.334.898.548 1.328.437.827.981 1.594 1.619 2.28a.249.249 0 0 0 .32.044 29.13 29.13 0 0 0 2.506-1.99ZM6.303 14.105a.25.25 0 0 0 .265-.274 13.048 13.048 0 0 1 .205-4.045.062.062 0 0 0-.022-.07 2.5 2.5 0 0 1-.777-.982.25.25 0 0 0-.271-.149 11 11 0 0 0-5.6 2.815.255.255 0 0 0-.075.163c-.008.135-.02.27-.02.406.002.8.084 1.598.246 2.381a.25.25 0 0 0 .303.193 19.924 19.924 0 0 1 5.746-.438ZM9.228 20.914a.25.25 0 0 0 .1-.393 11.53 11.53 0 0 1-1.5-2.22 12.238 12.238 0 0 1-.91-2.465.248.248 0 0 0-.22-.187 18.876 18.876 0 0 0-5.69.33.249.249 0 0 0-.179.336c.838 2.142 2.272 4 4.132 5.353a.254.254 0 0 0 .15.048c1.41-.01 2.807-.282 4.117-.802ZM18.93 12.957l-.005-.008a.25.25 0 0 0-.268-.082 2.21 2.21 0 0 1-.41.081.25.25 0 0 0-.217.2c-.582 2.66-2.127 5.35-5.75 7.843a.248.248 0 0 0-.09.299.25.25 0 0 0 .065.091 28.703 28.703 0 0 0 2.662 2.12.246.246 0 0 0 .209.037c2.579-.701 4.85-2.242 6.456-4.378a.25.25 0 0 0 .048-.189 13.51 13.51 0 0 0-2.7-6.014ZM5.702 7.058a.254.254 0 0 0 .2-.165A2.488 2.488 0 0 1 7.98 5.245a.093.093 0 0 0 .078-.062 19.734 19.734 0 0 1 3.055-4.74.25.25 0 0 0-.21-.41 12.009 12.009 0 0 0-10.4 8.558.25.25 0 0 0 .373.281 12.912 12.912 0 0 1 4.826-1.814ZM10.773 22.052a.25.25 0 0 0-.28-.046c-.758.356-1.55.635-2.365.833a.25.25 0 0 0-.022.48c1.252.43 2.568.65 3.893.65.1 0 .2 0 .3-.008a.25.25 0 0 0 .147-.444c-.526-.424-1.1-.917-1.673-1.465ZM18.744 8.436a.249.249 0 0 0 .15.228 2.246 2.246 0 0 1 1.352 2.054c0 .337-.08.67-.23.972a.25.25 0 0 0 .042.28l.007.009a15.016 15.016 0 0 1 2.52 4.6.25.25 0 0 0 .37.132.25.25 0 0 0 .096-.114c.623-1.464.944-3.039.945-4.63a12.005 12.005 0 0 0-5.78-10.258.25.25 0 0 0-.373.274c.547 2.109.85 4.274.901 6.453ZM9.61 5.38a.25.25 0 0 0 .08.31c.34.24.616.561.8.935a.25.25 0 0 0 .3.127.631.631 0 0 1 .206-.034c2.054.078 4.036.772 5.69 1.991a.251.251 0 0 0 .267.024c.046-.024.093-.047.141-.067a.25.25 0 0 0 .151-.23A29.98 29.98 0 0 0 15.957.764a.25.25 0 0 0-.16-.164 11.924 11.924 0 0 0-2.21-.518.252.252 0 0 0-.215.076A22.456 22.456 0 0 0 9.61 5.38Z" />
                                                </g>
                                            </svg>
                                        </div>
                                        <div className="pt-3 sm:pt-5">
                                            <h2 className="text-xl font-semibold text-black dark:text-white">
                                                Easy Event Scheduling
                                            </h2>

                                            <p className="mt-4 text-sm/relaxed">
                                                Plan conference sessions, keynotes, and workshops effortlessly with our built-in scheduling tools.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </main>
                    </div>
                </div>
            </div>

            {/* ... rest of your existing content continues unchanged ... */}
            <div className="bg-gray-100 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <span className="inline-block bg-gray-200 text-gray-700 text-sm font-medium py-1 px-3 rounded-full mb-4">
                            <i className="fas fa-quote-right mr-2"></i> Publisher
                        </span>
                        <h1 className="text-4xl font-extrabold text-gray-900">
                            Here are our <span className="text-blue-600">Authors</span> and <span className="text-blue-600">Researchers</span>
                        </h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Learn more about how our platform has transformed the conference experience for authors and researchers.
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {testimonialsData.map((testimonial, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 relative"
                            >
                                {/* Close button icon - positioned absolutely */}
                                <button className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 text-blue hover:bg-gray-100 transition duration-300">
                                    <i className="fa-solid fa-download"></i> {/* Font Awesome icon */}
                                </button>
                                <div className="flex items-center gap-5 ">
                                    <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover"/>
                                    <div>
                                        <h3 className="font-bold text-gray-900 m-0">{testimonial.name}</h3>
                                        <p className="text-sm text-blue-500 cursor-pointer m-0">{testimonial.title}</p>
                                    </div>
                                </div>

                                {/* Testimonial Text */}
                                <p className="mt-4 text-gray-700">
                                    {testimonial.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-white dark:bg-gray-900">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Resources</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="https://flowbite.com/" className="hover:underline">Flowbite</a>
                                    </li>
                                    <li>
                                        <a href="https://tailwindcss.com/" className="hover:underline">Tailwind CSS</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Follow us</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="https://github.com/themesberg/flowbite" className="hover:underline ">Github</a>
                                    </li>
                                    <li>
                                        <a href="https://discord.gg/4eeurUVvTy" className="hover:underline">Discord</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-white">Legal</h2>
                                <ul className="text-gray-500 dark:text-gray-400 font-medium">
                                    <li className="mb-4">
                                        <a href="#" className="hover:underline">Privacy Policy</a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline">Terms &amp; Conditions</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
                <div className="sm:flex sm:items-center sm:justify-between">
                    <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">All Rights Reserved.</span>
                    <div className="flex sm:justify-center sm:mt-0">
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 8 19">
                                    <path fillRule="evenodd" d="M6.135 3H8V0H6.135a4.147 4.147 0 0 0-4.142 4.142V6H0v3h2v9.938h3V9h2.021l.592-3H5V3.591A.6.6 0 0 1 5.592 3h.543Z" clipRule="evenodd"/>
                                </svg>
                            <span className="sr-only">Facebook page</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 21 16">
                                    <path d="M16.942 1.556a16.3 16.3 0 0 0-4.126-1.3 12.04 12.04 0 0 0-.529 1.1 15.175 15.175 0 0 0-4.573 0 11.585 11.585 0 0 0-.535-1.1 16.274 16.274 0 0 0-4.129 1.3A17.392 17.392 0 0 0 .182 13.218a15.785 15.785 0 0 0 4.963 2.521c.41-.564.773-1.16 1.084-1.785a10.63 10.63 0 0 1-1.706-.83c.143-.106.283-.217.418-.33a11.664 11.664 0 0 0 10.118 0c.137.113.277.224.418.33-.544.328-1.116.606-1.71.832a12.52 12.52 0 0 0 1.084 1.785 16.46 16.46 0 0 0 5.064-2.595 17.286 17.286 0 0 0-2.973-11.59ZM6.678 10.813a1.941 1.941 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.919 1.919 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Zm6.644 0a1.94 1.94 0 0 1-1.8-2.045 1.93 1.93 0 0 1 1.8-2.047 1.918 1.918 0 0 1 1.8 2.047 1.93 1.93 0 0 1-1.8 2.045Z"/>
                                </svg>
                            <span className="sr-only">Discord community</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 17">
                                <path fillRule="evenodd" d="M20 1.892a8.178 8.178 0 0 1-2.355.635 4.074 4.074 0 0 0 1.8-2.235 8.344 8.344 0 0 1-2.605.98A4.13 4.13 0 0 0 13.85 0a4.068 4.068 0 0 0-4.1 4.038 4 4 0 0 0 .105.919A11.705 11.705 0 0 1 1.4.734a4.006 4.006 0 0 0 1.268 5.392 4.165 4.165 0 0 1-1.859-.5v.05A4.057 4.057 0 0 0 4.1 9.635a4.19 4.19 0 0 1-1.856.07 4.108 4.108 0 0 0 3.831 2.807A8.36 8.36 0 0 1 0 14.184 11.732 11.732 0 0 0 6.291 16 11.502 11.502 0 0 0 17.964 4.5c0-.177 0-.35-.012-.523A8.143 8.143 0 0 0 20 1.892Z" clipRule="evenodd"/>
                            </svg>
                            <span className="sr-only">Twitter page</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd"/>
                            </svg>
                            <span className="sr-only">GitHub account</span>
                        </a>
                        <a href="#" className="text-gray-500 hover:text-gray-900 dark:hover:text-white ms-5">
                            <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0a10 10 0 1 0 10 10A10.009 10.009 0 0 0 10 0Zm6.613 4.614a8.523 8.523 0 0 1 1.93 5.32 20.094 20.094 0 0 0-5.949-.274c-.059-.149-.122-.292-.184-.441a23.879 23.879 0 0 0-.566-1.239 11.41 11.41 0 0 0 4.769-3.366ZM8 1.707a8.821 8.821 0 0 1 2-.238 8.5 8.5 0 0 1 5.664 2.152 9.608 9.608 0 0 1-4.476 3.087A45.758 45.758 0 0 0 8 1.707ZM1.642 8.262a8.57 8.57 0 0 1 4.73-5.981A53.998 53.998 0 0 1 9.54 7.222a32.078 32.078 0 0 1-7.9 1.04h.002Zm2.01 7.46a8.51 8.51 0 0 1-2.2-5.707v-.262a31.64 31.64 0 0 0 8.777-1.219c.243.477.477.964.692 1.449-.114.032-.227.067-.336.1a13.569 13.569 0 0 0-6.942 5.636l.009.003ZM10 18.556a8.508 8.508 0 0 1-5.243-1.8 11.717 11.717 0 0 1 6.7-5.332.509.509 0 0 1 .055-.02 35.65 35.65 0 0 1 1.819 6.476 8.476 8.476 0 0 1-3.331.676Zm4.772-1.462A37.232 37.232 0 0 0 13.113 11a12.513 12.513 0 0 1 5.321.364 8.56 8.56 0 0 1-3.66 5.73h-.002Z" clipRule="evenodd"/>
                            </svg>
                            <span className="sr-only">Dribbble account</span>
                        </a>
                    </div>
                </div>
            </footer>
        </>
    );
}