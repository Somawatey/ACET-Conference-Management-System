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

export default function AgendaPage({ agendas }) {
    const { auth } = usePage().props;
    const can = auth?.can ?? {}; 
    
    const datasList = agendas.data;
    const [confirmingDataDeletion, setConfirmingDataDeletion] = useState(false);
    const [dataEdit, setDataEdit] = useState({})
    const { data: deleteData, setData: setDeleteData, delete: destroy, processing, reset, errors, clearErrors } =
        useForm({
            id: '',
            title: ''
        });

    const confirmDataDeletion = (data) => {
        setDataEdit(data);
        setDeleteData('id', data.id)
        setDeleteData('title', data.title)
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
        destroy(route('agenda.destroy', dataEdit.id), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onFinish: () => reset(),
        });
    };

    const formatTime = (datetime) => {
        return moment(datetime).format("hh:mm A");
    };

    const formatDate = (datetime) => {
        return moment(datetime).format("DD/MM/YYYY");
    };
    
    const headWeb = 'Agenda List'
    const linksBreadcrumb = [{ title: 'Home', url: '/' }, { title: headWeb, url: '' }];
    const th = (text) => <th className='text-left p-4'>{text}</th>;
    const td = (text) => <td className='p-4'>{text}</td>;

    return (
        <AdminLayout breadcrumb={<Breadcrumb header={headWeb} links={linksBreadcrumb} />} >
            <Head title={headWeb} />
            <div className="h-full font-sans">
                <div className="max-w-screen-xl mx-auto">
                    {/*-- Header --*/}

                    <div className="px-5">
                    
                        {/*-- Create Agenda Section --*/}
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
                                    placeholder="Search agenda..."
                                />
                            </div>
    
                            {/* This can be a Link to a create page or trigger a modal */}
                            {can['agenda-create'] && (
                                <Link
                                    href={route('agenda.create')}
                                    className="bg-[#0000FF] hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-md transition duration-300"
                                >
                                    Create Agenda
                                </Link>
                            )}
                        </div>

                        {/*-- Agenda Table --*/}
                        <div className="overflow-x-auto rounded-lg">
                            <table className="w-full">
                                {/*-- Table Header --*/}
                                <thead className="bg-[#E5E7EB] text-black uppercase text-sm">
                                    <tr>
                                        {th('ID')}
                                        {th('Title')}
                                        {th('Date')}
                                        {th('Time')}
                                        {th('Location')}
                                        {th('Speaker')}
                                        {th('Actions')}
                                    </tr>
                                </thead>
                                {/*-- Table Body --*/}
                                <tbody className="bg-white text-gray-700">
                                    {datasList.length > 0 ? 
                                        datasList.map((agenda) => (
                                            <tr key={agenda.id} className="border-b border-gray-200 hover:bg-gray-50">
                                                <td className="p-4">{agenda.id}</td>
                                                <td className="p-4 font-medium">
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-900">{agenda.title}</span>
                                                        {agenda.description && (
                                                            <span className="text-sm text-gray-500 truncate max-w-xs">
                                                                {agenda.description.length > 50 
                                                                    ? `${agenda.description.substring(0, 50)}...` 
                                                                    : agenda.description
                                                                }
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-2">{formatDate(agenda.start_time)}</td>
                                                <td className="p-2">
                                                    <div className="flex flex-col text-sm">
                                                        <span className="text-green-600">{formatTime(agenda.start_time)}</span>
                                                        <span className="text-red-600">{formatTime(agenda.end_time)}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    {agenda.location ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {agenda.location}
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No location</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    {agenda.speaker ? (
                                                        <div className="flex items-center">
                                                            <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold mr-2">
                                                                {agenda.speaker.charAt(0).toUpperCase()}
                                                            </div>
                                                            <span className="text-sm">{agenda.speaker}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No speaker</span>
                                                    )}
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center justify-center space-x-4">
                                                        {/*-- Edit Button --*/}
                                                        {can['agenda-edit'] && (
                                                            <Link href={route('agenda.edit', agenda.id)} className="text-gray-600 hover:text-blue-600">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                                </svg>
                                                            </Link>
                                                        )}
                                                        {/*-- Delete Button --*/}
                                                        {can['agenda-delete'] && (
                                                            <button onClick={() => confirmDataDeletion(agenda)} className="text-gray-600 hover:text-red-600">
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
                                            <td colSpan={7} className="text-center p-8">
                                                <div className="flex flex-col items-center">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                    <p className="text-gray-500 text-lg">No agenda items found</p>
                                                    <p className="text-gray-400 text-sm">Create your first agenda item to get started</p>
                                                </div>
                                            </td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>

                        {/*-- Pagination --*/}
                        <div className="p-5">
                            <Pagination links={agendas.links} />
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
                            <p className="mb-4">Are you sure you want to delete the agenda item "<strong>{deleteData.title}</strong>"? This action cannot be undone.</p>
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