import Breadcrumb from '@/Components/Breadcrumb';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import NavLink from '@/Components/NavLink';
import Pagination from '@/Components/Pagination';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import SecondaryButtonLink from '@/Components/SecondaryButtonLink';
import AdminLayout from '@/Layouts/AdminLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import moment from 'moment';
import { useState } from 'react';

export default function UserPage({ users }) {
    const { auth } = usePage().props;
    const can = auth?.can ?? {}; 
    
    const datasList = users.data;
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({})
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({
            id: '',
            name: ''
        });

    // Generate user initials from name
    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .slice(0, 2)
            .join('');
    };

    // Check if user has a profile photo
    const hasProfilePhoto = (user) => {
        return user?.profile_photo_url && 
               !user.profile_photo_url.includes('default-avatar') &&
               user.profile_photo_url !== null;
    };

    const confirmDataDeletion = (data) => {
        setDataEdit(data);
        setDeleteData('id', data.id)
        setDeleteData('name', data.name)
        setConfirmingDataDeletion(true);
    };
    
    const closeModal = () => {
        setConfirmingDataDeletion(false);
        setDataEdit({})
        clearErrors();
        reset();
    };

    const deleteDataRow = (e) => {
        e.preventDefault();
        destroy(route('users.destroy', dataEdit.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };
    
    const headWeb = 'User List'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <div className="bg-white min-h-screen font-sans">
                <div className="max-w-screen-xl mx-auto">
                    {/*-- Header --*/}

                    <div className="p-6">
                    
                        {/*-- Create User Section --*/}
                        <div className="flex items-center justify-between mb-4">
                            {/* Input container with relative positioning */}
                            <div className="relative w-1/4">
                                {/* Icon placed absolutely within the container */}
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    className="bg-[#FFFFFF] border border-gray-600 rounded-md py-2 pl-10 pr-4 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Search users..."
                                />
                            </div>
    
                            {/* This can be a Link to a create page or trigger a modal */}
                            {can['user-create'] && (
                                <Link
                                    href={route('users.create')}
                                    className="bg-[#0000FF] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                                >
                                    Create User
                                </Link>
                            )}
                        </div>

                        {/*-- User Table --*/}
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full">
                                {/*-- Table Header --*/}
                                <thead className="bg-[#E5E7EB] text-black uppercase text-sm">
                                    <tr>
                                        <th className="text-left p-4">ID</th>
                                        <th className="text-left p-4">Username</th>
                                        <th className="text-left p-4">Email</th>
                                        <th className="text-left p-4">Role</th>
                                        <th className="text-left p-4">Created At</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                {/*-- Table Body --*/}
                                <tbody className="bg-white text-gray-700">
                                    {datasList.length > 0 ? 
                                        datasList.map((user) => (
                                            <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-4">{user.id}</td>
                                                <td className="p-4 font-medium">
                                                    <div className="flex items-center">
                                                        {hasProfilePhoto(user) ? (
                                                            <img 
                                                                src={user.profile_photo_url} 
                                                                className="w-8 h-8 rounded-full mr-3 object-cover border-2 border-gray-200" 
                                                                alt="User Profile"
                                                            />
                                                        ) : (
                                                            <div 
                                                                className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3"
                                                                style={{
                                                                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                                                                }}
                                                            >
                                                                {getUserInitials(user.name)}
                                                            </div>
                                                        )}
                                                        <span className="text-gray-900">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                                                        {user.email}
                                                    </a>
                                                </td>
                                                <td className="p-4">
                                                    {user?.roles && user.roles.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {user.roles.map((role) => (
                                                                <span 
                                                                    key={role.id} 
                                                                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                                >
                                                                    {role.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            No Role
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="p-4">{moment(user?.created_at).format("DD/MM/YYYY")}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center space-x-4">
                                                        {/*-- Edit Button --*/}
                                                        {can['user-edit'] && (
                                                            <Link href={route('users.edit', user.id)} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                        {/*-- Delete Button --*/}
                                                        {can['user-delete'] && (
                                                            <button onClick={() => confirmDataDeletion(user)} className="text-gray-600 hover:text-red-600 transition-colors duration-200">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                        :
                                        <tr>
                                            <td colSpan={6} className="text-center p-8">
                                                <div className="flex flex-col items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <p className="text-gray-500 text-lg">No users found</p>
                                                    <p className="text-gray-400 text-sm">Create your first user to get started</p>
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/*-- Pagination --*/}
                        <div className="mt-8">
                            <Pagination links={users.links} />
                        </div>
                    </div>
                </div>

                {/*-- Delete Confirmation Modal --*/}
                {confirmingDataDeletion && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center">
                        <div className="bg-white text-black p-8 rounded-lg shadow-xl w-full max-w-md">
                            <div className="flex items-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.867-.833-2.464 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <h2 className="text-2xl font-bold">Confirm Deletion</h2>
                            </div>
                            <p className="mb-4">Are you sure you want to delete the user "<strong>{deleteData.name}</strong>"? This action cannot be undone.</p>
                            {errors.id && <p className="text-red-500 text-sm mt-2">{errors.id}</p>}
                            <div className="mt-6 flex justify-end space-x-4">
                                <button 
                                    onClick={closeModal} 
                                    className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-md transition duration-200"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={deleteDataRow} 
                                    disabled={processing} 
                                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:bg-red-400 transition duration-200"
                                >
                                    {processing ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}