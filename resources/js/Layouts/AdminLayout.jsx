import React, { useEffect } from 'react';
import 'admin-lte/dist/css/adminlte.min.css'; // Ensure styles are loaded
import 'admin-lte/dist/js/adminlte.min.js';
import MenuSideBar from './MenuSideBar';
import $ from 'jquery';
import { Link, usePage } from '@inertiajs/react';

const AdminLayout = ({ breadcrumb, children }) => {

    return (
        <div className="wrapper">

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