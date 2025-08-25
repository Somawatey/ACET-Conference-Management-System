import { Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Breadcrumb from '@/Components/Breadcrumb';

export default function MenuSideBar({ isSidebarOpen, onToggle }) {
    const { url, auth } = usePage().props;
    const can = auth?.can ?? {};
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    
    // Use props from AdminLayout if provided, otherwise use local state
    const [localSidebarOpen, setLocalSidebarOpen] = useState(true);
    const sidebarOpen = isSidebarOpen !== undefined ? isSidebarOpen : localSidebarOpen;

    // Toggle sidebar
    const toggleSidebar = () => {
        if (onToggle) {
            onToggle();
        } else {
            setLocalSidebarOpen(prev => !prev);
        }
        console.log("Toggle Sidebar:", !sidebarOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('#user-menu-button')) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
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
            <nav className={`fixed top-0 right-0 z-30 bg-white/90 backdrop-blur-lg border-b border-gray-200/50 h-16 transition-all duration-300 ease-in-out shadow-sm ${
                sidebarOpen ? 'left-64' : 'left-0'
            }`}>
                <div className="px-6 h-full flex items-center justify-between">
                    {/* Left side - Toggle button */}
                    {Breadcrumb}
                    <button
                        type="button"
                        data-sidebar-toggle
                        onClick={toggleSidebar}
                        className="inline-flex items-center justify-center p-2.5 text-gray-500 rounded-xl 
                                   hover:bg-gray-100/70 hover:text-gray-700 transition-all duration-200
                                   focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:ring-offset-1
                                   active:scale-95 transform"
                    >
                        <span className="sr-only">Toggle sidebar</span>
                        <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
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
                        <div className="flex items-center relative">
                            <span className="mr-4 text-sm font-medium text-gray-700 hidden sm:block">
                                {`${auth?.user?.name}`}
                            </span>
                            <button
                                id="user-menu-button"
                                type="button"
                                className="relative flex items-center justify-center w-10 h-10 rounded-full 
                                           transition-all duration-200 hover:ring-4 hover:ring-blue-500/10
                                           focus:outline-none focus:ring-4 focus:ring-blue-500/20"
                                aria-expanded={isDropdownOpen}
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            >
                                {hasProfilePhoto() ? (
                                    <img
                                        src={auth.user.profile_photo_url}
                                        className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200"
                                        alt="User Image"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                                                    flex items-center justify-center text-white text-sm font-semibold
                                                    ring-2 ring-gray-200 hover:ring-blue-300 transition-all duration-200
                                                    hover:shadow-lg transform hover:scale-105">
                                        {getUserInitials(auth?.user?.name)}
                                    </div>
                                )}
                            </button>

                            {/* Dropdown menu */}
                            {isDropdownOpen && (
                                <div className="absolute right-0 z-50 mt-2 w-72 origin-top-right 
                                                bg-white rounded-xl shadow-xl border border-gray-200/50
                                                ring-1 ring-black/5 backdrop-blur-lg
                                                transform transition-all duration-200 ease-out
                                                translate-y-12">
                                    {/* User Info Section */}
                                    <div className='px-5 py-4 border-b border-gray-100'>
                                        <div className="flex items-center space-x-3 mb-3">
                                            {hasProfilePhoto() ? (
                                                <img
                                                    src={auth.user.profile_photo_url}
                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200"
                                                    alt="User Image"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 
                                                                flex items-center justify-center text-white font-semibold">
                                                    {getUserInitials(auth?.user?.name)}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-gray-900 truncate">
                                                    {auth?.user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {auth?.user?.email}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <Link 
                                            href={route('profile.edit')} 
                                            className="flex items-center px-5 py-3 text-sm text-gray-700 
                                                       hover:bg-gray-50 hover:text-gray-900 transition-all duration-150
                                                       group"
                                        >
                                            <svg className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-500" 
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            Profile Settings
                                        </Link>
                                        
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center w-full px-5 py-3 text-sm text-red-600 
                                                       hover:bg-red-50 hover:text-red-700 transition-all duration-150
                                                       group"
                                        >
                                            <svg className="w-4 h-4 mr-3 text-red-400 group-hover:text-red-500" 
                                                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                            </svg>
                                            Sign out
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Sidebar */}
            <aside
                id="logo-sidebar"
                className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform duration-300 ease-in-out ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                } bg-gradient-to-b from-slate-50 to-slate-100 border-r border-gray-200/60`}
                aria-label="Sidebar"
            >
                <div className="h-full px-4 py-6 overflow-y-auto">
                    {/* Logo Section */}
                    <div className="flex justify-center items-center mb-8">
                        <Link href="/" className="flex items-center group">
                            <img
                                src="/images/Logo.png"
                                className="h-16 w-auto transition-transform duration-200 group-hover:scale-105"
                                alt="Logo"
                            />
                        </Link>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="space-y-1">
                        {/* Dashboard */}
                        <Link 
                            href={route('dashboard')} 
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                route().current('dashboard') 
                                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                                    : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                            }`}
                        >
                            <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                route().current('dashboard') 
                                    ? 'text-blue-600' 
                                    : 'text-gray-400 group-hover:text-gray-600'
                            }`} fill="currentColor" viewBox="0 0 22 21">
                                <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                            </svg>
                            Dashboard
                        </Link>

                        {/* Agenda */}
                        {can['agenda-list'] && (
                            <Link 
                                href={route('agenda.index')} 
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                    route().current('agenda.index') 
                                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                                        : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                                }`}
                            >
                                <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                    route().current('agenda.index') 
                                        ? 'text-blue-600' 
                                        : 'text-gray-400 group-hover:text-gray-600'
                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6l4 2" />
                                </svg>
                                Agenda
                            </Link>
                        )}

                        {/* Conferences */}
                        {can['conference-list'] && (
                            <Link
                                href={route('conferences.index')} 
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                    (route().current('conferences.index') || route().current('conferences.create'))
                                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                                        : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                                }`}
                            >
                                <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                    (route().current('conferences.index') || route().current('conferences.create'))
                                        ? 'text-blue-600' 
                                        : 'text-gray-400 group-hover:text-gray-600'
                                }`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                                Conferences
                            </Link>
                        )}

                        {/* Users */}
                        {can['user-list'] && (
                            <Link 
                                href={route('users.index')} 
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                    (route().current('users.index') || route().current('users.create'))
                                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                                        : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                                }`}
                            >
                                <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                    (route().current('users.index') || route().current('users.create'))
                                        ? 'text-blue-600' 
                                        : 'text-gray-400 group-hover:text-gray-600'
                                }`} fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                Users
                            </Link>
                        )}

                        {/* Role */}
                        {can['role-list'] && (
                            <Link 
                                href={route('roles.index')} 
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                    (route().current('roles.index') || route().current('roles.create'))
                                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                                        : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                                }`}
                            >
                                <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                    (route().current('roles.index') || route().current('roles.create'))
                                        ? 'text-blue-600' 
                                        : 'text-gray-400 group-hover:text-gray-600'
                                }`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M19.728 10.686c-2.38 2.256-6.153 3.381-9.875 3.381-3.722 0-7.4-1.126-9.571-3.371L0 10.437V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.6l-.272.286Z" />
                                    <path d="m.135 7.847 1.542 1.417c3.6 3.712 12.747 3.7 16.635.01L19.605 7.9A.98.98 0 0 1 20 7.652V6a2 2 0 0 0-2-2h-3V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H2a2 2 0 0 0-2 2v1.765c.047.024.092.051.135.082ZM10 10.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H7V3Z" />
                                </svg>
                                <span className="flex-1">Role</span>
                                <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold 
                                                 text-blue-800 bg-blue-100 rounded-full">
                                    3
                                </span>
                            </Link>
                        )}

                        {/* Paper */}
                        {can['paper-list'] && (
                            <Link 
                                href={route('papers.index')} 
                                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                    route().current('papers.index')
                                        ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                                        : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                                }`}
                            >
                                <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                    route().current('papers.index')
                                        ? 'text-blue-600' 
                                        : 'text-gray-400 group-hover:text-gray-600'
                                }`} fill="currentColor" viewBox="0 0 16 20">
                                    <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                                </svg>
                                Paper
                            </Link>
                        )}

                        {/* Reviews */}
                        <Link 
                            href={route('reviews.index')} 
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                route().current('reviews.index')
                                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                                    : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                            }`}
                        >
                            <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                route().current('reviews.index')
                                    ? 'text-blue-600' 
                                    : 'text-gray-400 group-hover:text-gray-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Reviews
                        </Link>

                        {/* Review History */}
                        <Link 
                            href={route('review.history')} 
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                route().current('review.history')
                                    ? 'bg-blue-50 text-blue-700 shadow-sm border border-blue-100' 
                                    : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900'
                            }`}
                        >
                            <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                route().current('review.history')
                                    ? 'text-blue-600' 
                                    : 'text-gray-400 group-hover:text-gray-600'
                            }`} fill="none" stroke="currentColor" viewBox="0 0 14 20">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                      d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z" />
                            </svg>
                            Review History
                        </Link>

                        {/* Divider */}
                        <div className="my-4 border-t border-gray-200/60"></div>

                        {/* Submit Form */}
                        <Link 
                            href={route('submissions.create')} 
                            className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${
                                route().current('submissions.create')
                                    ? 'bg-green-50 text-green-700 shadow-sm border border-green-100' 
                                    : 'text-gray-700 hover:bg-green-50/50 hover:text-green-700'
                            }`}
                        >
                            <svg className={`flex-shrink-0 w-5 h-5 mr-3 transition-colors duration-200 ${
                                route().current('submissions.create')
                                    ? 'text-green-600' 
                                    : 'text-gray-400 group-hover:text-green-600'
                            }`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                            </svg>
                            Submit Form
                        </Link>
                    </nav>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => {
                        if (onToggle) {
                            onToggle();
                        } else {
                            setLocalSidebarOpen(false);
                        }
                    }}
                />
            )}
        </>
    );
}