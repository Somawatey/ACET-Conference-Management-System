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

export default function ConferencePage({ conferences }) {
    const { auth } = usePage().props;
    const can = auth?.can ?? {}; 
    
    const datasList = conferences.data;
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({})
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({
            id: '',
            conf_name: ''
        });

    // Generate conference status badge
    const getStatusBadge = (date) => {
        const confDate = moment(date);
        const today = moment();
        
        if (confDate.isBefore(today, 'day')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Completed
                </span>
            );
        } else if (confDate.isSame(today, 'day')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Ongoing
                </span>
            );
        } else {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Upcoming
                </span>
            );
        }
    };

    const confirmDataDeletion = (data) => {
        setDataEdit(data);
        setDeleteData('id', data.id)
        setDeleteData('conf_name', data.conf_name)
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
        destroy(route('conferences.destroy', dataEdit.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };
    
    const headWeb = 'Conference List'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <div className="bg-white min-h-screen font-sans">
                <div className="max-w-screen-xl mx-auto">
                    {/*-- Header --*/}

                    <div className="p-6">
                    
                        {/*-- Create Conference Section --*/}
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
                                    placeholder="Search conferences..."
                                />
                            </div>
    
                            {/* This can be a Link to a create page or trigger a modal */}
                            {can['conference-create'] && (
                                <Link
                                    href={route('conferences.create')}
                                    className="bg-[#0000FF] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                                >
                                    Create Conference
                                </Link>
                            )}
                        </div>

                        {/*-- Conference Table --*/}
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full">
                                {/*-- Table Header --*/}
                                <thead className="bg-[#E5E7EB] text-black uppercase text-sm">
                                    <tr>
                                        <th className="text-left p-4">ID</th>
                                        <th className="text-left p-4">Conference Name</th>
                                        <th className="text-left p-4">Topic</th>
                                        <th className="text-left p-4">Date</th>
                                        <th className="text-left p-4">Location</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Created At</th>
                                        <th className="p-4">Actions</th>
                                    </tr>
                                </thead>
                                {/*-- Table Body --*/}
                                <tbody className="bg-white text-gray-700">
                                    {datasList.length > 0 ? 
                                        datasList.map((conference) => (
                                            <tr key={conference.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-4">{conference.id}</td>
                                                <td className="p-4 font-medium">
                                                    <div className="flex items-center">
                                                        <span className="text-gray-900">{conference.conf_name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                        {conference.topic}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-gray-900">
                                                            {moment(conference.date).format("DD/MM/YYYY")}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            {moment(conference.date).fromNow()}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-start">
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="mr-2"
                                                            style={{ minWidth: '20px', minHeight: '20px', width: '20px', height: '20px' }}
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        <span className="text-gray-900">{conference.location}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {getStatusBadge(conference.date)}
                                                </td>
                                                <td className="p-4">{moment(conference?.created_at).format("DD/MM/YYYY")}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center space-x-4">
                                                        {/*-- Edit Button --*/}
                                                        {can['conference-edit'] && (
                                                            <Link href={route('conferences.edit', conference.id)} className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                        {/*-- Delete Button --*/}
                                                        {can['conference-delete'] && (
                                                            <button onClick={() => confirmDataDeletion(conference)} className="text-gray-600 hover:text-red-600 transition-colors duration-200">
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
                                            <td colSpan={8} className="text-center p-8">
                                                <div className="flex flex-col items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                    <p className="text-gray-500 text-lg">No conferences found</p>
                                                    <p className="text-gray-400 text-sm">Create your first conference to get started</p>
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        {/*-- Pagination --*/}
                        <div className="mt-8">
                            <Pagination links={conferences.links} />
                        </div>
                    </div>
                </div>
                
                {/*-- Delete Confirmation Modal --*/}
                {confirmingDataDeletion && (
                    <div className="fixed inset-0 z-50 bg-opacity-60 flex justify-center items-center">
                        <div className="bg-white text-black p-8 rounded-lg shadow-xl w-full max-w-md">
                            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                            <p>Are you sure you want to delete the conference "<strong>{deleteData.conf_name}</strong>"? This action cannot be undone.</p>
                            {errors.id && <p className="text-red-500 text-sm mt-2">{errors.id}</p>}
                            <div className="mt-6 flex justify-end space-x-4">
                                <button onClick={closeModal} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-md">
                                    Cancel
                                </button>
                                <button onClick={deleteDataRow} disabled={processing} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:bg-red-400">
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