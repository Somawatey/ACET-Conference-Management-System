import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function MenuSideBar() {
    const { url, auth } = usePage().props;
    const can = auth?.can ?? {};
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(prev => !prev);
        console.log("Toggle Sidebar:", !isSidebarOpen);
    };

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('#user-menu-button')) {
                setIsDropdownOpen(false);
            }
            // Close sidebar when clicking outside on mobile
            if (window.innerWidth < 640 && !e.target.closest('#logo-sidebar') && !e.target.closest('[data-sidebar-toggle]')) {
                setIsSidebarOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Close sidebar on window resize to larger screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640) {
                setIsSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Generate user initials
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    // Check if user has a profile photo
    const hasProfilePhoto = () => {
        return auth?.user?.profile_photo_url;
    };

    return (
        <>
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-30 bg-gray-50 dark:bg-gray-50 h-16">
                <div className="px-4 h-full flex items-center justify-between">
                    {/* Left side - Toggle button */}
                    <button
                        type="button"
                        data-sidebar-toggle
                        onClick={toggleSidebar}
                        className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 
                                   focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 
                                   dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                    >
                        <span className="sr-only">Toggle sidebar</span>
                        <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                            <path clipRule="evenodd" fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 
                            010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 
                            0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 
                            0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 
                            012 10z"></path>
                        </svg>
                    </button>

                    {/* Logo for mobile */}
                    <Link href='/' className="sm:hidden flex items-center">
                        <img src="/images/Logo.png" className="h-10 w-auto" alt="Logo" />
                    </Link>

                    {/* Right side - Profile dropdown */}
                    <div className="flex items-center justify-end w-full">
                        <div className="flex flex-row relative mx-3">
                            <span className="mr-3 mt-1">{`${auth?.user?.name}`}</span>
                            <button
                                id="user-menu-button"
                                type="button"
                                className="flex text-sm rounded-full focus:outline-none focus:ring-1 
                                           focus:ring-offset-2 focus:ring-gray-200"
                                aria-expanded={isDropdownOpen}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                <div className="image">
                                    {hasProfilePhoto() ? (
                                        <img
                                            src={auth.user.profile_photo_url}
                                            className="img-circle elevation-2"
                                            alt="User Image"
                                            style={{ width: '34px', height: '34px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div
                                            className="img-circle elevation-2 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: '34px',
                                                height: '34px',
                                                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                color: 'white',
                                                fontSize: '14px',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {getUserInitials(auth?.user?.name)}
                                        </div>
                                    )}
                                </div>
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 z-50 mt-10 w-52 origin-top-right rounded-md 
                                                shadow-lg ring-1 ring-black ring-opacity-5 
                                                focus:outline-none bg-gray-50 dark:bg-gray-100"
                                >
                                    <div className='px-4 py-2 mt-2'>
                                        <div className="py-1 border-b dark:border-gray-600">
                                            <p className="text-sm text-gray-900 ">
                                                <b>Username:</b> {auth?.user?.name}
                                            </p>
                                            <p className="text-sm text-gray-900">
                                                <b>Email:</b> {auth?.user?.email}
                                            </p>
                                        </div>
                                    </div>
                                    <ul className="py-1">
                                    
                                    <li>
                                        <Link href={route('profile.edit')} className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-300 dark:hover:bg-blue-300 dark:text-gray-700 ease-in-out duration-300 dark:hover:text-black">
                                                Profile Settings
                                        </Link>
                                    </li>
                                        <li>
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="block w-full text-left px-4 py-2 text-sm 
                                                           text-gray-700 hover:bg-gray-100 dark:hover:bg-blue-300 
                                                           dark:text-white-700 dark:hover:text-black ease-in-out duration-300"
                                            >
                                                Logout
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } sm:translate-x-0`}
                aria-label="Sidebar"
            >
                <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-200">
                    <div className="logo w-full flex justify-center items-center">
                        <Link href="/" className="flex items-center ps-2.5 mb-5">
                            <img
                                src="/images/Logo.png"
                                className="h-16 w-auto me-3 sm:h-20"
                                alt="Logo"
                            />
                        </Link>
                    </div>

                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link href={route('dashboard')} className={`nav-link ${route().current('dashboard') && 'active'}`}>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                    <svg className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                    <span className="ms-3 text-gray-700">Dashboard</span>
                                </a>
                            </Link>
                        </li>
                        {can['agenda-list'] && (
                            <li className={`nav-item ${(route().current('agenda.index') || route().current('agenda.create')) && 'menu-is-opening menu-open'}`}>
                                <Link href={route('agenda.index')} className={`nav-link ${route().current('agenda.index') && 'active'}`}>
                                    <a href="#" className="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className='shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                                            fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <circle cx="12" cy="12" r="10" className="stroke-current" />
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6l4 2"
                                        className="stroke-current"
                                    />
                                </svg>

                                <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Agenda</span>
                            </a>
                            </Link>
                        </li>
                        )}

                        {can['user-list'] && (
                            <li className={`nav-item ${(route().current('users.index') || route().current('users.create')) && 'menu-is-opening menu-open'}`}>
                                <Link href={route('users.index')} className={`nav-link ${route().current('users.index') && 'active'}`}>
                                    <a
                                        href="#"
                                        className={`${(route().current('roles.index') || route().current('roles.create')) && 'active'} flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group`}
                                    >
                                        <svg
                                            className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="currentColor"
                                            viewBox="0 0 20 18"
                                        >
                                            <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Users</span>
                                    </a>
                                </Link>
                            </li>
                        )}

                        {can['role-list'] && (
                            <li>
                                <Link href={route('roles.index')} className={`nav-link ${route().current('roles.index') && 'active'}`}>
                                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M19.728 10.686c-2.38 2.256-6.153 3.381-9.875 3.381-3.722 0-7.4-1.126-9.571-3.371L0 10.437V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.6l-.272.286Z" />
                                            <path d="m.135 7.847 1.542 1.417c3.6 3.712 12.747 3.7 16.635.01L19.605 7.9A.98.98 0 0 1 20 7.652V6a2 2 0 0 0-2-2h-3V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H2a2 2 0 0 0-2 2v1.765c.047.024.092.051.135.082ZM10 10.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H7V3Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Role</span>
                                        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                                    </a>
                                </Link>
                            </li>
                        )}

                        {/* {can['role-create'] && (
                            <li>
                                <Link href={route('roles.create')} className={`nav-link ${route().current('roles.index') && 'active'}`}>
                                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M19.728 10.686c-2.38 2.256-6.153 3.381-9.875 3.381-3.722 0-7.4-1.126-9.571-3.371L0 10.437V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.6l-.272.286Z" />
                                            <path d="m.135 7.847 1.542 1.417c3.6 3.712 12.747 3.7 16.635.01L19.605 7.9A.98.98 0 0 1 20 7.652V6a2 2 0 0 0-2-2h-3V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H2a2 2 0 0 0-2 2v1.765c.047.024.092.051.135.082ZM10 10.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H7V3Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Create Role</span>
                                        <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                                    </a>
                                </Link>
                            </li>
                        )} */}

                        {can['paper-list'] && (
                            <li>
                                <Link href={route('papers.index')} className={`nav-link ${route().current('papers.index') && 'active'}`}>
                                    <a href="#" className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group ${route().current('papers.index') ? 'bg-gray-100 dark:bg-gray-400' : ''}`}>
                                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                            <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Paper</span>
                                    </a>
                                </Link>
                            </li>
                        )}

                        {can['paper-assign'] && (
                            <li>
                                <Link href={route('paper-assignments.index')} className={`nav-link ${route().current('paper-assignments.index') && 'active'}`}>
                                    <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                        <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Assign Papers</span>
                                    </a>
                                </Link>
                            </li>
                        )}

                        <li>
                            <Link href={route('reviews.index')} className={`nav-link ${route().current('reviews.index') && 'active'}`}>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Reviews</span>
                                </a>
                            </Link>
                        </li>

                        <li>
                            <Link href={route('review.history')} className={`nav-link ${route().current('review.history') && 'active'}`}>
                                <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                    <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Review History</span>
                                </a>
                            </Link>
                        </li>

                        <li>
                            <Link href={route('submissions.create')} className={`nav-link ${route().current('submissions.create') && 'active'}`}>
                            <a href="#" className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ml-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap text-gray-700">Submit Form</span>
                            </a>
                            </Link>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 sm:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    );
}