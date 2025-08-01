import React, { useEffect } from 'react';
import 'admin-lte/dist/css/adminlte.min.css'; // Ensure styles are loaded
import 'admin-lte/dist/js/adminlte.min.js';
import MenuSideBar from './MenuSideBar';
import $ from 'jquery';
import { Link, usePage } from '@inertiajs/react';

const AdminLayout = ({breadcrumb, children }) => {
    const user = usePage().props.auth.user;
    useEffect(() => {
        // Ensure dropdowns, tooltips, and modals work
        $('[data-toggle="dropdown"]').dropdown();
    }, []);
    
    return (
        <div className="wrapper">
            {/* Navbar */}
            <nav className="main-header navbar navbar-expand navbar-white navbar-light">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <a className="nav-link" data-widget="pushmenu" href="#" role="button">
                            <i className="fas fa-bars"></i>
                        </a>
                    </li>
                </ul>
                {/* <!-- Right navbar links --> */}
                <ul className="navbar-nav ml-auto">
                    {/* Dropdown */}
                    <li className="nav-item dropdown">
                        <a className="nav-link" data-toggle="dropdown" href="#">
                            <i className="far fa-user"></i>
                        </a>
                        <div className="dropdown-menu dropdown-menu-right">
                            <Link href={route('profile.edit')} className="dropdown-item">Profile</Link>
                            <div className="dropdown-divider"></div>
                            <Link
                                className="dropdown-item"
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Logout
                            </Link>
                        </div>
                    </li>
                </ul>
            </nav>

            <MenuSideBar />

            {/* Content Wrapper */}
            <div className="content-wrapper">
                {breadcrumb && breadcrumb}
                <section className="content">{children}</section>
            </div>

            {/* Footer */}
            <footer className="main-footer">
                <strong>Copyright &copy; 2025</strong> All rights reserved.
            </footer>
        </div>
    );
};

export default AdminLayout;
