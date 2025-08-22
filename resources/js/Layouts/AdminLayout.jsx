import React, { useEffect } from 'react';
import 'admin-lte/dist/css/adminlte.min.css'; // Ensure styles are loaded
import 'admin-lte/dist/js/adminlte.min.js';
import MenuSideBar from './MenuSideBar';
import $ from 'jquery';
import { Link, usePage } from '@inertiajs/react';

const AdminLayout = ({ breadcrumb, children }) => {
    const { flash } = usePage().props;

    return (
        <div className="wrapper">
            {flash.success && (
                <div className="absolute top-20 right-5 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded" role="alert">
                    <span className="block sm:inline">{flash.success}</span>
                </div>
            )}

            {/* nav & sidebar */}
            <MenuSideBar />

            {/* Content Wrapper */}
            <div className="content-wrapper">
                {breadcrumb && breadcrumb}
                <section className="content">{children}</section>
            </div>
            
        </div>
    );
};

export default AdminLayout;