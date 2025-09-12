import React, { useEffect, useState } from 'react';
import 'admin-lte/dist/css/adminlte.min.css'; // Ensure styles are loaded
import 'admin-lte/dist/js/adminlte.min.js';
import MenuSideBar from './MenuSideBar';
import $ from 'jquery';
import { Link, usePage } from '@inertiajs/react';

const AdminLayout = ({ breadcrumb, children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const { flash } = usePage().props;

    const handleSidebarToggle = () => {
        setIsSidebarOpen(prev => !prev);
    };

    // Auto-close sidebar on smaller screens
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) { // lg breakpoint - closes sidebar earlier to prevent blur
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        // Check on initial load
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="wrapper">
            {flash?.success && (
                <div className="absolute top-20 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-lg z-50" role="alert">
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

            {flash?.error && (
                <div className="absolute top-20 right-5 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-lg z-50" role="alert">
                    <span className="block sm:inline">{flash.error}</span>
                </div>
            )}

            {/* nav & sidebar */}
            <MenuSideBar isSidebarOpen={isSidebarOpen} onToggle={handleSidebarToggle} />

            {/* Content Wrapper */}
            <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-0l'} pt-8`}>
                {breadcrumb && breadcrumb}
                <section className="content">{children}</section>
            </div>
            
        </div>
    );
};

export default AdminLayout;