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

export default function RolePage({ roles }) {
    const { auth } = usePage().props;
    const can = auth?.can ?? {}; 
    const datasList = roles.data;
    
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({})
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({
            id: '',
            name: ''
        });

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
        destroy(route('roles.destroy', dataEdit.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };
    const headWeb = 'Roles List'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <div className="bg-white min-h-screen font-sans">
            <div className="max-w-screen-xl mx-auto">

                <div className="p-6">
                    {/*-- Actions: Search and Create --*/}
                    <div className="flex items-center justify-between mb-4">
                        {/* Search Bar */}
                        <div className="relative w-1/4">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="bg-white border border-gray-300 rounded-md py-2 pl-10 pr-4 w-full text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search roles..."
                            />
                        </div>
                        {/* Create Role Button */}
                        <Link
                            href={route('roles.create')}
                            className="bg-[#0000FF] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                        >
                            Create Role
                        </Link>
                    </div>

                    {/*-- Roles Table --*/}
                    <div className="overflow-x-auto rounded-lg">
                        <table className="w-full">
                            <thead className="bg-[#E5E7EB] text-black uppercase text-sm">
                                <tr>
                                    <th className="text-left p-4">ID</th>
                                    <th className="text-left p-4">Role Name</th>
                                    <th className="text-left p-4">Created At</th>
                                    {can['role-edit'] || can['role-delete'] ? (
                                        <th className="text-center p-4">Action</th>
                                    ) : null}
                                </tr>
                            </thead>
                            <tbody className="bg-white text-gray-700">
                                {datasList.length > 0 ? (
                                    datasList.map((item) => (
                                        <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                                            <td className="p-4">{item.id}</td>
                                            <td className="p-4 font-medium">{item.name}</td>
                                            <td className="p-4">{moment(item.created_at).format("DD/MM/YYYY")}</td>
                                            {can['role-edit'] || can['role-delete'] ? (
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center space-x-4">
                                                        {can['role-edit'] && (
                                                            <Link href={route('roles.edit', item.id)} className="text-gray-600 hover:text-blue-600">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                        {can['role-delete'] && (
                                                            <button onClick={() => confirmDataDeletion(item)} className="text-gray-600 hover:text-red-600">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            ) : null}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={can['role-edit'] || can['role-delete'] ? 4 : 3} className="p-4 text-center">
                                            There are no records!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/*-- Pagination --*/}
                    <div className="mt-4">
                        <Pagination links={roles.links} />
                    </div>
                </div>
            </div>

            {/*-- Delete Confirmation Modal --*/}
            {confirmingDataDeletion && (
                <div className="fixed inset-0 z-50 bg-opacity-60 flex justify-center items-center">
                    <div className="bg-white text-black p-8 rounded-lg shadow-xl w-full max-w-md">
                        <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
                        <p className="mt-1 text-gray-800">
                            Are you sure you want to delete the role "<strong>{deleteData.name}</strong>"? This action cannot be undone.
                        </p>
                        <div className="mt-6 flex justify-end space-x-4">
                            <button onClick={closeModal} className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-md font-medium">
                                Cancel
                            </button>
                            <button onClick={deleteDataRow} disabled={processing} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium disabled:bg-red-400">
                                {processing ? 'Deleting...' : 'Delete Role'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
        </AdminLayout>
    );
}
