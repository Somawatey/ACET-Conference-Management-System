import { Link, usePage } from '@inertiajs/react';
import $ from 'jquery';
import 'admin-lte/dist/css/adminlte.min.css'; // Ensure styles are loaded
import 'admin-lte/dist/js/adminlte.min.js';
import '../../css/app.css'

import { useEffect } from 'react';

export default function MenuSideBar({ }) {
    const { url, auth } = usePage().props;
    const can = auth?.can ?? {};

    useEffect(() => {
        // Ensure dropdowns, tooltips, and modals work
        $('[data-toggle="dropdown"]').dropdown();
    }, []);

    useEffect(() => {
        // Initialize AdminLTE sidebar treeview
        $('[data-widget="treeview"]').each(function () {
            $(this).Treeview('init');
        });
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
        return auth?.user?.profile_photo_url && !auth.user.profile_photo_url.includes('default-avatar');
    };

    return (
        <>
            <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                <span class="sr-only">Open sidebar</span>
                <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
                </svg>
            </button>

            <aside id="logo-sidebar" class="  fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0 " aria-label="Sidebar">
                <div class="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-200 ">
                    <div className="logo w-full flex justify-center items-center">
                        <a href="#" className="flex items-center ps-2.5 mb-5">
                            <img
                                src="/images/Logo.png"
                                className="h-16 w-auto me-3 sm:h-20"
                                alt="Logo"
                            />
                        </a>
                    </div>

                    {/* <Link href={route('dashboard')} className={`nav-link ${route().current('dashboard') && 'active'}`}>
                        <i className="nav-icon fas fa-tachometer-alt"></i>
                        <p>Dashboard</p>
                    </Link> */}

                    <ul class="space-y-2 font-medium">

                        <li>
                            <Link href={route('dashboard')} className={`nav-link ${route().current('dashboard') && 'active'}`}>
                                <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                    <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                        <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                        <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                    </svg>
                                    <span class="ms-3 text-gray-700">Dashboard</span>
                                </a>
                            </Link>
                        </li>

                        <li>
                            <a href="#" class="flex items-center p-2 text-gray-500 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
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

                                <span class="flex-1 ms-3 whitespace-nowrap text-gray-700">Agenda</span>
                            </a>
                        </li>


                        {can['user-list'] &&
                            (
                                <>
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
                                </>)}



                        <li>
                            <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M19.728 10.686c-2.38 2.256-6.153 3.381-9.875 3.381-3.722 0-7.4-1.126-9.571-3.371L0 10.437V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7.6l-.272.286Z" />
                                    <path d="m.135 7.847 1.542 1.417c3.6 3.712 12.747 3.7 16.635.01L19.605 7.9A.98.98 0 0 1 20 7.652V6a2 2 0 0 0-2-2h-3V3a3 3 0 0 0-3-3H8a3 3 0 0 0-3 3v1H2a2 2 0 0 0-2 2v1.765c.047.024.092.051.135.082ZM10 10.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 3a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v1H7V3Z" />
                                </svg>
                                <span class="flex-1 ms-3 whitespace-nowrap text-gray-700">Role</span>
                                <span class="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-medium text-blue-800 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300">3</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                    <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                                </svg>
                                <span class="flex-1 ms-3 whitespace-nowrap text-gray-700">Paper</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                <svg className="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m13 19-6-5-6 5V2a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17Z" />
                                </svg>


                                <span class="flex-1 ms-3 whitespace-nowrap text-gray-700">History</span>
                            </a>
                        </li>

                        <li>
                            <a href="#" class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400 group">
                                <svg class="shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white ml-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                </svg>
                                <span class="flex-1 ms-3 whitespace-nowrap text-gray-700">Submit Form</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside >

            {/* Sidebar */}
            {/* <aside className="main-sidebar sidebar-dark-primary elevation-4">
                <div className="sidebar">
                    <div className="user-panel mt-3 pb-3 mb-3 d-flex">
                        <div className="image">
                            <Link href={route('profile.edit')}>
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
                            </Link>
                        </div>
                        <div className="info">
                            <Link href={route('profile.edit')} className="d-block">
                                <span>{auth?.user?.name}</span>
                            </Link>
                        </div>
                    </div>
                    <nav className="mt-2">
                        <ul className="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                            <li className="nav-item">
                                <Link href={route('dashboard')} className={`nav-link ${route().current('dashboard') && 'active'}`}>
                                    <i className="nav-icon fas fa-tachometer-alt"></i>
                                    <p>Dashboard</p>
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link href="#" className="nav-link">
                                    <i className="nav-icon fas fa-th"></i>
                                    <p>
                                        Widgets
                                        <span className="right badge badge-danger">New</span>
                                    </p>
                                </Link>
                            </li> */}
                            {can['category-list'] && (
                                <li className="nav-header">SETTING</li>
                            )}
                            {can['category-list'] && (
                                <>

                                    <li className={`nav-item ${(route().current('categories.index') || route().current('categories.create')) && 'menu-is-opening menu-open'}`}>
                                        <a href="#" className={`nav-link ${(route().current('categories.index') || route().current('categories.create')) && 'active'}`}>
                                            <i className="nav-icon far fa-plus-square"></i>
                                            <p> CATEGORY
                                                <i className="fas fa-angle-left right"></i>
                                            </p>
                                        </a>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link href={route('categories.index')} className={`nav-link ${route().current('categories.index') && 'active'}`}>
                                                    <i className="fa-solid fa-list-ul nav-icon text-warning"></i>
                                                    <p>LIST</p>
                                                </Link>
                                            </li>
                                            <li className="nav-item">
                                                <Link href={route('categories.create')} className={`nav-link ${route().current('categories.create') && 'active'}`}>
                                                    <i className="fa-regular fa-square-plus nav-icon text-info"></i>
                                                    <p>CREATE</p>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>
                                </>
                            )}
                            {can['role-list' || 'user-list'] && (
                                <li className="nav-header">AUTHENTICATION</li>
                            )}
                            {can['role-list'] && (
                                <>
                                    <li className={`nav-item ${(route().current('roles.index') || route().current('roles.create')) && 'menu-is-opening menu-open'}`}>
                                        <a href="#" className={`nav-link ${(route().current('roles.index') || route().current('roles.create')) && 'active'}`}>
                                            <i className="nav-icon far fa-plus-square"></i>
                                            <p> ROLE
                                                <i className="fas fa-angle-left right"></i>
                                            </p>
                                        </a>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link href={route('roles.index')} className={`nav-link ${route().current('roles.index') && 'active'}`}>
                                                    <i className="fa-solid fa-list-ul nav-icon text-warning"></i>
                                                    <p>LIST</p>
                                                </Link>
                                            </li>
                                            {can['role-create'] && (
                                                <li className="nav-item">
                                                    <Link href={route('roles.create')} className={`nav-link ${route().current('roles.create') && 'active'}`}>
                                                        <i className="fa-regular fa-square-plus nav-icon text-info"></i>
                                                        <p>CREATE</p>
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                </>
                            )}
                            {can['user-list'] && (
                                <>
                                    <li className={`nav-item ${(route().current('users.index') || route().current('users.create')) && 'menu-is-opening menu-open'}`}>
                                        <a href="#" className={`nav-link ${(route().current('users.index') || route().current('users.create')) && 'active'}`}>
                                            <i className="nav-icon far fa-plus-square"></i>
                                            <p> USER
                                                <i className="fas fa-angle-left right"></i>
                                            </p>
                                        </a>
                                        <ul className="nav nav-treeview">
                                            <li className="nav-item">
                                                <Link href={route('users.index')} className={`nav-link ${route().current('users.index') && 'active'}`}>
                                                    <i className="fa-solid fa-list-ul nav-icon text-warning"></i>
                                                    <p>LIST</p>
                                                </Link>
                                            </li>
                                            {can['user-create'] && (
                                                <li className="nav-item">
                                                    <Link href={route('users.create')} className={`nav-link ${route().current('users.create') && 'active'}`}>
                                                        <i className="fa-regular fa-square-plus nav-icon text-info"></i>
                                                        <p>CREATE</p>
                                                    </Link>
                                                </li>
                                            )}
                                        </ul>
                                    </li>
                                </>
                            )}
                        </ul>
                    </nav>
                </div>
            </aside> */}
        </>
    );
}